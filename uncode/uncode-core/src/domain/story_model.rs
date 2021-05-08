use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct  StoryModel {
  pub title: String,
  pub status: String,
  pub description: String,
  pub created: u64,
  pub modified: u64
}

impl Default for StoryModel {
  fn default() -> Self {
    StoryModel {
      title: "".to_string(),
      status: "".to_string(),
      description: "".to_string(),
      created: 0,
      modified: 0
    }
  }
}
