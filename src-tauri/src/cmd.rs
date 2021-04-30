use serde::Deserialize;
use tauri::command;

// #[derive(Deserialize)]
// #[serde(tag = "cmd", rename_all = "camelCase")]
// pub enum Cmd {
//   LogOperation { event: String, payload: Option<String> },
//   GetStory { event: String, payload: Option<String> },
//   OpenDirectory { payload: Option<String> },
// }

#[derive(Debug, Deserialize)]
pub struct RequestBody {
  id: i32,
  name: String,
}

#[command(with_window)]
pub fn log_operation<M: tauri::Params>(
  _window: tauri::Window<M>,
  event: String,
  payload: Option<String>,
) {
  println!("{} {:?}", event, payload);
}

#[command]
pub fn perform_request(endpoint: String, body: RequestBody) -> String {
  println!("{} {:?}", endpoint, body);
  "message response".into()
}
