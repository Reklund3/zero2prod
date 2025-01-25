use crate::domain::{ContactMessage, UserEmail, UserName};

#[derive(Debug)]
pub struct VerifiedContactForm {
    pub email: UserEmail,
    pub name: UserName,
    pub message: ContactMessage,
}
