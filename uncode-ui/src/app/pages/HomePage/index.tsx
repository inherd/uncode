import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import { useState } from 'react';
import TauriBridge from '../../../tauri-bridge';
import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor';

export function HomePage() {
  const [config, setConfig] = useState(TauriBridge.uncode_config);
  const options = {
    language: 'json',
    theme: 'vs-dark',
  };

  window.addEventListener('set_config', _ => {
    setConfig(TauriBridge.uncode_config);
  });

  const updateConfig = (value, event) => {
    try {
      setConfig(JSON.parse(value));
    } catch (err) {}
  };

  const saveConfig = () => {
    TauriBridge.saveConfig(config);
  };

  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor,
  ) => {
    setTimeout(function () {
      editor.getAction('editor.action.formatDocument').run();
    }, 300);
  };

  return (
    <>
      <Helmet>
        <title>Uncode - 云研发 IDE</title>
        <meta name="description" content="cloud dev IDE" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <h2>Uncode config</h2>
        <button onClick={saveConfig}>Save Config</button>
        <MonacoEditor
          width="800"
          height="600"
          defaultValue={JSON.stringify(config)}
          onChange={updateConfig}
          options={options}
          editorDidMount={editorDidMount}
        />
      </PageWrapper>
    </>
  );
}
