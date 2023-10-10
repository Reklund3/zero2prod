use sqlx::{Connection, PgPool};
use std::net::TcpListener;
use tokio::task::JoinHandle;
use zero2prod::configuration::get_configuration;

pub struct TestApp {
    pub handle: JoinHandle<std::io::Result<()>>,
    pub address: String,
    pub pg_pool: PgPool
}

async fn spawn_app() -> TestApp {
    let listener = TcpListener::bind("127.0.0.1:0").expect("failed to bind port for test.");
    let configuration = get_configuration().expect("Failed to read configuration file");
    let connection_string = configuration.database.connection_string();
    let pg_pool = PgPool::connect(connection_string.as_str())
        .await
        .expect("Failed to connect to Postgres.");
    let port = listener.local_addr().unwrap().port();
    let server = zero2prod::startup::run(listener, pg_pool.clone()).expect("failed to start the test server");
    let handle = tokio::spawn(server);

    TestApp {
        handle,
        address: format!("http://127.0.0.1:{}", port),
        pg_pool: pg_pool,
    }
}

#[tokio::test]
async fn health_check_test() {
    // get a handle to the server
    let test_app = spawn_app().await;

    let client = reqwest::Client::new();

    let response = client
        .get(&format!("{}/health_check", &test_app.address))
        .send()
        .await
        .expect("failed to send request");
    // once the test completes we can stop the server
    test_app.handle.abort();
    assert!(response.status().is_success());
    assert_eq!(response.status().as_u16(), 200);
    assert_eq!(response.content_length(), Some(0))
}

#[tokio::test]
async fn subscribe_returns_a_200_for_valid_form_data() {
    let test_app = spawn_app().await;

    let client = reqwest::Client::new();

    let body = "name=le%20guin&email=ursula_le_guin%40gmail.com";

    let response = client
        .post(&format!("{}/subscriptions", &test_app.address))
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(body)
        .send()
        .await
        .expect("failed to send request");
    // once the test completes we can stop the server
    test_app.handle.abort();

    assert_eq!(response.status().as_u16(), 200);
    assert_eq!(response.content_length(), Some(0));

    let saved = sqlx::query!("SELECT email, name FROM subscriptions",)
        .fetch_one(&test_app.pg_pool)
        .await
        .expect("Failed to fetch saved subscription.");

    assert_eq!(saved.email, "ursula_le_guin@gmail.com");
    assert_eq!(saved.name, "le guin");
}

#[tokio::test]
async fn subscribe_returns_a_400_when_data_is_missing() {
    let test_app = spawn_app().await;

    let client = reqwest::Client::new();

    let test_cases = vec![
        ("name=le%20guin", "missing the email"),
        ("email=ursula_le_guin%40gmail.com", "missing the name"),
        ("", "missing both name and email"),
    ];

    for (invalid_body, error_message) in test_cases {
        let response = client
            .post(&format!("{}/subscriptions", &test_app.address))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .body(invalid_body)
            .send()
            .await
            .expect("failed to send request");
        // once the test completes we can stop the server
        test_app.handle.abort();

        assert_eq!(
            response.status().as_u16(),
            400,
            "The API did not fail with 400 Bad Request when the payload was {}.",
            error_message
        );
    }
}
