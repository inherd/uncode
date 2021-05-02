import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../../components/NavBar';
import { PageWrapper } from '../../components/PageWrapper';
import styled from 'styled-components/macro';
import Mermaid from '../../components/Memarid';
import { useState } from 'react';
import TauriBridge from '../../../tauri-bridge';

export function DesignPage() {
  // @ts-ignore
  // let [model, setModel] = useState({} as any);
  TauriBridge.title('Uncode - Design');
  TauriBridge.getDesign('modeling').then((model: string) => {
    console.log(model);
  });

  let example = `classDiagram
class GeoPointType {
 <<enumeration>>
  BROWNFIELD
  OGWELL
  CELL_TOWER
  NUCLEAR_REACTOR
  SUPERFUND
}
`;
  // @ts-ignore
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
        <Mermaid chart={example} config={{}} name={''} />
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
