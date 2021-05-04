import * as React from 'react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../../components/NavBar';
import { PageWrapper } from '../../components/PageWrapper';
import styled from 'styled-components/macro';
import MonacoEditor from 'react-monaco-editor';
import UncodeBridge from '../../../uncode-bridge';
import { Box, Collapse, Grid, makeStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { animated, useSpring } from 'react-spring/web.cjs';
import { Description, Folder } from '@material-ui/icons';

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

export default function RecursiveTreeView({ data, handleSelect }) {
  // eslint-disable-next-line
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);
  const [selected] = React.useState([]);

  const handleToggle = (event, nodeIds) => {
    UncodeBridge.open_dir(nodeIds).then(data => {
      console.log(data);
    });
    setExpanded(nodeIds);
  };

  const renderTree = nodes => {
    return (
      <TreeItem
        key={nodes.path}
        nodeId={nodes.path}
        label={nodes.name}
        icon={nodes.is_dir ? <Folder /> : <Description />}
        TransitionComponent={TransitionComponent}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map(node => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={[data.name]}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      selected={selected}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
    >
      {renderTree(data)}
    </TreeView>
  );
}

export function CodePage() {
  let [tree, setTree] = useState({
    path: '',
    name: '',
    is_dir: true,
    children: [],
  });
  let [content, setContent] = useState('');

  const options = {
    //renderSideBySide: false
  };

  useEffect(() => {
    UncodeBridge.open_dir().then(data => {
      setTree(data);
    });
  }, []);

  const handleSelect = (event, nodeIds) => {
    UncodeBridge.open_file(nodeIds).then(data => {
      setContent(data);
    });
  };

  return (
    <>
      <Helmet>
        <title>Uncode Code</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Box height="100%">
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <RecursiveTreeView data={tree} handleSelect={handleSelect} />
            </Grid>
            <Grid item xs={10}>
              <MonacoEditor
                height="100%"
                language="javascript"
                options={options}
                value={content}
              />
            </Grid>
          </Grid>
        </Box>
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
