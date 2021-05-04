import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../../components/NavBar';
import { PageWrapper } from '../../components/PageWrapper';
import styled from 'styled-components/macro';
import MonacoEditor from 'react-monaco-editor';
import UncodeBridge from '../../../uncode-bridge';
import { Collapse, makeStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring/web.cjs';

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

export default function RecursiveTreeView({ data }) {
  // eslint-disable-next-line
  const classes = useStyles();

  const renderTree = nodes => (
    <TreeItem
      key={nodes.path}
      nodeId={nodes.path}
      label={nodes.name}
      TransitionComponent={TransitionComponent}
    >
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
  let [tree, setTree] = useState({
    path: 'root',
    name: '',
    children: [],
  });

  const options = {
    //renderSideBySide: false
  };

  useEffect(() => {
    console.log('use-effect');
    UncodeBridge.loadCodeTree();

    UncodeBridge.listen('code_tree', data => {
      setTree(data);
    });
  }, []);

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
