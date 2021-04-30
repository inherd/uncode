import * as React from 'react';
import styled, { css } from 'styled-components/macro';
import { ReactComponent as DocumentationIcon } from './assets/documentation-icon.svg';
import { ReactComponent as DesignIcon } from './assets/design-icon.svg';
import { ReactComponent as CodingIcon } from './assets/coding-icon.svg';
import TauriBridge from '../../../tauri-bridge';
import TauriShortcuts from '../../../tauri-shortcuts';

export function Nav() {
  TauriShortcuts.init();
  const openStory = () => {
    TauriBridge.title('Story');
    TauriBridge.openDialog();
  };

  return (
    <Wrapper>
      <NavButton onClick={openStory}>
        <DocumentationIcon />
        Story
      </NavButton>
      <NavButton onClick={openStory}>
        <DesignIcon />
        Design
      </NavButton>
      <NavButton onClick={openStory}>
        <CodingIcon />
        Code
      </NavButton>
      <SimpleButton>Build</SimpleButton>
      <SimpleButton>Deploy</SimpleButton>
      <SimpleButton>Operation</SimpleButton>
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  display: flex;
  margin-right: -1rem;
`;

const DesignIconSized = () => {
  const DesignIcon = styled.div`
    width: 24px;
    height: 24px;
  `;

  return <DesignIcon></DesignIcon>;
};

const SharedButton = css`
  color: ${p => p.theme.primary};
  cursor: pointer;
  text-decoration: none;
  display: flex;
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  align-items: center;
  border: none;
  background-color: transparent;
  outline: none;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.4;
  }

  .icon {
    margin-right: 0.25rem;
  }
`;

const SimpleButton = styled.button`
  ${SharedButton}
`;

const NavButton = styled.button`
  ${SharedButton}
`;
