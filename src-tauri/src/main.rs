#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

#[macro_use]
extern crate log;

use serde::{Deserialize, Serialize};

pub use uncode_config::UncodeConfig;
use crate::workspace_config::WorkspaceConfig;
use modeling::render::MermaidRender;
use std::fs;
use std::path::PathBuf;
use framework::FrameworkDetector;
use tauri::{Event, async_runtime, GlobalShortcutManager};

mod cmd;
mod menu;

mod uncode_config;
mod workspace_config;

#[derive(Serialize)]
struct Reply {
  data: String,
}

#[derive(Serialize, Deserialize)]
struct SummaryConfig {
  pub workspace: WorkspaceConfig,
  pub uncode: UncodeConfig,
}

#[derive(Serialize, Deserialize)]
struct ModelingConfig {
  pub root: String,
  pub code: String,
  pub design: String,
}

#[derive(Serialize, Deserialize)]
struct EventPayload {
  event_type: String,
  data: String,
}

fn main() {
  setup_log();

  let uncode = UncodeConfig::read_config();
  let mut workspace = if !uncode.workspace_config.is_empty() {
    WorkspaceConfig::from_path(uncode.workspace_config.clone())
  } else {
    WorkspaceConfig::default()
  };

  let frameworks = FrameworkDetector::detect(&uncode.path).build();
  info!("detect {} to frameworks: {:?}", &uncode.path, frameworks);

  workspace.frameworks = frameworks.frameworks;
  workspace.facets = frameworks.facets;

  let uncode_config = SummaryConfig {
    uncode,
    workspace,
  };

  let mut app = tauri::Builder::default()
    .on_page_load(move |window, _| {
      let window_ = window.clone();

      window.listen("js_event".to_string(), move |event| {
        info!("event_id {:}, event_payload: {:?}", event.id(), event.payload());
        let payload: EventPayload = serde_json::from_str(event.payload().expect("lost payload")).expect("uncode no match model");
        match payload.event_type.as_str() {
          "save_config" => {
            let config: SummaryConfig = serde_json::from_str(&payload.data).expect("unable to convert config");
            UncodeConfig::save_config(config.uncode);
          }
          "build_modeling" => {
            let mermaid_string = build_modeling(&payload);
            window_.emit(&"done_building_model".to_string(), Some(mermaid_string)).expect("failed to emit");
          }
          &_ => {}
        }
      });

      window
        .emit(&"bootstrap".to_string(), Some(serde_json::to_string(&uncode_config).unwrap()))
        .expect("failed to emit");
    })
    .invoke_handler(tauri::generate_handler![
      cmd::log_operation,
      cmd::perform_request,
      cmd::save_workspace,
      cmd::set_title,

      // story
      cmd::get_story,


      cmd::open_file,
      cmd::save_file,
      cmd::open_dir,

      // design
      cmd::get_design
    ])
    .menu(menu::get_menu())
    .on_menu_event(|event| {
      println!("{:?}", event.menu_item_id());
    })
    .build(tauri::generate_context!())
    .expect("error while running tauri application");

  #[cfg(target_os = "macos")]
  app.set_activation_policy(tauri::ActivationPolicy::Regular);
  app.run(|app_handle, e| match e {
    // Application is ready (triggered only once)
    Event::Ready => {
      let app_handle = app_handle.clone();
      // launch a new thread so it doesnt block any channel
      async_runtime::spawn(async move {
        let app_handle = app_handle.clone();
        app_handle
          .global_shortcut_manager()
          .register("CmdOrCtrl+q", move || {
            let app_handle = app_handle.clone();
            app_handle.exit(0);
          })
          .unwrap();
      });
    }
    _ => {}
  })
}

fn build_modeling(payload: &EventPayload) -> String {
  let config: ModelingConfig = serde_json::from_str(&payload.data).expect("unable to convert config");
  let code_path = PathBuf::from(&config.root).join(&config.code);
  let design_path = PathBuf::from(&config.root).join(&config.design).join("modeling.muml");

  info!("start build modeling: {:?}", code_path.display());
  let classes = modeling::by_dir(code_path.clone());
  let mermaid_string = MermaidRender::render(&classes);

  info!("start writing modeling: {:?}", design_path.display());
  let _ = fs::write(design_path, mermaid_string.clone());
  mermaid_string
}

fn setup_log() {
  use tracing_subscriber::prelude::*;
  let filter_layer = tracing_subscriber::filter::LevelFilter::DEBUG;
  let fmt_layer = tracing_subscriber::fmt::layer()
    .with_target(true);

  tracing_subscriber::registry()
    .with(filter_layer)
    .with(fmt_layer)
    .init();
}
