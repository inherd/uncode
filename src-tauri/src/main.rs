#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[macro_use]
extern crate log;

use std::sync::{Arc, Mutex};

use serde::Serialize;

pub use uncode_config::UncodeConfig;

mod cmd;

mod uncode_config;
mod workspace_config;

#[derive(Serialize)]
struct Reply {
  data: String,
}

fn main() {
  setup_log();

  let config = UncodeConfig::read_config();
  let uncode_config = Arc::new(Mutex::new(config));

  tauri::Builder::default()
    .on_page_load(move |window, _| {
      let window_ = window.clone();
      let config = uncode_config.clone();

      window.listen("save_config".to_string(), move |event| {
        info!("{:?}", event.payload());
        let result: UncodeConfig = serde_json::from_str(event.payload().expect("lost payload")).expect("uncode no match model");
        UncodeConfig::save_config(result);

        window_
          .emit(&"rust-event".to_string(), Some(Reply {
            data: "something else".to_string(),
          }))
          .expect("failed to emit");
      });

      window
        .emit(&"bootstrap".to_string(), Some(config.lock().unwrap().json()))
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
