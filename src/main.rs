use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};
use std::net::TcpListener;
use zero2prod::configuration::{get_configuration, EmailClientSettings, Settings};
use zero2prod::domain::SubscriberEmail;
use zero2prod::email_client::EmailClient;
use zero2prod::startup::run;
use zero2prod::telemetry::{get_subscriber, init_subscriber};

#[actix_web::main] // or #[tokio::main]
pub async fn main() -> std::io::Result<()> {
    // configure logging
    let subscriber = get_subscriber("zero2prod".into(), "info".into(), std::io::stdout);
    init_subscriber(subscriber);

    let configuration: Settings = get_configuration().expect("Failed to read configuration file.");
    let pg_pool: Pool<Postgres> = PgPoolOptions::new()
        .acquire_timeout(std::time::Duration::from_secs(2))
        .connect_lazy_with(configuration.database.with_db());
    let pg_pool = configure_database(&configuration.database).await;

    let address = format!(
        "{}:{}",
        configuration.application.host, configuration.application.port
    );
    let listener = TcpListener::bind(address).expect("Failed to bind the server address and port");
    run(listener, pg_pool, email_client)?.await
}
