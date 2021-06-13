use lambda::handler_fn;
use ::lib::*;

#[tokio::main]
async fn main() -> Result<(), LambdaError> {
  println!("execute bootstrap#main");
  let runtime_handler = handler_fn(handler);
  lambda::run(runtime_handler).await?;
  Ok(())
}
