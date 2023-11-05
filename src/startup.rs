use crate::configuration::{DatabaseSettings, Settings};
use crate::email_client::{ApplicationBaseUrl, EmailClient};
use crate::routes::*;
use actix_web::dev::Server;
use actix_web::{web, App, HttpServer};
use secrecy::Secret;
use serde::Deserialize;
use sqlx::postgres::PgPoolOptions;
use sqlx::{PgPool, Pool, Postgres};
use std::net::TcpListener;
use tracing_actix_web::TracingLogger;

pub struct Application {
    port: u16,
    server: Server,
}
impl Application {
    pub async fn build(configuration: Settings) -> Result<Self, std::io::Error> {
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
        )?;
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
        .connect_lazy_with(database_configuration.with_db())
}

#[derive(Deserialize)]
pub struct HmacSecret(pub Secret<String>);

fn run(
    listener: TcpListener,
    pg_pool: PgPool,
    email_client: EmailClient,
    base_url: ApplicationBaseUrl,
    hmac_secret: Secret<String>,
) -> Result<Server, std::io::Error> {
    let db_pool = web::Data::new(pg_pool);
    let email_client = web::Data::new(email_client);
    let base_url = web::Data::new(base_url);
    let server = HttpServer::new(move || {
        App::new()
            .wrap(TracingLogger::default())
            .service(health_check)
            .service(home)
            .service(login_form)
            .service(login)
            .service(subscribe)
            .service(confirm)
            .service(publish_newsletter)
            .app_data(db_pool.clone())
            .app_data(email_client.clone())
            .app_data(base_url.clone())
            .app_data(web::Data::new(HmacSecret(hmac_secret.clone())))
    })
    .listen(listener)?
    .run();

    Ok(server)
}
