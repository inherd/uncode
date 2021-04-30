import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';

const TauriBridge = {
  getStory(): Promise<any> {
    return invoke('getSotry');
  },

  openDialog(): Promise<any> {
    return open({ directory: true }).then(result => {
      return invoke('openDirectory', { payload: result });
    });
  },

  title(title: string) {},
  log(name: string, message: string): Promise<any> {
    return invoke('logOperation', { payload: message });
  },
};

export default TauriBridge;
