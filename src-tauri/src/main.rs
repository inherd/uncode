#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod cmd;

use serde::Serialize;
use std::sync::{Arc, Mutex};

#[derive(Serialize)]
struct Reply {
  data: String,
}

#[derive(Serialize)]
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

fn main() {
  let workspace = Arc::new(Mutex::new(Workspace::default()));
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
    })
    .invoke_handler(tauri::generate_handler![
      cmd::log_operation,
      cmd::perform_request
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
