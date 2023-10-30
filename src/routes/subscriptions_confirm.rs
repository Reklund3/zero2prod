use actix_web::web::Data;
use actix_web::{get, web, HttpResponse};
use sqlx::PgPool;
use uuid::Uuid;

#[derive(serde::Deserialize)]
pub struct Parameters {
    subscription_token: String,
}

#[get("/subscriptions/confirm")]
#[tracing::instrument(name = "Confirm a pending subscriber.", skip(parameters, pool))]
pub async fn confirm(parameters: web::Query<Parameters>, pool: Data<PgPool>) -> HttpResponse {
    match get_subscriber_id_from_token(&parameters.subscription_token.as_str(), &pool).await {
        Ok(maybe_id) => match maybe_id {
            Some(id) => match confirm_subscriber(id, &pool).await {
                Ok(_) => HttpResponse::Ok().finish(),
                Err(_) => HttpResponse::InternalServerError().finish(),
            },
            None => HttpResponse::Unauthorized().finish(),
        },
        Err(_) => return HttpResponse::InternalServerError().finish(),
    }
}

#[tracing::instrument(name = "Marking the subscriber as confirmed.", skip(pool))]
async fn confirm_subscriber(subscriber_id: Uuid, pool: &PgPool) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"UPDATE subscriptions SET status = 'confirmed' WHERE id = $1"#,
        subscriber_id,
    )
    .execute(pool)
    .await
    .map_err(|e| {
        tracing::error!("Failed to execute query: {:?}", e);
        e
    })?;
    Ok(())
}

#[tracing::instrument(
    name = "Fetching the subscriber id with the subscription token.",
    skip(subscription_token, pool)
)]
async fn get_subscriber_id_from_token(
    subscription_token: &str,
    pool: &PgPool,
) -> Result<Option<Uuid>, sqlx::Error> {
    let result = sqlx::query!(
        r#"
            SELECT (subscriber_id) FROM subscription_tokens
            WHERE subscription_token = $1
        "#,
        subscription_token,
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| {
        tracing::error!("Failed to execute query: {:?}", e);
        e
    })?;
    Ok(result.map(|r| r.subscriber_id))
}
