import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';

const TauriBridge = {
  getStory(): Promise<any> {
    return invoke('get_story');
  },

  openDialog(): Promise<any> {
    return open({ directory: true }).then(result => {
      return invoke('open_directory', { payload: result });
    });
  },

  title(title: string) {},

  log(name: string, message: string): Promise<any> {
    return invoke('log_operation', { payload: message });
  },
};

export default TauriBridge;
