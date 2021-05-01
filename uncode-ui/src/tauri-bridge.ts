import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { emit } from '@tauri-apps/api/event';

const TauriBridge = {
  // todo: move listen to here
  listen(event_name) {},

  uncode_config: {
    path: '',
  },

  getStory(): Promise<any> {
    return invoke('get_story', {
      root: this.uncode_config.path,
      story: 'story',
    });
  },

  setConfig(config: any) {
    this.uncode_config = config;
    window.dispatchEvent(new Event('set_config'));
  },

  saveConfig(config: any) {
    this.setConfig(config);
    emit('save_config', JSON.stringify(this.uncode_config));
  },

  openDialog(): Promise<any> {
    return open({ directory: true }).then(result => {
      this.uncode_config.path = result as string;
      this.setConfig(this.uncode_config);
      emit('save_config', JSON.stringify(this.uncode_config));
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
