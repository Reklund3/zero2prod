use crate::authentication::reject_anonymous_users;
use crate::configuration::{DatabaseSettings, Settings};
use crate::email_client::{ApplicationBaseUrl, EmailClient};
use crate::routes::*;
use actix_session::config::PersistentSession;
use actix_session::storage::RedisSessionStore;
use actix_session::SessionMiddleware;
use actix_web::cookie::time::Duration;
use actix_web::cookie::Key;
use actix_web::dev::Server;
use actix_web::middleware::from_fn;
use actix_web::web::Data;
use actix_web::{web, App, HttpServer};
use actix_web_flash_messages::storage::CookieMessageStore;
use actix_web_flash_messages::FlashMessagesFramework;
use rustls::pki_types::pem::PemObject;
use rustls::pki_types::{CertificateDer, PrivateKeyDer};
use secrecy::{ExposeSecret, Secret};
use sqlx::postgres::PgPoolOptions;
use sqlx::{PgPool, Pool, Postgres};
use std::net::TcpListener;
use tracing_actix_web::TracingLogger;

pub struct Application {
    port: u16,
    server: Server,
}

impl Application {
    pub async fn build(configuration: Settings) -> Result<Self, anyhow::Error> {
        // Postgres pool
        let pg_pool: Pool<Postgres> = get_pg_pool(&configuration.database);

        let sender_email = configuration
            .email_client
            .sender()
            .expect("Invalid sender email address.");
        let email_client_timeout = configuration.email_client.timeout();

        let email_client = EmailClient::new(
            configuration.email_client.base_url,
            sender_email,
            configuration.email_client.authorization_token,
            email_client_timeout,
        );

        // tls config
        let tls_config: rustls::ServerConfig = load_rustls_config(
            configuration.application.cert_file_path.as_str(),
            configuration.application.key_file_path.as_str(),
        );

        let address = format!(
            "{}:{}",
            configuration.application.host, configuration.application.port
        );
        let listener = TcpListener::bind(address)?;
        let port = listener.local_addr().unwrap().port();
        let server = run(
            listener,
            pg_pool,
            email_client,
            configuration.application.base_url,
            configuration.application.hmac_secret,
            configuration.redis_uri,
            tls_config,
        )
        .await?;

        Ok(Self { port, server })
    }

    pub fn port(&self) -> u16 {
        self.port
    }

    pub async fn run_until_stopped(self) -> Result<(), std::io::Error> {
        self.server.await
    }
}

pub fn get_pg_pool(database_configuration: &DatabaseSettings) -> PgPool {
    // Postgres pool
    PgPoolOptions::new()
        .acquire_timeout(std::time::Duration::from_secs(2))
        .connect_lazy_with(database_configuration.connect_options())
}

async fn run(
    listener: TcpListener,
    pg_pool: PgPool,
    email_client: EmailClient,
    base_url: ApplicationBaseUrl,
    hmac_secret: Secret<String>,
    redis_uri: Secret<String>,
    tls_config: rustls::ServerConfig,
) -> Result<Server, anyhow::Error> {
    let db_pool = Data::new(pg_pool);
    let email_client = Data::new(email_client);
    let base_url = Data::new(base_url.clone());
    let secret_key = Key::from(hmac_secret.expose_secret().as_bytes());
    let message_store = CookieMessageStore::builder(secret_key.clone()).build();
    let message_framework = FlashMessagesFramework::builder(message_store).build();
    let redis_store = RedisSessionStore::new(redis_uri.expose_secret()).await?;
    let server = HttpServer::new(move || {
        App::new()
            .wrap(message_framework.clone())
            .wrap(
                SessionMiddleware::builder(redis_store.clone(), secret_key.clone())
                    .session_lifecycle(
                        PersistentSession::default().session_ttl(Duration::seconds(3600)),
                    )
                    .cookie_name("zero2prod".to_string())
                    .cookie_secure(
                        std::env::var("COOKIE_SECURE").unwrap_or("false".to_owned()) == "true",
                    )
                    .cookie_path("/".to_string())
                    .build(),
            )
            .wrap(TracingLogger::default())
            .route("/", web::get().to(home))
            .service(
                web::scope("/admin")
                    .wrap(from_fn(reject_anonymous_users))
                    .route("/dashboard", web::get().to(admin_dashboard))
                    .route("/newsletters", web::get().to(publish_newsletter_form))
                    .route("/newsletters", web::post().to(publish_newsletter))
                    .route("/password", web::get().to(change_password_form))
                    .route("/password", web::post().to(change_password))
                    .route("/logout", web::post().to(log_out)),
            )
            .route("/login", web::get().to(login_form))
            .route("/login", web::post().to(login))
            .route("/health_check", web::get().to(health_check))
            .route("/subscriptions", web::post().to(subscribe))
            .route("/subscriptions/confirm", web::get().to(confirm))
            .app_data(db_pool.clone())
            .app_data(email_client.clone())
            .app_data(base_url.clone())
            .app_data(Data::new(HmacSecret(hmac_secret.clone())))
    })
        // Todo: make this a configurable. production env will/should always be https?
        //  would allow for tests to use non cert paths
    .listen(listener.try_clone()?)?
    .listen_rustls_0_23(listener, tls_config)?
    .run();
    Ok(server)
}

fn load_rustls_config(cert_file_path: &str, key_file_path: &str) -> rustls::ServerConfig {
    rustls::crypto::aws_lc_rs::default_provider()
        .install_default()
        .unwrap();

    // init server config builder with safe defaults
    let config = rustls::ServerConfig::builder().with_no_client_auth();

    // convert files to key/cert objects
    let cert_chain =
        CertificateDer::from_pem_file(cert_file_path).expect("Failed to load certificate chain.");
    let private_key =
        PrivateKeyDer::from_pem_file(key_file_path).expect("Failed to load private key.");

    config
        .with_single_cert(vec![cert_chain], private_key)
        .unwrap()
}

#[derive(Clone)]
pub struct HmacSecret(pub Secret<String>);
