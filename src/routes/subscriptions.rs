use actix_web::web::Form;
use actix_web::{post, HttpResponse};
use serde::Deserialize;

#[derive(Deserialize)]
struct FormData {
    email: String,
    name: String,
}

#[post("/subscriptions")]
async fn subscribe(_data: Form<FormData>) -> HttpResponse {
    HttpResponse::Ok().finish()
}
