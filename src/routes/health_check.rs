use actix_web;

pub async fn health_check() -> actix_web::HttpResponse {
    actix_web::HttpResponse::Ok().finish()
}
