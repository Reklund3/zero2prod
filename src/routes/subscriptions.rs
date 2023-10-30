use crate::domain::NewSubscriber;
use crate::domain::SubscriberEmail;
use crate::domain::SubscriberName;
use crate::email_client::{ApplicationBaseUrl, EmailClient};
use actix_web::web::{Data, Form};
use actix_web::{post, HttpResponse};
use chrono::Utc;
use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};
use serde::Deserialize;
use sqlx::{Executor, PgPool, Postgres, Transaction};
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

fn generate_subscription_token() -> String {
    let mut rng = thread_rng();
    std::iter::repeat_with(|| rng.sample(Alphanumeric))
        .map(char::from)
        .take(25)
        .collect()
}

#[post("/subscriptions")]
#[tracing::instrument(
    name = "Adding a new subscriber.",
    skip(pool, email_client, base_url),
    fields(
        subscriber_email = %form.email,
        subscriber_name = %form.name
    )
)]
async fn subscribe(
    form: Form<FormData>,
    pool: Data<PgPool>,
    email_client: Data<EmailClient>,
    base_url: Data<ApplicationBaseUrl>,
) -> HttpResponse {
    let new_subscriber = form.0.try_into();

    let mut transaction = match pool.begin().await {
        Ok(transaction) => transaction,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    match new_subscriber {
        Ok(subscriber) => match insert_subscriber(&subscriber, &mut transaction).await {
            Ok(subscriber_id) => {
                let subscription_token = generate_subscription_token();
                match send_confirmation_email(
                    &email_client,
                    subscriber,
                    base_url.as_ref(),
                    subscription_token.as_str(),
                )
                .await
                {
                    Ok(_) => {
                        match store_token(
                            subscriber_id,
                            subscription_token.as_str(),
                            &mut transaction,
                        )
                        .await
                        {
                            Ok(_) => match transaction.commit().await {
                                Ok(_) => HttpResponse::Ok().finish(),
                                Err(_) => HttpResponse::InternalServerError().finish(),
                            },
                            Err(_) => HttpResponse::InternalServerError().finish(),
                        }
                    }
                    Err(_) => HttpResponse::InternalServerError().finish(),
                }
            }
            Err(_) => HttpResponse::InternalServerError().finish(),
        },
        Err(e) => HttpResponse::BadRequest().body(e),
    }
}

#[tracing::instrument(
    name = "Adding a confirmation email to a new subscriber.",
    skip(email_client, base_url)
)]
pub async fn send_confirmation_email(
    email_client: &EmailClient,
    new_subscriber: NewSubscriber,
    base_url: &ApplicationBaseUrl,
    subscription_token: &str,
) -> Result<(), reqwest::Error> {
    let confirmation_link = format!(
        "{}/subscriptions/confirm?subscription_token={}",
        base_url.as_ref(),
        subscription_token
    );
    let plain_body = &format!(
        "Welcome to our newsletter!\nVisit {} to confirm your subscription",
        confirmation_link
    );
    let html_body = &format!(
        "Welcome to our newsletter!<br />\
                        Click <a href=\"{}\">here</a> to confirm your subscription.",
        confirmation_link
    );
    email_client
        .send_email(new_subscriber.email, "Welcome!", &html_body, &plain_body)
        .await
}

#[tracing::instrument(
    name = "Saving new subscriber details in the database."
    skip(transaction)
)]
async fn insert_subscriber(
    new_subscriber: &NewSubscriber,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<Uuid, sqlx::Error> {
    let subscriber_id = Uuid::new_v4();
    transaction
        .execute(sqlx::query!(
            r#"
            INSERT INTO subscriptions (id, email, name, subscribed_at, status)
            VALUES ($1, $2, $3, $4, 'pending_confirmation')
            "#,
            subscriber_id,
            new_subscriber.email.as_ref(),
            new_subscriber.name.as_ref(),
            Utc::now()
        ))
        .await
        .map_err(|e| {
            tracing::error!("Failed to execute query: {:?}", e);
            e
        })?;
    Ok(subscriber_id)
}

#[tracing::instrument(
    name = "Storing subscription token in the database.",
    skip(subscription_token, transaction)
)]
async fn store_token(
    subscriber_id: Uuid,
    subscription_token: &str,
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<(), sqlx::Error> {
    transaction
        .execute(sqlx::query!(
            r#"
            INSERT INTO subscription_tokens (subscription_token, subscriber_id)
            VALUES ($1, $2)
            "#,
            subscription_token,
            subscriber_id
        ))
        .await
        .map_err(|e| {
            tracing::error!("Failed to execute query: {:?}", e);
            e
        })?;
    Ok(())
}
