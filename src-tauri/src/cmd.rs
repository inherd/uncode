use serde::Deserialize;

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  LogOperation { event: String, payload: Option<String> },
  OpenDirectory { payload: Option<String> },
}
