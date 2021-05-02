import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../../components/NavBar';
import { PageWrapper } from '../../components/PageWrapper';
import styled from 'styled-components/macro';
import Mermaid from '../../components/Memarid';
import { useState } from 'react';
import TauriBridge from '../../../tauri-bridge';
import MonacoEditor from 'react-monaco-editor';

export function DesignPage() {
  let [modeling, setModeling] = useState('');
  let [guard, setGuard] = useState('');

  TauriBridge.title('Uncode - Design');
  TauriBridge.getDesign('modeling').then((model: string) => {
    let without_puml = model.replace('@startuml', '').replace('@enduml', '');
    let mermaid_str = 'classDiagram\n' + without_puml;
    setModeling(mermaid_str);
  });

  TauriBridge.getDesign('guard').then((model: string) => {
    console.log(model);
    setGuard(model);
  });

  let guard_options = {
    language: 'java',
  };

  return (
    <>
      <Helmet>
        <title>Uncode Design</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <h2>Architecture Description</h2>
        <h2>Modeling</h2>
        <Mermaid chart={modeling} config={{}} name={''} />
        <h2>Guard Design</h2>
        <MonacoEditor
          width="800"
          height="600"
          value={guard}
          options={guard_options}
        />
      </PageWrapper>
    </>
  );
}

export const A = styled.a`
  color: ${p => p.theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    opacity: 0.8;
  }

  &:active {
    opacity: 0.4;
  }
`;
