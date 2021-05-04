import hotkeys from 'hotkeys-js';
import UncodeBridge from './uncode-bridge';

const UncodeShortcuts = {
  init() {
    hotkeys.unbind('f5');
    hotkeys.unbind('ctrl+o, command+o');

    hotkeys('f5', function (event, handler) {
      event.preventDefault();
      return false;
    });

    hotkeys('ctrl+o, command+o', function () {
      UncodeBridge.open_dialog();
      return false;
    });
  },
  bind_history(history: any) {
    let histories = [
      '/',
      'story',
      'design',
      'code',
      'build',
      'deploy',
      'operation',
    ];

    for (let i = 0; i < histories.length; i++) {
      hotkeys(`ctrl+${i}, command+${i}`, function () {
        history.push(histories[i]);
        return false;
      });
    }
  },
};

export default UncodeShortcuts;
