#[tarpc::service]
pub trait World {
    async fn hello(name: String) -> String;
}
