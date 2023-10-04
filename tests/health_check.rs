use reqwest::StatusCode;
use std::net::TcpListener;
use tokio::task::JoinHandle;

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
    assert_eq!(response.status(), StatusCode::from_u16(200).unwrap());
    assert_eq!(response.content_length(), Some(0))
}

fn spawn_app() -> (JoinHandle<std::io::Result<()>>, String) {
    let listener = TcpListener::bind("127.0.0.1:0").expect("failed to bind port for test.");
    let port = listener.local_addr().unwrap().port();
    let server = zero2prod::run(listener).expect("failed to start the test server");
    let handle = tokio::spawn(server);
    (handle, format!("http://127.0.0.1:{}", port))
}
