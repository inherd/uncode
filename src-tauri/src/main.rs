#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[macro_use]
extern crate log;

mod cmd;

use serde::{Serialize, Deserialize};
use std::{env, fs};
use std::sync::{Arc, Mutex};
use std::path::PathBuf;
use std::fs::File;

#[derive(Serialize)]
struct Reply {
  data: String,
}

#[derive(Serialize, Deserialize)]
struct Workspace {
  pub path: String,
}

impl Default for Workspace {
  fn default() -> Self {
    Workspace {
      path: "".to_string()
    }
  }
}

impl Workspace {
  pub fn save_config (&self){
    if self.path == ""{
      error!("workspace path is empty");
      return;
    }

    let ws = serde_json::to_string_pretty(self.clone()).expect("error");
    let path = PathBuf::from(self.path.clone()).join(".uncode");
    if !path.exists() {
      let _file = File::create(&path).unwrap();
    }

    let result = fs::write(&path, ws);
    match result {
      Ok(_) => log::info!("save config: {:?}", path),
      Err(e) => log::info!("failed to write data: {}", { e }),
    }
  }
  pub fn json(&self) -> String {
    serde_json::to_string(self.clone()).expect("error")
  }
}

fn main() {
  setup_log();

  info!("{:?}", env::current_dir());
  let mut workspace = Workspace::default();
  if let Ok(dir) = env::current_dir() {
    workspace.path = format!("{}", dir.display());
  };

  let workspace = Arc::new(Mutex::new(workspace));

  tauri::Builder::default()
    .on_page_load(move |window, _| {
      let window_ = window.clone();
      let workspace_ = workspace.clone();

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
        .emit(&"bootstrap".to_string(), Some(workspace.lock().unwrap().json()))
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
