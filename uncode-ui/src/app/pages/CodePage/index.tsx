import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../../components/NavBar';
import { PageWrapper } from '../../components/PageWrapper';
import styled from 'styled-components/macro';
import MonacoEditor from 'react-monaco-editor';
import UncodeBridge from '../../../uncode-bridge';
import { makeStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { useState } from 'react';

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export default function RecursiveTreeView({ data: data }) {
  const classes = useStyles();

  const renderTree = nodes => (
    <TreeItem key={nodes.path} nodeId={nodes.path} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map(node => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(data)}
    </TreeView>
  );
}

export function CodePage() {
  let [tree, setTree] = useState({});
  UncodeBridge.loadCodeTree();

  UncodeBridge.listen('code_tree', data => {
    setTree(data);
  });

  const classes = useStyles();

  const options = {
    //renderSideBySide: false
  };

  return (
    <>
      <Helmet>
        <title>Uncode Code</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <RecursiveTreeView data={tree} />
        <MonacoEditor
          width="800"
          height="600"
          language="javascript"
          options={options}
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
