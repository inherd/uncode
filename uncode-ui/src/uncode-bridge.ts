import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { emit, listen } from '@tauri-apps/api/event';
import { exit } from '@tauri-apps/api/app';

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
      code: 'uncode',
    },
  },

  exit() {
    exit();
  },

  get_story(): Promise<any> {
    return invoke('get_story', {
      root: this.config.uncode.path,
      story: this.config.workspace.story,
    });
  },

  get_design(design_type: string): Promise<any> {
    return invoke('get_design', {
      root: this.config.uncode.path,
      path: this.config.workspace.design,
      designType: design_type,
    });
  },

  create_story(card): Promise<any> {
    return invoke('create_story', {
      root: this.config.uncode.path,
      story: this.config.workspace.story,
      card: card,
    });
  },

  set_config(config: any) {
    this.config = config;
    window.dispatchEvent(new Event('set_config'));
  },

  save_config(config: any) {
    this.set_config(config);
    this.emit_event('save_config', this.config);
  },

  open_dialog(): Promise<any> {
    return open({ directory: true }).then(result => {
      this.config.uncode.path = result as string;
      this.set_config(this.config);
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

  open_file(path: string): Promise<string> {
    return invoke('open_file', { path });
  },

  build_modeling(): Promise<string> {
    return invoke('build_modeling', {
      root: this.config.uncode.path,
      designPath: this.config.workspace.design,
    });
  },

  open_dir(path?: string): Promise<any> {
    let root = this.config.uncode.path;

    let codePath;
    if (!!path) {
      codePath = path;
    } else {
      codePath = this.config.workspace.code;
    }

    return invoke('open_dir', { root, codePath });
  },
};

export default UncodeBridge;
