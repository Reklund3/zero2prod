use crate::domain::NewSubscriber;
use crate::domain::SubscriberEmail;
use crate::domain::SubscriberName;
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

impl TryFrom<FormData> for NewSubscriber {
    type Error = String;

    fn try_from(value: FormData) -> Result<Self, Self::Error> {
        let name = SubscriberName::parse(value.name)?;
        let email = SubscriberEmail::parse(value.email)?;
        Ok(NewSubscriber { email, name })
    }
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
    let new_subscriber = form.0.try_into();
    match new_subscriber {
        Ok(subscriber) => match insert_subscriber(&subscriber, &pool).await {
            Ok(_) => HttpResponse::Ok().finish(),
            Err(_) => HttpResponse::InternalServerError().finish(),
        },
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
        new_subscriber.email.as_ref(),
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
