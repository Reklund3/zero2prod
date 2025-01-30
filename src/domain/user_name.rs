use unicode_segmentation::UnicodeSegmentation;

const FORBIDDEN_CHARACTERS: [char; 9] = ['/', '(', ')', '"', '<', '>', '\\', '{', '}'];

/// Type wrapper for a subscribers name.
#[derive(Debug)]
pub struct UserName(String);
impl UserName {
    pub fn parse(s: String) -> Result<Self, String> {
        if s.trim().is_empty() {
            Err("User name cannot be empty".into())
        } else if s.graphemes(true).count() > 256 {
            Err("Please enter a shorter name.".into())
        } else if s.chars().any(|g| FORBIDDEN_CHARACTERS.contains(&g)) {
            Err("Name contains illegal characters, please remove and try again.".into())
        } else {
            Ok(Self(s))
        }
    }
}

impl AsRef<str> for UserName {
    fn as_ref(&self) -> &str {
        self.0.as_str()
    }
}

#[cfg(test)]
mod tests {
    use crate::domain::UserName;
    use claims::{assert_err, assert_ok};

    #[test]
    fn a_256_long_user_name_is_valid() {
        let name = "a̐".repeat(256);
        assert_ok!(UserName::parse(name));
    }

    #[test]
    fn a_user_name_longer_than_256_is_rejected() {
        let name = "a".repeat(257);
        assert_err!(UserName::parse(name));
    }

    #[test]
    fn whitespace_only_names_are_rejected() {
        let name = " ".to_string();
        assert_err!(UserName::parse(name));
    }

    #[test]
    fn empty_string_is_rejected() {
        let name = "".to_string();
        assert_err!(UserName::parse(name));
    }

    #[test]
    fn names_containing_an_invalid_character_are_rejected() {
        for name in &['/', '(', ')', '"', '<', '>', '\\', '{', '}'] {
            let name = name.to_string();
            assert_err!(UserName::parse(name));
        }
    }

    #[test]
    fn a_valid_name_is_parsed_successfully() {
        let name = "Ursula Le Guin".to_string();
        assert_ok!(UserName::parse(name));
    }
}
