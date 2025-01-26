use crate::domain::{ContactMessage, UserEmail, UserName, VerifiedContactForm};
use crate::email_client::EmailClient;
use crate::routes::error_chain_fmt;
use actix_web::http::StatusCode;
use actix_web::web::{Data, Json};
use actix_web::{HttpResponse, ResponseError};
use anyhow::Context;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::fmt::{Debug, Formatter};
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct ContactFormData {
    name: String,
    email: String,
    message: String,
}

impl TryFrom<ContactFormData> for VerifiedContactForm {
    type Error = String;

    fn try_from(value: ContactFormData) -> Result<Self, Self::Error> {
        let name = UserName::parse(value.name)?;
        let email = UserEmail::parse(value.email)?;
        let message = ContactMessage::parse(value.message)?;
        Ok(VerifiedContactForm {
            name,
            email,
            message,
        })
    }
}

#[derive(thiserror::Error)]
pub enum ContactError {
    #[error("{0}")]
    ValidationError(String),
    #[error(transparent)]
    UnexpectedError(#[from] anyhow::Error),
}

impl Debug for ContactError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        error_chain_fmt(self, f)
    }
}

impl ResponseError for ContactError {
    fn status_code(&self) -> StatusCode {
        match self {
            ContactError::ValidationError(_) => StatusCode::BAD_REQUEST,
            ContactError::UnexpectedError(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}

#[derive(Serialize)]
struct ContactRejected {
    reason: String,
}

#[tracing::instrument(
    name = "Adding a new contact",
    skip(form, pool, _email_client),
    fields(
        contact_email = %form.email,
        contact_name = %form.name
    )
)]
pub async fn contact(
    form: Json<ContactFormData>,
    pool: Data<PgPool>,
    _email_client: Data<EmailClient>,
) -> Result<HttpResponse, ContactError> {
    match &VerifiedContactForm::try_from(form.0) {
        Ok(new_contact) => {
            insert_contact(new_contact, &pool)
                .await
                .context("Failed to insert the new contact information")?;
            Ok(HttpResponse::Ok().finish())
        }
        Err(error) => {
            match serde_json::to_string(&ContactRejected {
                reason: error.to_string(),
            }) {
                Ok(body) => Ok(HttpResponse::BadRequest().body(body)),
                Err(_) => Ok(HttpResponse::InternalServerError()
                    .body("Something went wrong, please try again.".to_string())),
            }
        }
    }
}

#[tracing::instrument(
    name = "Saving new contact details in the database."
    skip(pool)
)]
async fn insert_contact(form: &VerifiedContactForm, pool: &PgPool) -> Result<Uuid, sqlx::Error> {
    // Do not change the NAMESPACE_DNS this will break the consistent hash and might lead to collisions.
    let contact_id = Uuid::new_v5(&Uuid::NAMESPACE_DNS, form.email.as_ref().as_bytes());
    sqlx::query!(
        r#"
            INSERT INTO contacts (id, email, name, message, contact_time)
            VALUES ($1, $2, $3, $4, $5)
        "#,
        contact_id,
        form.email.as_ref(),
        form.name.as_ref(),
        form.message.as_ref(),
        chrono::Utc::now()
    )
    .execute(pool)
    .await?;
    Ok(contact_id)
}
