import * as React from 'react';
import styled, { css } from 'styled-components/macro';
import { open } from 'tauri/api/dialog';
import { ReactComponent as DocumentationIcon } from './assets/documentation-icon.svg';
import { ReactComponent as GithubIcon } from './assets/github-icon.svg';

export function Nav() {
  const openStory = () => {
    open();
  };

  return (
    <Wrapper>
      <NavButton onClick={openStory}>
        <DocumentationIcon />
        Story
      </NavButton>
      <Item
        href="https://github.com/phodal/uncode"
        target="_blank"
        title="Undoe GitHub"
        rel="noopener noreferrer"
      >
        <GithubIcon />
        Github
      </Item>
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
