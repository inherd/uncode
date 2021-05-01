import * as React from 'react';
import styled, { css } from 'styled-components/macro';
import { ReactComponent as DocumentationIcon } from './assets/documentation-icon.svg';
import { ReactComponent as DesignIcon } from './assets/design-icon.svg';
import { ReactComponent as CodingIcon } from './assets/coding-icon.svg';
import { NavLink } from 'react-router-dom';

export function Nav() {
  return (
    <Wrapper>
      <StyledLink to="/story">
        <DocumentationIcon />
        Story
      </StyledLink>
      <StyledLink to="/design">
        <DesignIcon />
        Design
      </StyledLink>
      <StyledLink to="/code">
        <CodingIcon />
        Code
      </StyledLink>
      <StyledLink to="/build">Build</StyledLink>
      <StyledLink to="/deploy">Deploy</StyledLink>
      <StyledLink to="/operation">Operation</StyledLink>
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

  &.active {
    font-weight: bold;
    color: #000;
    background-color: #fff;

    border-bottom: 2px solid #fff;
  }

  .icon {
    margin-right: 0.25rem;
  }
`;

const StyledLink = styled(NavLink)`
  ${SharedButton}
`;
