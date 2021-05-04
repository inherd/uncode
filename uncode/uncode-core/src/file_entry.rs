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
  pub children: Vec<FileEntry>,
}

impl Default for FileEntry {
  fn default() -> Self {
    FileEntry {
      name: "".to_string(),
      ext: "".to_string(),
      is_dir: false,
      path: "".to_string(),
      children: vec![],
    }
  }
}

#[allow(dead_code)]
impl FileEntry {
  /// create a simple FileEntry
  fn from_path(path: PathBuf) -> Self {
    let file_name = path.file_name().unwrap();
    let name = match file_name.to_str() {
      None => "".to_string(),
      Some(na) => na.to_string(),
    };
    let ext = match path.extension() {
      None => "".to_string(),
      Some(ext) => ext.to_str().unwrap().to_string(),
    };

    let path = format!("{}", path.display());

    FileEntry {
      name,
      ext,
      is_dir: false,
      path,
      children: vec![],
    }
  }

  pub fn new(name: String, path: PathBuf) -> Self {
    let mut ext = "".to_string();
    if path.is_file() {
      match path.extension() {
        None => {}
        Some(ex) => {
          ext = ex.to_string_lossy().to_string()
        }
      }
    }
    FileEntry {
      name,
      ext,
      is_dir: false,
      path: format!("{}", path.display()),
      children: vec![],
    }
  }

  fn add_child(mut self, child: Self) -> Self {
    self.children.push(child);
    self
  }

  // todo: a tempory ignore ways for performance simple
  pub fn is_rust_target() {

  }

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

  /// Returns FileEntry with the given path.
  ///
  /// # Arguments
  ///
  /// * `title` - default path name
  /// * `path`  - code path
  ///
  pub fn all(title: String, path: &Path) -> FileEntry {
    let mut root = FileEntry::new(title, path.to_path_buf());
    let _result = FileEntry::visit_dirs(path, 0, &mut root, path);
    root
  }

  fn visit_dirs(
    dir: &Path,
    depth: usize,
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

        if path.is_dir() {
          let depth = depth + 1;
          let relative_path = path.strip_prefix(base_dir).unwrap();
          let entry = &mut FileEntry::new(format!("{}", relative_path.display()), path.to_path_buf());
          entry.is_dir = true;
          FileEntry::visit_dirs(&path, depth, entry, base_dir)?;
          node.children.push(entry.to_owned());
        } else {
          let entry1 = FileEntry::from_path(path);
          node.children.push(entry1);
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
  fn should_get_file_ext() {
    let path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("Cargo.toml");
    let entry = FileEntry::all("root".to_string(), &path);
    assert_eq!("toml", entry.ext);
  }

  #[test]
  fn should_support_for_visitor_by_level() {
    let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let entry = FileEntry::all("root".to_string(), &path);
  }
}
