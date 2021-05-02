use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ArchitectureModel {
  pub collaboration: String,
  pub patterns: Vec<String>,
  pub modeling: Vec<String>,
  pub physical: PhysicalDesign
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PhysicalDesign {
  pub layer: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Requirements {

}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum NonFunctional {
  QPS(f64)
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Fitness {
  pub code_coverage: Vec<Coverage>,
  pub line_count: Vec<LineCount>
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Coverage {
  pub id: String,
  pub project: String,
  pub branch: f64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LineCount {
  pub id: String,
  pub project: String,
  pub total: i32,
  pub functions: i32,
  pub classes: i32,
}
