use std::fs;
use std::fs::File;
use std::path::Path;

use serde::{Deserialize, Serialize};
use serde_json::Value;

#[allow(dead_code)]
#[derive(Serialize, Deserialize)]
pub struct WorkspaceConfig {
  pub domain: String,
  pub story: String,
  pub design: String,
  pub code: String,
  pub frameworks: Vec<framework::Framework>,
  pub facets: Vec<Value>,
}

impl Default for WorkspaceConfig {
  fn default() -> Self {
    WorkspaceConfig {
      domain: "".to_string(),
      story: "".to_string(),
      design: "".to_string(),
      code: "".to_string(),
      frameworks: vec![],
      facets: vec![]
    }
  }
}

impl WorkspaceConfig {
  pub fn save_config<P: AsRef<Path>>(config: WorkspaceConfig, path: P) {
    let ws = serde_json::to_string_pretty(&config).expect("error");
    if !path.as_ref().exists() {
      let _file = File::create(&path).unwrap();
    }

    let result = fs::write(&path, ws);
    match result {
      Ok(_) => log::info!("save config: {:?}", path.as_ref()),
      Err(e) => log::info!("failed to write data: {}", { e }),
    }
  }

  pub fn from_path<P: AsRef<Path>>(path: P) -> WorkspaceConfig {
    let mut app_state = WorkspaceConfig::default();
    let content;

    match fs::read_to_string(&path) {
      Ok(str) => {
        content = str;
      }
      Err(_) => {
        return app_state;
      }
    }

    match serde_json::from_str(&content) {
      Ok(state) => {
        app_state = state;
      }
      Err(_err) => {
        log::error!("error config: {}", content);
      }
    };

    return app_state;
  }
}
