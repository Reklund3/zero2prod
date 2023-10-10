use actix_web::{HttpResponse, post};
use actix_web::web::Form;
use serde::Deserialize;

#[derive(Deserialize)]
struct FormData {
    email: String,
    name: String
}

#[post("/subscriptions")]
async fn subscribe(_data: Form<FormData>) -> HttpResponse {
    HttpResponse::Ok().finish()
}