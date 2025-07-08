mod handlers;
mod models;
mod error;

use std::env;
use log::info;
use poem::{
    EndpointExt, Route, Server,
    endpoint::{StaticFileEndpoint, StaticFilesEndpoint},
    get,
    listener::TcpListener,
};
use sqlx::SqlitePool;
use crate::handlers::{hello, get_form_data};
use crate::error::Error;


async fn init_pool() -> Result<SqlitePool, Error> {
    let pool = SqlitePool::connect(&env::var("DATABASE_URL")?).await?;
    Ok(pool)
}


#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv::dotenv()?;
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    info!("Initialize db pool");
    let pool = init_pool().await?;
    let app = Route::new()
        .at("/api/questions", get(get_form_data))
        .at("/api/hello/:name", get(hello))
        .at("/favicon.ico", StaticFileEndpoint::new("www/favicon.ico"))
        .nest("/static/", StaticFilesEndpoint::new("www"))
        .at("*", StaticFileEndpoint::new("www/index.html"))
        .data(pool);
    Server::new(TcpListener::bind("0.0.0.0:3005"))
        .run(app)
        .await?;

    Ok(())
}
