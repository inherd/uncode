use gherkin_rust::{Feature};

fn parse() {
  let result = Feature::parse("
Feature: Title
  Description

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
