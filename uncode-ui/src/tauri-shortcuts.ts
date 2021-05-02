import hotkeys from 'hotkeys-js';
import UncodeBridge from './uncode-bridge';

const TauriShortcuts = {
  init() {
    hotkeys.unbind('f5');
    hotkeys.unbind('ctrl+o, command+o');

    hotkeys('f5', function (event, handler) {
      event.preventDefault();
      return false;
    });

    hotkeys('ctrl+o, command+o', function () {
      UncodeBridge.openDialog();
      return false;
    });
  },
};

export default TauriShortcuts;
