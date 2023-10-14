use actix_web::web::{Data, Form};
use actix_web::{post, HttpResponse};
use chrono::Utc;
use serde::Deserialize;
use sqlx::{Error, PgPool};
use uuid::Uuid;

#[derive(Debug, Deserialize)]
struct FormData {
    email: String,
    name: String,
}

#[post("/subscriptions")]
#[tracing::instrument(
    name = "Adding a new subscriber.",
    skip(form, pool),
    fields(
        subscriber_email = %form.email,
        subscriber_name = %form.name
    )
)]
async fn subscribe(form: Form<FormData>, pool: Data<PgPool>) -> HttpResponse {
    match insert_subscriber(&form, &pool).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[tracing::instrument(
    name = "Saving new subscriber details in the database."
    skip(form, pool)
)]
async fn insert_subscriber(form: &FormData, pool: &PgPool) -> Result<(), Error> {
    sqlx::query!(
        r#"
        INSERT INTO subscriptions (id, email, name, subscribed_at)
        VALUES ($1, $2, $3, $4)
        "#,
        Uuid::new_v4(),
        form.email,
        form.name,
        Utc::now()
    )
    .execute(pool)
    .await
    .map_err(|e| {
        tracing::error!("Failed to execute query: {:?}", e);
        e
    })?;
    Ok(())
}
