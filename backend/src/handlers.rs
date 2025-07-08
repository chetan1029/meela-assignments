use poem::{handler, web::Data, web::Json};
use sqlx::SqlitePool;
use poem::web::{Path};
use crate::{models::{HelloResponse}, Error};


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