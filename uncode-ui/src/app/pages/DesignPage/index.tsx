import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../../components/NavBar';
import { PageWrapper } from '../../components/PageWrapper';
import styled from 'styled-components/macro';
import Mermaid from '../../components/Memarid';
import { useState } from 'react';
import TauriBridge from '../../../tauri-bridge';

export function DesignPage() {
  let [modeling, setModeling] = useState('');

  TauriBridge.title('Uncode - Design');
  TauriBridge.getDesign('modeling').then((model: string) => {
    let without_puml = model.replace('@startuml', '').replace('@enduml', '');
    let mermaid_str = 'classDiagram\n' + without_puml;
    setModeling(mermaid_str);
  });

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
