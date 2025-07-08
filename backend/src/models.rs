use serde::{Serialize};

#[derive(Serialize)]
pub struct HelloResponse {
    pub hello: String,
}

#[derive(Debug, sqlx::FromRow)]
pub struct Question {
    pub id: i64,
    pub step: i64,
    pub question: String,
    pub description: Option<String>,
    pub multiple: bool,
    pub optional: bool,
    pub min_selection: Option<i64>,
    pub max_selection: Option<i64>,
    pub option_id: Option<i64>, 
    pub option_text: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct OptionItem {
    pub id: i64,
    pub text: String,
}

#[derive(Debug, Serialize)]
pub struct QuestionWithOptions {
    pub id: i64,
    pub step: i64,
    pub question: String,
    pub description: Option<String>,
    pub multiple: bool,
    pub min_selection: Option<i64>,
    pub max_selection: Option<i64>,
    pub optional: bool,
    pub options: Vec<OptionItem>,
}