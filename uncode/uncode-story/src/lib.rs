#[macro_use]
extern crate lazy_static;
extern crate serde_json;

use gherkin_rust::{Feature};
use uncode_core::StoryModel;
use walkdir::{WalkDir, DirEntry};
use std::fs;
use std::path::Path;
use regex::{Regex};
use std::time::{SystemTime};

lazy_static! {
  static ref STATUS_REGEX: Regex = Regex::new(r"#\sstatus:\s(?P<status>.*)").unwrap();
}

pub fn parse(content: &str) -> StoryModel {
  let mut story = StoryModel::default();
  let mut status = "".to_string();
  for line in content.lines().into_iter() {
    if let Some(caps) = STATUS_REGEX.captures(line) {
      status = caps["status"].to_string();
    }
  }
  let result = Feature::parse(content, Default::default());
  match result {
    Ok(feature) => {
      story.title = feature.name;
      story.status = status;
      story.description = feature.description.unwrap_or("".to_string());
    }
    Err(err) => {
      println!("error: {:?}", err);
    }
  }

  story
}

pub fn parse_dir<P: AsRef<Path>>(path: P) -> Vec<StoryModel> {
  fn is_story(entry: &DirEntry) -> bool {
    if entry.file_type().is_dir() {
      return true;
    }

    entry.file_name()
      .to_str()
      .map(|s| s.ends_with(".feature"))
      .unwrap_or(false)
  }

  let walker = WalkDir::new(path).into_iter();
  let mut stories = vec![];
  for entry in walker.filter_entry(|e| is_story(e)) {
    if let Ok(dir) = entry {
      if dir.file_type().is_file() {
        let model = build_story(dir);

        stories.push(model);
      }
    }
  };

  stories
}

fn build_story(file_entry: DirEntry) -> StoryModel {
  let metadata = file_entry.metadata().expect("fail to get file metadata");
  let content = fs::read_to_string(file_entry.path()).expect("error to load file");
  let mut model = parse(&*content);

  if let Ok(time) = metadata.created() {
    if let Ok(unix) = time.duration_since(SystemTime::UNIX_EPOCH) {
      model.created = unix.as_secs();
    }
  }
  if let Ok(time) = metadata.modified() {
    if let Ok(unix) = time.duration_since(SystemTime::UNIX_EPOCH) {
      model.modified = unix.as_secs();
    }
  }
  model
}

#[cfg(test)]
mod tests {
  use std::path::PathBuf;
  use crate::parse_dir;

  #[test]
  fn should_parse_demo_project_story() {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let path = format!("{}", d.join("story").display());
    let stories = parse_dir(path);

    assert_eq!(1, stories.len());
    assert_eq!("第一个用户故事", stories[0].title);
  }

  #[test]
  fn should_parse_status() {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let path = format!("{}", d.join("story").display());
    let stories = parse_dir(path);

    assert_eq!(1619788569, stories[0].created);
    assert_eq!("done", stories[0].status);
  }
}
