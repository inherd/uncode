import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { emit } from '@tauri-apps/api/event';

const UncodeBridge = {
  // todo: move listen to here
  listen(event_name) {},

  config: {
    uncode: {
      path: '',
      workspace_config: '',
    },
    workspace: {
      domain: '',
      story: 'design',
      design: 'story',
      code: 'uncode',
    },
  },

  getStory(): Promise<any> {
    return invoke('get_story', {
      root: this.config.uncode.path,
      story: this.config.workspace.story,
    });
  },

  getDesign(design_type: string): Promise<any> {
    return invoke('get_design', {
      root: this.config.uncode.path,
      path: this.config.workspace.design,
      designType: design_type,
    });
  },

  createStory(card): Promise<any> {
    return invoke('create_story', {
      root: this.config.uncode.path,
      story: this.config.workspace.story,
      card: card,
    });
  },

  setConfig(config: any) {
    this.config = config;
    window.dispatchEvent(new Event('set_config'));
  },

  saveConfig(config: any) {
    this.setConfig(config);
    emit('save_config', JSON.stringify(this.config));
  },

  openDialog(): Promise<any> {
    return open({ directory: true }).then(result => {
      this.config.uncode.path = result as string;
      this.setConfig(this.config);
      emit('save_config', JSON.stringify(this.config));
    });
  },

  title(title: string) {
    return invoke('set_title', { payload: title });
  },

  log(name: string, message: string): Promise<any> {
    return invoke('log_operation', { payload: message });
  },

  loadCodeTree(): Promise<any> {
    return invoke('load_code_tree', {
      root: this.config.uncode.path,
      path: this.config.workspace.code,
    });
  },
};

export default UncodeBridge;
