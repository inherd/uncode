import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import { useState } from 'react';
import TauriBridge from '../../../tauri-bridge';
import MonacoEditor from 'react-monaco-editor';

export function HomePage() {
  // const [config] = useState(TauriBridge.uncode_config);
  const options = {
    language: 'json',
  };

  const updateConfig = (value, event) => {
    console.log(value, event);
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
        <MonacoEditor
          width="800"
          height="600"
          // defaultValue={JSON.stringify(config)}
          onChange={updateConfig}
          options={options}
        />
      </PageWrapper>
    </>
  );
}
