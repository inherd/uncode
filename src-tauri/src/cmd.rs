use serde::Deserialize;
use tauri::command;
use uncode_core::StoryModel;

#[derive(Debug, Deserialize)]
pub struct RequestBody {
  id: i32,
  name: String,
}

#[command]
pub fn log_operation(event: String, payload: Option<String>) {
  info!("log: {} {:?}", event, payload);
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
pub fn get_story(dir: String) -> Vec<StoryModel> {
  let stories = uncode_story::parse_dir(dir);
  info!("get_story: {:?}", stories.clone());
  stories
}
