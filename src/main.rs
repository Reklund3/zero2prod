use std::net::TcpListener;
use zero2prod::run;

#[actix_web::main] // or #[tokio::main]
pub async fn main() -> std::io::Result<()> {
    let listener =
        TcpListener::bind("127.0.0.1:8080").expect("Failed to bind the server address and port");
    run(listener)?.await
}
