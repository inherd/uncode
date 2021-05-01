use std::fs::File;
use std::fs;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct UncodeConfig {
  pub path: String,
}

impl Default for UncodeConfig {
  fn default() -> Self {
    UncodeConfig {
      path: "".to_string()
    }
  }
}

impl UncodeConfig {
  pub fn save_config (&self){
    if self.path == ""{
      error!("workspace path is empty");
      return;
    }

    let ws = serde_json::to_string_pretty(self.clone()).expect("error");
    let path = PathBuf::from(self.path.clone()).join(".uncode");
    if !path.exists() {
      let _file = File::create(&path).unwrap();
    }

    let result = fs::write(&path, ws);
    match result {
      Ok(_) => log::info!("save config: {:?}", path),
      Err(e) => log::info!("failed to write data: {}", { e }),
    }
  }
  pub fn json(&self) -> String {
    serde_json::to_string(self.clone()).expect("error")
  }
}
