#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[macro_use]
extern crate log;

mod cmd;

pub use uncode_config::UncodeConfig;
mod uncode_config;

use serde::{Serialize, Deserialize};
use std::{env, fs};
use std::sync::{Arc, Mutex};
use std::path::PathBuf;
use std::fs::File;

#[derive(Serialize)]
struct Reply {
  data: String,
}

fn main() {
  setup_log();

  info!("{:?}", env::current_dir());
  let mut workspace = UncodeConfig::default();
  if let Ok(dir) = env::current_dir() {
    workspace.path = format!("{}", dir.display());
  };

  let uncode_config = Arc::new(Mutex::new(workspace));

  tauri::Builder::default()
    .on_page_load(move |window, _| {
      let window_ = window.clone();
      let workspace_ = uncode_config.clone();

      window.listen("save_config".to_string(), move |_event| {
        let ws = workspace_.lock().unwrap();
        ws.save_config();

        window_
          .emit(&"rust-event".to_string(), Some(Reply {
            data: "something else".to_string(),
          }))
          .expect("failed to emit");
      });

      window
        .emit(&"bootstrap".to_string(), Some(uncode_config.lock().unwrap().json()))
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
