const FORBIDDEN_CHARACTERS: [char; 2] = ['<', '>'];

#[derive(Debug)]
pub struct ContactMessage(String);
impl ContactMessage {
    pub fn parse(message: String) -> Result<Self, String> {
        if message.trim().is_empty() {
            Err("Please provide a message to assist in .".into())
        } else if message.len() > 1024 {
            Err("Please provide a message that is less than 1024 characters.".into())
        } else if message.chars().any(|g| FORBIDDEN_CHARACTERS.contains(&g)) {
            Err("Message contains illegal characters, please remove and try again.".into())
        } else {
            Ok(Self(message))
        }
    }
}

impl AsRef<str> for ContactMessage {
    fn as_ref(&self) -> &str {
        self.0.as_str()
    }
}

#[cfg(test)]
mod tests {
    use crate::domain::ContactMessage;
    use claims::{assert_err, assert_ok};

    #[test]
    fn a_1024_long_message_is_valid() {
        let message = "a".repeat(1024);
        assert_ok!(ContactMessage::parse(message));
    }

    #[test]
    fn a_message_longer_than_256_is_rejected() {
        let message = "a".repeat(1025);
        assert_err!(ContactMessage::parse(message));
    }

    #[test]
    fn whitespace_only_messages_are_rejected() {
        let message = " ".to_string();
        assert_err!(ContactMessage::parse(message));
    }

    #[test]
    fn empty_string_is_rejected() {
        let message = "".to_string();
        assert_err!(ContactMessage::parse(message));
    }

    // #[test]
    // fn messages_containing_an_invalid_character_are_rejected() {
    //     for message in &['/', '(', ')', '"', '<', '>', '\\', '{', '}'] {
    //         let message = message.to_string();
    //         assert_err!(Message::parse(message));
    //     }
    // }

    #[test]
    fn a_valid_message_is_parsed_successfully() {
        let message =
            "We are interested in a backend dev experienced in event driven systems".to_string();
        assert_ok!(ContactMessage::parse(message));
    }
}
