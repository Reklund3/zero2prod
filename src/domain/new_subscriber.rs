use crate::domain::user_email::UserEmail;
use crate::domain::user_name::UserName;

#[derive(Debug)]
pub struct NewSubscriber {
    pub email: UserEmail,
    pub name: UserName,
}
