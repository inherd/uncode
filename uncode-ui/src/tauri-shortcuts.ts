import hotkeys from 'hotkeys-js';
import TauriBridge from './tauri-bridge';

const TauriShortcuts = {
  init() {
    hotkeys('f5', function (event, handler) {
      event.preventDefault();
    });

    hotkeys('ctrl+o, command+o', function () {
      TauriBridge.openDialog();
    });
  },
};

export default TauriShortcuts;
