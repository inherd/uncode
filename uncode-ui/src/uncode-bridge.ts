import { open } from '@tauri-apps/api/dialog';
import { emit, listen } from '@tauri-apps/api/event';
import { exit as tauri_exit } from '@tauri-apps/api/process';
import { invoke, InvokeArgs } from '@tauri-apps/api/tauri';

function invoke_wrapper<T>(cmd: string, args: InvokeArgs = {}): Promise<T> {
  if (!window.rpc) {
    return new Promise((resolve, reject) => {});
  }
  if (!window.rpc.notify) {
    return new Promise((resolve, reject) => {});
  }

  return invoke<T>(cmd, args);
}

const UncodeBridge = {
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
      frameworks: [],
      facets: [],
    },
  },

  views: {
    currentFile: '',
  },

  listen(event_name, handler) {
    return UncodeBridge.listen_text(event_name, data => {
      return handler(JSON.parse(data));
    });
  },

  listen_text(event_name, handler) {
    if (!window.rpc) {
      return;
    }
    if (!window.rpc.notify) {
      return;
    }

    return listen<string>(event_name, data => {
      return handler(data.payload);
    });
  },

  exit() {
    tauri_exit().then(r => {});
  },

  get_story(): Promise<any> {
    return invoke_wrapper('get_story', {
      root: this.config.uncode.path,
      story: this.config.workspace.story,
    });
  },

  get_design(design_type: string): Promise<any> {
    return invoke_wrapper('get_design', {
      root: this.config.uncode.path,
      path: this.config.workspace.design,
      designType: design_type,
    });
  },

  create_story(card): Promise<any> {
    return invoke_wrapper('create_story', {
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
    return invoke_wrapper('set_title', { payload: title });
  },

  log(name: string, message: string): Promise<any> {
    return invoke_wrapper('log_operation', { payload: message });
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
    return invoke_wrapper('open_file', { path });
  },

  save_file(value: string): Promise<string> {
    return invoke_wrapper('save_file', {
      path: UncodeBridge.views.currentFile,
      value,
    });
  },

  build_modeling() {
    this.emit_event('build_modeling', {
      root: this.config.uncode.path,
      code: this.config.workspace.code,
      design: this.config.workspace.design,
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

    return invoke_wrapper('open_dir', { root, codePath });
  },
};

export default UncodeBridge;
