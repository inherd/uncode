import * as monaco from 'monaco-editor';
import { listen } from 'vscode-ws-jsonrpc';
import {
  MonacoLanguageClient,
  CloseAction,
  ErrorAction,
  MonacoServices,
  createConnection,
} from 'monaco-languageclient';

const ReconnectingWebSocket = require('reconnecting-websocket').default;

export function getClientReady(editor, rootUri: string, language?: monaco.languages.ILanguageExtensionPoint) {
  if (language) {
    monaco.languages.register(language);
  }
  MonacoServices.install(editor, { rootUri });
  // 建立连接 创建LSP client
  const webSocket = createWebSocket(getUrlFromLanguageID());
  listen({
    webSocket,
    onConnection: connection => {
      // create and start the language client
      const languageClient = createLanguageClient(connection);
      const disposable = languageClient.start();
      connection.onClose(() => disposable.dispose());
    },
  });
}

function createWebSocket(url) {
  const socketOptions = {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 10000,
    maxRetries: Infinity,
    debug: false,
  };
  return new ReconnectingWebSocket(url, [], socketOptions);
}

function getUrlFromLanguageID() {
    // TODO: 根据环境获取真实URL
    return `ws://127.0.0.1:9999`
}

function createLanguageClient(connection) {
  return new MonacoLanguageClient({
    name: 'Sample Language Client',
    clientOptions: {
      // use a language id as a document selector
      documentSelector: ['python'],
      // disable the default error handler
      errorHandler: {
        error: () => ErrorAction.Continue,
        closed: () => CloseAction.DoNotRestart,
      },
    },
    // create a language client connection from the JSON RPC connection on demand
    connectionProvider: {
      get: (errorHandler, closeHandler) => {
        return Promise.resolve(
          createConnection(connection, errorHandler, closeHandler),
        );
      },
    },
  });
}
