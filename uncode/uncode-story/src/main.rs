use gherkin_rust::{Feature};

fn main() {
  let result = Feature::parse("
Feature: Everything

Scenario: Nothing
  Given I just started
", Default::default());
  match result {
    Ok(feature) => {
      println!("{:?}", feature);
    }
    Err(err) => {
      println!("{:?}", err);
    }
  }
}
