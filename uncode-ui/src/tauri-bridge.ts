import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';

const TauriBridge = {
  workspace: {
    path: '',
  },

  getStory(): Promise<any> {
    return invoke('get_story', { dir: this.workspace.path });
  },

  openDialog(): Promise<any> {
    return open({ directory: true }).then(result => {
      this.workspace.path = result as string;
      return invoke('open_directory', { payload: result });
    });
  },

  title(title: string) {
    return invoke('set_title', { payload: title });
  },

  log(name: string, message: string): Promise<any> {
    return invoke('log_operation', { payload: message });
  },
};

export default TauriBridge;
