import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { emit, listen } from '@tauri-apps/api/event';

const UncodeBridge = {
  // todo: move listen to here
  listen(event_name, handler) {
    return listen<string>(event_name, data => {
      return handler(JSON.parse(data.payload));
    });
  },

  config: {
    uncode: {
      path: '',
      workspace_config: '',
    },
    workspace: {
      domain: '',
      story: 'design',
      design: 'story',
      code: '',
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
    this.emit_event('save_config', this.config);
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

  emit_event: function (event_type: string, payload: object) {
    emit(
      'js_event',
      JSON.stringify({
        event_type: event_type,
        data: JSON.stringify(payload),
      }),
    );
  },

  loadCodeTree() {
    let payload = {
      root: this.config.uncode.path,
    };

    this.emit_event('load_code_tree', payload);
  },
};

export default UncodeBridge;
