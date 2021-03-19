import hotkeys from 'hotkeys-js';
import TauriBridge from './tauri-bridge';

const TauriShortcuts = {
  init() {
    hotkeys('f5', function (event, handler) {
      // Prevent the default refresh event under WINDOWS system
      event.preventDefault();
      alert('you pressed F5!');
    });
    hotkeys('ctrl+o, command+o', function () {
      TauriBridge.openDialog();
    });
  },
};

export default TauriShortcuts;
