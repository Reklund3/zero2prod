use std::net::TcpListener;
use tokio::task::JoinHandle;

fn spawn_app() -> (JoinHandle<std::io::Result<()>>, String) {
    let listener = TcpListener::bind("127.0.0.1:0").expect("failed to bind port for test.");
    let port = listener.local_addr().unwrap().port();
    let server = zero2prod::run(listener).expect("failed to start the test server");
    let handle = tokio::spawn(server);
    (handle, format!("http://127.0.0.1:{}", port))
}

#[tokio::test]
async fn health_check_test() {
    // get a handle to the server
    let (handle, address) = spawn_app();

    let client = reqwest::Client::new();

    let response = client
        .get(&format!("{}/health_check", &address))
        .send()
        .await
        .expect("failed to send request");
    // once the test completes we can stop the server
    handle.abort();
    assert!(response.status().is_success());
    assert_eq!(response.status().as_u16(), 200);
    assert_eq!(response.content_length(), Some(0))
}

#[tokio::test]
async fn subscribe_returns_a_200_for_valid_form_data() {
    let (handle, address) = spawn_app();

    let client = reqwest::Client::new();

    let body = "name=le%20guin&email=ursula_le_guin%40gmail.com";

    let response = client
        .post(&format!("{}/subscriptions", &address))
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(body)
        .send()
        .await
        .expect("failed to send request");
    // once the test completes we can stop the server
    handle.abort();

    assert_eq!(response.status().as_u16(), 200);
    assert_eq!(response.content_length(), Some(0))
}

#[tokio::test]
async fn subscribe_returns_a_400_when_data_is_missing() {
    let (handle, address) = spawn_app();

    let client = reqwest::Client::new();

    let test_cases = vec![
        ("name=le%20guin", "missing the email"),
        ("email=ursula_le_guin%40gmail.com", "missing the name"),
        ("", "missing both name and email")
    ];

    for (invalid_body, error_message) in test_cases {
        let response = client
            .post(&format!("{}/subscriptions", &address))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .body(invalid_body)
            .send()
            .await
            .expect("failed to send request");
        // once the test completes we can stop the server
        handle.abort();

        assert_eq!(response.status().as_u16(), 400, "The API did not fail with 400 Bad Request when the payload was {}.", error_message);
    }
}