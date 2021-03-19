import hotkeys from 'hotkeys-js';

const TauriShortcuts = {
  init() {
    hotkeys('f5', function (event, handler) {
      // Prevent the default refresh event under WINDOWS system
      event.preventDefault();
      alert('you pressed F5!');
    });
  },
};

export default TauriShortcuts;
