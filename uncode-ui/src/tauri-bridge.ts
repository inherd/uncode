import * as dialog from 'tauri/api/dialog';
import { setTitle } from 'tauri/api/window';

const TauriBridge = {
  openDialog() {
    dialog.open();
  },
  title(title: string) {
    setTitle(title);
  },
};

export default TauriBridge;
