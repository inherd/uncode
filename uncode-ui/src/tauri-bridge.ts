import { open } from 'tauri/api/dialog';

const TauriBridge = {
  openDialog() {
    open();
  },
};

export default TauriBridge;
