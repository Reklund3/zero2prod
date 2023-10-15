use secrecy::ExposeSecret;
use sqlx::PgPool;
use std::net::TcpListener;
use sqlx::postgres::PgPoolOptions;
use zero2prod::configuration::get_configuration;
use zero2prod::startup::run;
use zero2prod::telemetry::{get_subscriber, init_subscriber};

#[actix_web::main] // or #[tokio::main]
pub async fn main() -> std::io::Result<()> {
    // configure logging
    let subscriber = get_subscriber("zero2prod".into(), "info".into(), std::io::stdout);
    init_subscriber(subscriber);

    let configuration = get_configuration().expect("Failed to read configuration file.");
    let pg_pool = PgPoolOptions::new()
        .acquire_timeout(std::time::Duration::from_secs(2))
        .connect(&configuration.database.connection_string().expose_secret())
        .await
        .expect("Failed to connect to postgres.");
    let address = format!("{}:{}", configuration.application_settings.host, configuration.application_settings.port);
    let listener = TcpListener::bind(address).expect("Failed to bind the server address and port");
    run(listener, pg_pool)?.await
}
