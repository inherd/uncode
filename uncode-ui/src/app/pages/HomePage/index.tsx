import * as React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import UncodeBridge from '../../../uncode-bridge';
import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor';
import { Button } from '@material-ui/core';

export function HomePage() {
  const [config, setConfig] = useState(UncodeBridge.config);
  const options = {
    language: 'json',
    theme: 'vs-dark',
  };

  window.addEventListener('set_config', _ => {
    setConfig(UncodeBridge.config);
  });

  const updateConfig = (value, event) => {
    try {
      setConfig(JSON.parse(value));
    } catch (err) {}
  };

  const saveConfig = () => {
    UncodeBridge.save_config(config);
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
        <h2>Uncode config (for Debug)</h2>
        <Button variant="contained" color="primary" onClick={saveConfig}>
          Save Config
        </Button>
        <MonacoEditor
          width="800"
          height="600"
          defaultValue={JSON.stringify(config, null, '\t')}
          onChange={updateConfig}
          options={options}
          editorDidMount={editorDidMount}
        />
      </PageWrapper>
    </>
  );
}
