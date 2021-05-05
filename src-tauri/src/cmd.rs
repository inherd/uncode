use std::fs;
use std::fs::File;
use std::io::Read;
use std::path::PathBuf;

use serde::Deserialize;
use tauri::command;

use uncode_core::file_entry::FileEntry;
use uncode_core::StoryModel;

use crate::workspace_config::WorkspaceConfig;

#[derive(Debug, Deserialize)]
pub struct RequestBody {
  id: i32,
  name: String,
}

#[command]
pub fn log_operation(event: String, payload: Option<String>) {
  info!("log: {} {:?}", event, payload);
}

#[command(with_window)]
pub fn set_title<M: tauri::Params>(window: tauri::Window<M>, payload: String) {
  let _ = window.set_title(payload.as_str());
}

#[command]
pub fn perform_request(endpoint: String, body: RequestBody) -> String {
  info!("{} {:?}", endpoint, body);
  "message response".into()
}

#[command]
pub fn save_workspace(config: String, path: String) {
  let ws: WorkspaceConfig = serde_json::from_str(&config).expect("pass config error");
  WorkspaceConfig::save_config(ws, path);
}

#[command]
pub fn get_story(root: String, story: String) -> Vec<StoryModel> {
  let story_path = PathBuf::from(root).join(story);
  let stories = uncode_story::parse_dir(story_path);
  info!("get_story: {:?}", stories.clone());
  stories
}

#[command]
pub fn open_file(path: String) -> String {
  let mut file_content: Vec<u8> = Vec::new();
  let mut file = File::open(path).expect("Unable to open file");
  if let Err(err) = file.read_to_end(&mut file_content) {
    log::error!("open file error: {:?}", err);
    return "".to_string();
  };

  let out = String::from_utf8_lossy(&*file_content);
  out.to_string()
}

#[command]
pub fn open_dir(root: String, code_path: String) -> FileEntry {
  let code_path = PathBuf::from(root).join(code_path);
  let entry = FileEntry::level_one(&code_path);

  entry
}

#[command]
pub fn get_design(root: String, path: String, design_type: String) -> String {
  let design_path = PathBuf::from(root).join(path);
  info!("trying get {} from {}", design_type, design_path.display());
  match design_type.as_str() {
    "modeling" => { handle_modeling(&design_path) }
    "guard" => { handle_guard(&design_path) }
    &_ => { "".to_string() }
  }
}

pub fn handle_guard(path: &PathBuf) -> String {
  if let Ok(content) = fs::read_to_string(path.join("guard.rules")) {
    return content
  }

  error!("lost content {}", path.display());
  return "".to_string()
}

pub fn handle_modeling(path: &PathBuf) -> String {
  if let Ok(content) = fs::read_to_string(path.join("modeling.muml")) {
    return content
  }

  error!("lost content {}", path.display());
  return "".to_string()
}
