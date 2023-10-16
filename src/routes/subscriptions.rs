use crate::domain::new_subscriber::NewSubscriber;
use crate::domain::subscriber_name::SubscriberName;
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
    match SubscriberName::parse(form.0.name) {
        Ok(name) => {
            let new_subscriber = NewSubscriber {
                email: form.0.email,
                name,
            };
            match insert_subscriber(&new_subscriber, &pool).await {
                Ok(_) => HttpResponse::Ok().finish(),
                Err(_) => HttpResponse::InternalServerError().finish(),
            }
        }
        Err(e) => HttpResponse::BadRequest().body(e),
    }
}

#[tracing::instrument(
    name = "Saving new subscriber details in the database."
    skip(pool)
)]
async fn insert_subscriber(new_subscriber: &NewSubscriber, pool: &PgPool) -> Result<(), Error> {
    sqlx::query!(
        r#"
        INSERT INTO subscriptions (id, email, name, subscribed_at)
        VALUES ($1, $2, $3, $4)
        "#,
        Uuid::new_v4(),
        new_subscriber.email,
        new_subscriber.name.as_ref(),
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
