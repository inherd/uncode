use serde::Deserialize;
use tauri::{command};
use uncode_core::StoryModel;
use std::path::PathBuf;

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
pub fn get_story(root: String, story: String) -> Vec<StoryModel> {
  let story_path = PathBuf::from(root).join(story);
  let stories = uncode_story::parse_dir(story_path);
  info!("get_story: {:?}", stories.clone());
  stories
}
