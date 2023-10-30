use crate::helpers::spawn_app;

#[tokio::test]
async fn health_check_works() {
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
