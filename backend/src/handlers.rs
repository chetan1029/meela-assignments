use poem::{handler, web::Data, web::Json};
use sqlx::SqlitePool;
use poem::web::{Path};
use crate::{models::{HelloResponse, QuestionWithOptions, Question, OptionItem, SubmissionInput, Submission}};
use crate::error::Error;


#[handler]
pub async fn hello(
    Data(pool): Data<&SqlitePool>,
    Path(name): Path<String>,
) -> Result<Json<HelloResponse>, Error> {
    let r = sqlx::query!("select concat('Hello from different model - ', $1) as hello", name)
        .fetch_one(pool)
        .await?;
    let Some(hello) = r.hello else {
        Err(Error::QueryFailed)?
    };

    Ok(Json(HelloResponse { hello }))
}

#[handler]
pub async fn get_form_data(
    Data(pool): Data<&SqlitePool>
) -> Result<Json<Vec<QuestionWithOptions>>, Error> {
    let rows: Vec<Question> = sqlx::query_as!(
        Question,
        r#"
        SELECT
            q.id,
            q.step,
            q.question,
            q.description,
            q.multiple,
            q.optional,
            q.min_selection,
            q.max_selection,
            o.id AS option_id,
            o.text AS option_text
        FROM questions q
        LEFT JOIN options o ON o.question_id = q.id
        ORDER BY q.step, q.id, o.id
        "#
    )
    .fetch_all(pool)
    .await?;

    let mut questions_map = std::collections::HashMap::<i64, QuestionWithOptions>::new();

    for row in rows {
        let question = questions_map.entry(row.id).or_insert_with(|| QuestionWithOptions {
            id: row.id,
            step: row.step,
            question: row.question,
            description: row.description,
            multiple: row.multiple,
            optional: row.optional,
            min_selection: row.min_selection,
            max_selection: row.max_selection,
            options: Vec::new(),
        });

        if let (Some(option_id), Some(option_text)) = (row.option_id, row.option_text.clone()) {
            question.options.push(OptionItem {
                id: option_id,
                text: option_text,
            });
        }
    }

    let mut questions: Vec<_> = questions_map.into_values().collect();
    questions.sort_by_key(|q| q.step);
    Ok(Json(questions))
}

#[handler]
pub async fn save_submission(
    Data(pool): Data<&SqlitePool>,
    Json(input): Json<SubmissionInput>,
) -> Result<Json<Submission>, Error> {
    let rec = sqlx::query_as::<_, Submission>(
        r#"
        INSERT INTO submissions (user_uuid, form_data, step)
        VALUES (?, ?, ?)
        ON CONFLICT(user_uuid) DO UPDATE SET
            form_data = excluded.form_data,
            step = excluded.step,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id, user_uuid, form_data, step, created_at, updated_at
        "#
    )
    .bind(&input.user_uuid)
    .bind(&input.form_data.to_string())
    .bind(input.step)
    .fetch_one(pool)
    .await?;

    Ok(Json(rec))
}

#[handler]
pub async fn get_submission(
    Data(pool): Data<&SqlitePool>,
    user_uuid: poem::web::Path<String>,
) -> Result<Json<Option<Submission>>, Error> {
    let rec = sqlx::query_as::<_, Submission>(
        r#"
        SELECT 
            id,
            user_uuid,
            form_data,
            step,
            created_at,
            updated_at
        FROM submissions
        WHERE user_uuid = ?
        "#
    )
    .bind(&*user_uuid)
    .fetch_optional(pool)
    .await?;

    Ok(Json(rec))
}