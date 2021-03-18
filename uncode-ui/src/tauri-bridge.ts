import * as dialog from 'tauri/api/dialog';
import { setTitle } from 'tauri/api/window';
import { invoke } from 'tauri/api/tauri';

const TauriBridge = {
  openDialog() {
    dialog.open();
  },
  title(title: string) {
    setTitle(title);
    this.log('title', title);
  },
  log(name: string, message: string) {
    invoke({
      cmd: 'logOperation',
      event: name,
      payload: message,
    });
  },
};

export default TauriBridge;
