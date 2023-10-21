use reqwest::Client;
use crate::domain::SubscriberEmail;

struct BaseUrl(String);
impl BaseUrl {
    fn parse(s: String) -> Result<Self, String> {
        if(s.is_empty()) {
            Err("Url cannot be empty".into())
        }
        else {
            Ok(Self(s))
        }
    }
}

impl AsRef<str> for BaseUrl {
    fn as_ref(&self) -> &str {
        self.0.as_ref()
    }
}

pub struct EmailClient {
    http_client: Client,
    base_url: BaseUrl,
    sender: SubscriberEmail,
}
impl EmailClient {
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
