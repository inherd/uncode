import * as React from 'react';
import styled, { css } from 'styled-components/macro';
import { ReactComponent as DocumentationIcon } from './assets/documentation-icon.svg';
import TauriBridge from '../../../tauri-bridge';

export function Nav() {
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
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  display: flex;
  margin-right: -1rem;
`;

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

const Item = styled.a`
  ${SharedButton}
`;
const NavButton = styled.button`
  ${SharedButton}
`;
