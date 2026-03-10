use std::time::Duration;
use sqlx::{PgPool, Postgres, Transaction};
use tracing::field::display;
use tracing::Span;
use crate::configuration::Settings;
use crate::domain::UserEmail;
use crate::email_client::EmailClient;
use crate::startup::get_pg_pool;

pub async fn run_acknowledgment_until_stopped(configuration: Settings) -> Result<(), anyhow::Error> {
    let connection_pool = get_pg_pool(&configuration.database);
    let email_client = configuration.email_client.client();
    worker_loop(connection_pool, email_client).await
}

async fn worker_loop(pool: PgPool, email_client: EmailClient) -> Result<(), anyhow::Error> {
    loop {
        match try_execute_task(&pool, &email_client).await { 
            Ok(ExecutionOutcome::EmptyQueue) => {
                tokio::time::sleep(Duration::from_secs(10)).await;
            }
            Err(_) => {
                tokio::time::sleep(Duration::from_secs(1)).await;
            }
            Ok(ExecutionOutcome::TaskCompleted) => {}
        }
    }
}

pub enum ExecutionOutcome {
    TaskCompleted,
    EmptyQueue,
}

#[tracing::instrument(skip_all, fields(subscriber_email=tracing::field::Empty))]
async fn try_execute_task(
    pool: &PgPool,
    email_client: &EmailClient,
) -> Result<ExecutionOutcome, anyhow::Error> {
    let task = dequeue_task(pool).await?;
    if task.is_none() {
        return Ok(ExecutionOutcome::EmptyQueue);
    }
    
    let (transaction, email) = task.unwrap();
    Span::current().record("subscriber_email", display(&email));
    match UserEmail::parse(email.clone()) { 
        Ok(email) => {
            let acknowledgment = get_acknowledgment();
            let msg = format!("Delivering acknowledgement to a new contact. {}", email);
            tracing::info!(msg);
            let temp_me = UserEmail::parse("me@roberteklund.us".to_string());
            if let Err(e) = email_client.send_email(
                // &email,
                &temp_me.unwrap(),
                &acknowledgment.title,
                &acknowledgment.html_content,
                &acknowledgment.text_content,
            ).await {
                tracing::error!(
                    error.cause_chain = ?e,
                    error.message = %e,
                    "Failed to deliver acknowledgement to a new contact. \
                        Skipping.",
                );
            }
        }
        Err(e) => {
            tracing::error!(
                error.cause_chain = ?e,
                error.message = %e,
                "Skipping a contact. \
                    Their stored contact details are invalid",
            );
        }
    }
    delete_task(transaction, &email).await?;
    Ok(ExecutionOutcome::TaskCompleted)
}


type PgTransaction = Transaction<'static, Postgres>;

#[tracing::instrument(skip_all)]
async fn dequeue_task(
    pool: &PgPool,
) -> Result<Option<(PgTransaction, String)>, anyhow::Error> {
    let mut transaction = pool.begin().await?;
    let r = sqlx::query!(
        r#"
        SELECT contact_email
        FROM contact_delivery_queue
        FOR UPDATE
        SKIP LOCKED
        LIMIT 1
        "#,
    )
        .fetch_optional(&mut *transaction)
        .await?;
    if let Some(r) = r {
        Ok(Some((
            transaction,
            r.contact_email,
        )))
    } else {
        Ok(None)
    }
}

#[tracing::instrument(skip_all)]
async fn delete_task(
    mut transaction: PgTransaction,
    email: &str,
) -> Result<(), anyhow::Error> {
    sqlx::query!(
        r#"
        DELETE FROM contact_delivery_queue
        WHERE
            contact_email = $1
        "#,
        email
    )
        .execute(&mut *transaction)
        .await?;
    transaction.commit().await?;
    Ok(())
}

struct Acknowledgment {
    title: String,
    html_content: String,
    text_content: String,   
}

fn get_acknowledgment() -> Acknowledgment {
    Acknowledgment {
        // title: "Thank you for reaching out!".to_string(),
        title: "New Connection Request!".to_string(),
        // html_content: include_str!("templates/acknowledgment.html").to_string(),
        html_content: include_str!("templates/new_contact.html").to_string(),
        // text_content: include_str!("templates/acknowledgment.txt").to_string(),
        text_content: include_str!("templates/new_contact.txt").to_string(),
    }
}