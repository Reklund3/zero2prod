use crate::domain::SubscriberEmail;
use reqwest::Client;
use secrecy::{ExposeSecret, Secret};
use serde::Deserialize;

#[derive(Clone, Deserialize)]
pub struct ApplicationBaseUrl(String);
impl ApplicationBaseUrl {
    pub fn parse(s: String) -> Result<Self, String> {
        if s.is_empty() {
            Err("Url cannot be empty".into())
        } else {
            Ok(Self(s))
        }
    }
}

impl AsRef<str> for ApplicationBaseUrl {
    fn as_ref(&self) -> &str {
        self.0.as_ref()
    }
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "PascalCase")]
struct SendEmailRequest<'a> {
    from: &'a str,
    to: &'a str,
    subject: &'a str,
    html_body: &'a str,
    text_body: &'a str,
    message_stream: String,
}

#[derive(Clone)]
pub struct EmailClient {
    http_client: Client,
    base_url: ApplicationBaseUrl,
    sender: SubscriberEmail,
    authorization_token: Secret<String>,
}
impl EmailClient {
    pub fn new(
        base_url: ApplicationBaseUrl,
        sender: SubscriberEmail,
        authorization_token: Secret<String>,
        timeout: std::time::Duration,
    ) -> Self {
        let http_client = Client::builder()
            .timeout(timeout)
            .build()
            .expect("Failed to construct the email client.");

        Self {
            http_client,
            base_url,
            sender,
            authorization_token,
        }
    }
    pub async fn send_email(
        &self,
        recipient: &SubscriberEmail,
        subject: &str,
        html_content: &str,
        text_content: &str,
    ) -> Result<(), reqwest::Error> {
        let url = format!("{}/email", self.base_url.as_ref());
        let request_body = SendEmailRequest {
            from: self.sender.as_ref(),
            to: recipient.as_ref(),
            subject: subject,
            html_body: html_content,
            text_body: text_content,
            message_stream: "outbound".into(),
        };
        self.http_client
            .post(&url)
            .header(
                "X-Postmark-Server-Token",
                self.authorization_token.expose_secret(),
            )
            .header("Accept", "application/json")
            .json(&request_body)
            .send()
            .await?
            .error_for_status()?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use crate::domain::SubscriberEmail;
    use crate::email_client::{ApplicationBaseUrl, EmailClient};
    use claims::{assert_err, assert_ok};
    use fake::faker::internet::en::SafeEmail;
    use fake::faker::lorem::en::{Paragraph, Sentence};
    use fake::{Fake, Faker};
    use secrecy::Secret;
    use wiremock::matchers::{any, header, header_exists, method, path};
    use wiremock::{Mock, MockServer, Request, ResponseTemplate};

    struct SendEmailBodyMatcher;
    impl wiremock::Match for SendEmailBodyMatcher {
        fn matches(&self, request: &Request) -> bool {
            let result: Result<serde_json::Value, _> = serde_json::from_slice(&request.body);
            if let Ok(body) = result {
                dbg!(&body);
                body.get("From").is_some()
                    && body.get("To").is_some()
                    && body.get("Subject").is_some()
                    && body.get("HtmlBody").is_some()
                    && body.get("TextBody").is_some()
            } else {
                false
            }
        }
    }

    /// Helper to generate a random email subject.
    fn subject() -> String {
        Sentence(1..2).fake()
    }

    /// Helper to generate a random email content.
    fn content() -> String {
        Paragraph(1..10).fake()
    }

    /// Helper to generate a random email.
    fn email() -> SubscriberEmail {
        SubscriberEmail::parse(SafeEmail().fake()).unwrap()
    }

    /// Helper that constructs the email client.
    fn email_client(base_url: ApplicationBaseUrl) -> EmailClient {
        EmailClient::new(
            base_url,
            email(),
            Secret::new(Faker.fake()),
            std::time::Duration::from_millis(200),
        )
    }

    #[tokio::test]
    async fn send_email_sends_the_expected_request() {
        let mock_server = MockServer::start().await;
        let mock_server_uri =
            ApplicationBaseUrl::parse(mock_server.uri()).expect("Failed to parse mock server uri");
        let email_client = email_client(mock_server_uri);

        Mock::given(header_exists("X-Postmark-Server-Token"))
            .and(header("Content-Type", "application/json"))
            .and(path("/email"))
            .and(method("POST"))
            .and(SendEmailBodyMatcher)
            .respond_with(ResponseTemplate::new(200))
            .expect(1)
            .mount(&mock_server)
            .await;

        let subcriber_email = SubscriberEmail::parse(SafeEmail().fake()).unwrap();

        let content: String = content();
        let _ = email_client
            .send_email(
                subcriber_email,
                subject().as_str(),
                content.as_str(),
                content.as_str(),
            )
            .await;
    }

    #[tokio::test]
    async fn send_email_succeeds_if_the_server_returns_200() {
        let mock_server = MockServer::start().await;
        let mock_server_uri =
            ApplicationBaseUrl::parse(mock_server.uri()).expect("Failed to parse mock server uri");
        let email_client = email_client(mock_server_uri);

        Mock::given(any())
            .respond_with(ResponseTemplate::new(200))
            .expect(1)
            .mount(&mock_server)
            .await;

        let subcriber_email = SubscriberEmail::parse(SafeEmail().fake()).unwrap();

        let content: String = content();
        let outcome = email_client
            .send_email(
                subcriber_email,
                subject().as_str(),
                content.as_str(),
                content.as_str(),
            )
            .await;

        assert_ok!(outcome);
    }

    #[tokio::test]
    async fn send_email_fails_if_the_server_returns_500() {
        let mock_server = MockServer::start().await;
        let mock_server_uri =
            ApplicationBaseUrl::parse(mock_server.uri()).expect("Failed to parse mock server uri");
        let email_client = email_client(mock_server_uri);

        Mock::given(any())
            .respond_with(ResponseTemplate::new(500))
            .expect(1)
            .mount(&mock_server)
            .await;

        let subcriber_email = SubscriberEmail::parse(SafeEmail().fake()).unwrap();

        let content: String = content();
        let outcome = email_client
            .send_email(
                subcriber_email,
                subject().as_str(),
                content.as_str(),
                content.as_str(),
            )
            .await;

        assert_err!(outcome);
    }

    #[tokio::test]
    async fn send_email_times_out_if_the_server_takes_too_long() {
        let mock_server = MockServer::start().await;
        let mock_server_uri =
            ApplicationBaseUrl::parse(mock_server.uri()).expect("Failed to parse mock server uri");
        let email_client = email_client(mock_server_uri);

        let response = ResponseTemplate::new(200).set_delay(std::time::Duration::from_secs(180));
        Mock::given(any())
            .respond_with(response)
            .expect(1)
            .mount(&mock_server)
            .await;

        let subcriber_email = SubscriberEmail::parse(SafeEmail().fake()).unwrap();

        let content: String = content();
        let outcome = email_client
            .send_email(
                subcriber_email,
                subject().as_str(),
                content.as_str(),
                content.as_str(),
            )
            .await;

        assert_err!(outcome);
    }
}
