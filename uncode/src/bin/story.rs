use clap::{App, Arg};
use futures::{future, prelude::*};
use std::{
    io,
    net::{IpAddr, SocketAddr},
};
use tarpc::{
    context,
    server::{self, Channel, Incoming},
    tokio_serde::formats::Json,
};
use uncode::rpc_service::world::World;

// This is the type that implements the generated World trait. It is the business logic
// and is used to start the server.
#[derive(Clone)]
struct HelloServer(SocketAddr);

#[tarpc::server]
impl World for HelloServer {
    async fn hello(self, _: context::Context, name: String) -> String {
        format!("Hello, {}! You are connected from {:?}.", name, self.0)
    }
}

#[tokio::main]
async fn main() -> io::Result<()> {
    env_logger::init();

    let flags = App::new("Hello Server")
        .version("0.1")
        .author("Tim <tikue@google.com>")
        .about("Say hello!")
        .arg(
            Arg::with_name("port")
                .short("p")
                .long("port")
                .value_name("NUMBER")
                .help("Sets the port number to listen on")
                .required(true)
                .takes_value(true),
        )
        .get_matches();

    let port = flags.value_of("port").unwrap();
    let port = port
        .parse()
        .unwrap_or_else(|e| panic!(r#"--port value "{}" invalid: {}"#, port, e));

    let server_addr = (IpAddr::from([0, 0, 0, 0]), port);

    // JSON transport is provided by the json_transport tarpc module. It makes it easy
    // to start up a serde-powered json serialization strategy over TCP.
    let mut listener = tarpc::serde_transport::tcp::listen(&server_addr, Json::default).await?;
    listener.config_mut().max_frame_length(usize::MAX);
    listener
        // Ignore accept errors.
        .filter_map(|r| future::ready(r.ok()))
        .map(server::BaseChannel::with_defaults)
        // Limit channels to 1 per IP.
        .max_channels_per_key(1, |t| t.as_ref().peer_addr().unwrap().ip())
        // serve is generated by the service attribute. It takes as input any type implementing
        // the generated World trait.
        .map(|channel| {
            let server = HelloServer(channel.as_ref().as_ref().peer_addr().unwrap());
            channel.requests().execute(server.serve())
        })
        // Max 10 channels.
        .buffer_unordered(10)
        .for_each(|_| async {})
        .await;

    Ok(())
}
