use actix_web::dev::Server;
use actix_web::{get, post, App, HttpResponse, HttpServer};
use std::net::TcpListener;
use actix_web::web::Form;
use serde::Deserialize;

#[get("/health_check")]
async fn health_check() -> HttpResponse {
    HttpResponse::Ok().finish()
}

#[derive(Deserialize)]
struct FormData {
    email: String,
    name: String
}

#[post("/subscriptions")]
async fn subscribe(_data: Form<FormData>) -> HttpResponse {
    HttpResponse::Ok().finish()
}

pub fn run(listener: TcpListener) -> Result<Server, std::io::Error> {
    let server = HttpServer::new(|| App::new().service(health_check).service(subscribe))
        .listen(listener)?
        .run();

    Ok(server)
}
