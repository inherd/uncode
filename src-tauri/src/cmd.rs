use serde::Deserialize;
use tauri::{command};
use uncode_core::StoryModel;
use std::path::PathBuf;
use crate::workspace_config::WorkspaceConfig;
use std::{fs, thread};
use uncode_core::domain::file_entry::FileEntry;

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
pub fn open_directory(payload: String) {
  info!("open_directory: {}", payload);
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
  if let Ok(content) = fs::read_to_string(path.join("modeling.uml")) {
    return content
  }

  error!("lost content {}", path.display());
  return "".to_string()
}


// todo: use parallel to loading file tree
#[command(with_window)]
pub fn load_code_tree<M: tauri::Params>(_window: tauri::Window<M>, root: String) -> String {

  thread::spawn(|| {
    let code_path = PathBuf::from(root);
    let entry = FileEntry::from_path(code_path);
    let result = serde_json::to_string(&entry).expect("lost entry");
    info!("{:?}", result);
    // window.emit(&"loaded_code_tree".to_string(), Some(result)).expect("failure loading")
  });

  "".to_string()
}
