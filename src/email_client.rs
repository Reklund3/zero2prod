use crate::domain::SubscriberEmail;
use actix_web::delete;
use reqwest::Client;
use serde::Deserialize;

#[derive(Clone, Deserialize)]
pub struct BaseUrl(String);
impl BaseUrl {
    fn parse(s: String) -> Result<Self, String> {
        if s.is_empty() {
            Err("Url cannot be empty".into())
        } else {
            Ok(Self(s))
        }
    }
}

impl AsRef<str> for BaseUrl {
    fn as_ref(&self) -> &str {
        self.0.as_ref()
    }
}

#[derive(Clone)]
pub struct EmailClient {
    http_client: Client,
    base_url: BaseUrl,
    sender: SubscriberEmail,
}
impl EmailClient {
    pub fn new(base_url: BaseUrl, sender: SubscriberEmail) -> Self {
        Self {
            http_client: Client::new(),
            base_url,
            sender,
        }
    }
    pub async fn send_email(
        &self,
        recipient: SubscriberEmail,
        subject: &str,
        html_content: &str,
        text_content: &str,
    ) -> Result<(), String> {
        todo!()
    }
}
