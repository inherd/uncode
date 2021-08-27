import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import UncodeBridge from '../../../uncode-bridge';
import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor';
import { Button } from '@material-ui/core';

export function HomePage() {
  const [config, setConfig] = useState(
    JSON.stringify(UncodeBridge.config, null, '\t'),
  );
  const options = {
    language: 'json',
    theme: 'vs-dark',
  };

  function useEventListener(eventName, handler, element = window) {
    const savedHandler = useRef();
    useEffect(() => {
      savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;
      // @ts-ignore
      const eventListener = event => savedHandler.current(event);
      element.addEventListener(eventName, eventListener);
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    }, [eventName, element]);
  }

  const handler = useCallback(
    _ => {
      console.log('Homepage load config: ', UncodeBridge.config);
      setConfig(JSON.stringify(UncodeBridge.config, null, '\t'));
    },
    [setConfig],
  );

  // Add event listener using our hook
  useEventListener('set_config', handler);

  const updateConfig = (value, event) => {
    try {
      setConfig(value);
    } catch (err) {}
  };

  const saveConfig = () => {
    UncodeBridge.save_config(JSON.parse(config));
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
          value={config}
          onChange={updateConfig}
          options={options}
          editorDidMount={editorDidMount}
        />
      </PageWrapper>
    </>
  );
}
