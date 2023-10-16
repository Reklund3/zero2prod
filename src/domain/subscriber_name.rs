use unicode_segmentation::UnicodeSegmentation;

const FORBIDDEN_CHARACTERS: [char; 9] = ['/', '(', ')', '"', '<', '>', '\\', '{', '}'];

/// Type wrapper for a subscribers name.
#[derive(Debug)]
pub struct SubscriberName(String);
impl SubscriberName {
    pub fn parse(s: String) -> Result<Self, String> {
        if s.trim().is_empty() {
            return Err("User name cannot be empty".into());
        } else if s.graphemes(true).count() > 256 {
            return Err("Please enter a shorter name.".into());
        } else if s.chars().any(|g| FORBIDDEN_CHARACTERS.contains(&g)) {
            return Err("Name contains illegal characters, please remove and try again.".into());
        } else {
            Ok(Self(s))
        }
    }
}

impl AsRef<str> for SubscriberName {
    fn as_ref(&self) -> &str {
        self.0.as_str()
    }
}
