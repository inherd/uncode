#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod cmd;

use serde::Serialize;

#[derive(Serialize)]
struct Reply {
  data: String,
}

fn main() {
  tauri::AppBuilder::new()
    .setup(|webview, _source| {
      let mut webview = webview.as_mut();
      let mut webview_clone = webview.clone();
      tauri::event::listen(String::from("js-event"), move |msg| {
        println!("got js-event with message '{:?}'", msg);
        let reply = Reply {
          data: "something else".to_string(),
        };

        tauri::event::emit(
          &mut webview,
          String::from("rust-event"),
          Some(serde_json::to_string(&reply).unwrap()),
        )
          .expect("failed to emit");
      });

      webview_clone
        .dispatch(move |w| {
          w.eval("window.onTauriInit()");
        })
        .expect("failed to dispatch");
    })
    .invoke_handler(|_webview, arg| {
      use cmd::Cmd::*;
      match serde_json::from_str(arg) {
        Err(e) => {
          Err(e.to_string())
        }
        Ok(command) => {
          match command {
            LogOperation { event, payload } => {
              println!("{} {:?}", event, payload);
            }
          }
          Ok(())
        }
      }
    })
    .build()
    .run();
}
