#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[macro_use]
extern crate log;

mod cmd;

use serde::Serialize;

#[derive(Serialize)]
struct Reply {
  data: String,
}

#[derive(Serialize)]
struct Workspace {
  pub path: String,
}

fn main() {
  setup_log();

  tauri::Builder::default()
    .on_page_load(|window, _| {
      let window_ = window.clone();
      window.listen("js-event".to_string(), move |event| {
        println!("got js-event with message '{:?}'", event.payload());
        let reply = Reply {
          data: "something else".to_string(),
        };

        window_
          .emit(&"rust-event".to_string(), Some(reply))
          .expect("failed to emit");
      });

      window
        .emit(&"bootstrap".to_string(), Some(""))
        .expect("failed to emit");
    })
    .invoke_handler(tauri::generate_handler![
      cmd::log_operation,
      cmd::perform_request,
      cmd::open_directory,
      cmd::get_story,
      cmd::set_title,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

fn setup_log() {
  use tracing_subscriber::prelude::*;
  let filter_layer = tracing_subscriber::filter::LevelFilter::DEBUG;
  let fmt_layer = tracing_subscriber::fmt::layer()
    // Display target (eg "my_crate::some_mod::submod") with logs
    .with_target(true);

  tracing_subscriber::registry()
    .with(filter_layer)
    .with(fmt_layer)
    .init();
}
