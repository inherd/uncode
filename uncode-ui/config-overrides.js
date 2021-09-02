const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config, env) {
  config.plugins.push(
    new MonacoWebpackPlugin({
      languages: ['json', 'java', 'javascript', 'rust', 'go', 'markdown'],
    }),
  );
  config.resolve.alias['vscode'] = require.resolve('monaco-languageclient/lib/vscode-compatibility');
  return config;
};
