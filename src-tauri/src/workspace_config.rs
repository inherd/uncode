use serde::{Serialize, Deserialize};

#[allow(dead_code)]
#[derive(Serialize, Deserialize)]
pub struct WorkspaceConfig {
  pub domain: String,
  pub story: String,
  pub design: String,
}

impl Default for WorkspaceConfig {
  fn default() -> Self {
    WorkspaceConfig {
      domain: "".to_string(),
      story: "".to_string(),
      design: "".to_string()
    }
  }
}
