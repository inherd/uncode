use std::fs::DirEntry;
use std::path::{Path, PathBuf};
use std::{fs, io};

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct FileEntry {
  pub name: String,
  pub ext: String,
  pub is_dir: bool,
  pub path: String,
  pub relative: String,
  pub children: Vec<FileEntry>,
}

impl Default for FileEntry {
  fn default() -> Self {
    FileEntry {
      name: "".to_string(),
      ext: "".to_string(),
      is_dir: false,
      path: "".to_string(),
      relative: "".to_string(),
      children: vec![],
    }
  }
}

#[allow(dead_code)]
impl FileEntry {
  pub fn new(relative: &Path ,path: &Path) -> Self {
    let mut ext = "".to_string();
    let mut is_dir = true;
    if relative.is_file() {
      is_dir = false;
      if let Some(ex) = path.extension() {
        ext = ex.to_string_lossy().to_string()
      }
    }

    let parent = relative.parent().expect("not parent");
    let short = relative.strip_prefix(parent).expect("strip parent issue");

    FileEntry {
      name: format!("{}", short.display()),
      ext,
      is_dir,
      path: format!("{}", path.display()),
      relative: format!("{}", relative.display()),
      children: vec![],
    }
  }

  /// add FileEntry to parent by keys, and return new results.
  pub fn add_child(&mut self, child_key: &str, child: &mut Vec<Self>) {
    self.children.iter_mut()
      .for_each(|entry| {
        if entry.name == child_key {
          entry.children.append(child)
        }
      });
  }

  /// add FileEntry to parent by keys, and return new results.
  pub fn build_child(&mut self, child: &str) {
    let root_dir = PathBuf::from(self.path.clone());

    self.children.iter_mut()
      .for_each(|entry| {
        if entry.name == child {
          let child_path = PathBuf::from(entry.path.clone());
          let mut src_entries = FileEntry::level_one_with_root(&child_path, &root_dir);
          entry.children.append(&mut src_entries.children);
        }
      });
  }

  // todo: a tempory ignore ways for performance simple
  pub fn is_rust_target() {}

  fn is_hidden(entry: &DirEntry) -> bool {
    if !entry.path().is_dir() {
      return entry
        .file_name()
        .to_str()
        .map(|s| s == ".DS_Store")
        .unwrap_or(false);
    }

    entry
      .file_name()
      .to_str()
      .map(|s| s.starts_with("."))
      .unwrap_or(false)
  }

  /// Returns depth 1 FileEntry with the given path.
  ///
  /// # Arguments
  ///
  /// * `title` - default path name
  /// * `path`  - code path
  ///
  pub fn level_one(path: &Path) -> FileEntry {
    let root_dir = path;
    FileEntry::level_one_with_root(path, root_dir)
  }

  fn level_one_with_root(child: &Path, root_dir: &Path) -> FileEntry {
    let mut root = FileEntry::new(child, root_dir);

    let _result = FileEntry::by_depth_one(child, &mut root, root_dir);
    root.children.sort_by_key(|a| {
      !a.is_dir
    });
    root
  }

  fn by_depth_one(
    dir: &Path,
    node: &mut FileEntry,
    base_dir: &Path,
  ) -> io::Result<()> {
    if dir.is_dir() {
      let entry_set = fs::read_dir(dir)?; // contains DirEntry
      let mut entries = entry_set
        .filter_map(|v| match v {
          Ok(dir) => {
            if FileEntry::is_hidden(&dir) {
              return None;
            }
            Some(dir)
          }
          Err(_) => None,
        })
        .collect::<Vec<_>>();

      entries.sort_by(|a, b| a.path().file_name().cmp(&b.path().file_name()));

      for (_index, entry) in entries.iter().enumerate() {
        let path = entry.path();
        let relative = path.strip_prefix(base_dir).unwrap();

        if path.is_dir() {
          let entry = &mut FileEntry::new(relative, &path);
          node.children.push(entry.to_owned());
        } else {
          let file = &mut FileEntry::new(relative, &path);
          file.is_dir = false;
          node.children.push(file.to_owned());
        }
      }
    }
    Ok(())
  }
}

#[cfg(test)]
mod tests {
  use std::path::PathBuf;
  use crate::file_entry::FileEntry;

  #[test]
  fn should_support_for_visitor_by_level() {
    let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let entry = FileEntry::level_one(&path);

    assert_eq!("src", entry.children[0].name);
    assert_eq!(0, entry.children[0].children.len());
  }

  #[test]
  fn should_support_for_add_children() {
    let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let src = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("src");

    let mut root = FileEntry::level_one(&path);
    let mut src_entries = FileEntry::level_one(&src);

    root.add_child("src", &mut src_entries.children);

    assert_eq!("src", root.children[0].name);
    assert_eq!(3, root.children[0].children.len());
    assert_eq!("domain", root.children[0].children[0].name);
  }

  #[test]
  fn should_support_for_insert_children() {
    let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let mut root = FileEntry::level_one(&path);

    root.build_child("src");

    assert_eq!("src", root.children[0].name);
    assert_eq!(3, root.children[0].children.len());
    assert_eq!("domain", root.children[0].children[0].name);
  }

  #[test]
  fn should_get_realtive_dir() {
    let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let mut root = FileEntry::level_one(&path);

    root.build_child("src");

    println!("{:?}", root);

    assert_eq!("src", root.children[0].name);
    assert_eq!(3, root.children[0].children.len());
    let relative = root.children[0].children[0].relative.clone();

    assert!(relative.contains("src"));
    assert!(relative.contains("domain"));
  }
}
