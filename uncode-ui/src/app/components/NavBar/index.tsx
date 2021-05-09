import * as React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { NavLink, useHistory } from 'react-router-dom';

import { ReactComponent as DocumentationIcon } from './assets/documentation-icon.svg';
import { ReactComponent as DesignIcon } from './assets/design-icon.svg';
import { ReactComponent as CodingIcon } from './assets/coding-icon.svg';
import UncodeShortcuts from '../../../uncode-shortcuts';
import styled, { css } from 'styled-components/macro';

export function NavBar() {
  let history = useHistory();
  UncodeShortcuts.bind_history(history);

  return (
    <AppBar position="static">
      <Toolbar>
        <StyleLink to="/story">
          <DocumentationIcon />
          Story
        </StyleLink>
        <StyleLink to="/design">
          <DesignIcon />
          Design
        </StyleLink>
        <StyleLink to="/code">
          <CodingIcon />
          Code
        </StyleLink>
        <StyleLink to="/build">Build</StyleLink>
        <StyleLink to="/deploy">Deploy</StyleLink>
        <StyleLink to="/operation">Operation</StyleLink>
      </Toolbar>
    </AppBar>
  );
}

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

  &.active {
    color: ${p => p.theme.background};
  }

  .icon {
    margin-right: 0.25rem;
  }
`;

const StyleLink = styled(NavLink)`
  ${SharedButton}
`;
