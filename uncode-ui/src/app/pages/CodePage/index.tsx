import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
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
import { set } from 'shelljs';

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

function FileTreeItem(props) {
  const [node, setNode] = useState(props.entry);

  let suffix = '';
  if (node.is_dir) {
    suffix = '?is_dir=true';
  }

  const labelClick = useCallback(() => {
    console.log('useCallback');
    props.click(node.path + suffix);
    if (node && node.children && node.children.length === 0) {
      UncodeBridge.open_dir(node.path).then(data => {
        node.children = data.children;
        setNode(node);
      });

      setNode(props.entry);
    }
  }, [props, node, suffix]);

  return (
    <TreeItem
      key={node.path}
      nodeId={node.path + suffix}
      label={node.name}
      onLabelClick={labelClick}
      icon={node.is_dir ? <Folder /> : <Description />}
      TransitionComponent={TransitionComponent}
    >
      {Array.isArray(node.children)
        ? node.children.map(node => {
            return <FileTreeItem entry={node} click={props.click} />;
          })
        : null}
    </TreeItem>
  );
}

export default function RecursiveTreeView({ data, handleSelect }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([] as any);
  const [selected, setSelected] = React.useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleClick = (nodeIds: any) => {
    setExpanded([...expanded, nodeIds]);
  };

  const nodeSelect = (event, nodeIds) => {
    setSelected(nodeIds);
    handleSelect(nodeIds);
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
      onNodeSelect={nodeSelect}
    >
      <FileTreeItem entry={data} click={handleClick} />
    </TreeView>
  );
}

export function CodePage() {
  let [tree, setTree] = useState();
  let [content, setContent] = useState('');

  const options = {
    //renderSideBySide: false
  };

  useEffect(() => {
    UncodeBridge.open_dir().then(data => {
      setTree(data);
    });
  }, []);

  const openFile = (nodeIds: string) => {
    if (nodeIds.endsWith('?is_dir=true')) {
      return;
    }
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
              {tree ? (
                <RecursiveTreeView data={tree} handleSelect={openFile} />
              ) : (
                <PlaceHolder />
              )}
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

export const PlaceHolder = styled.p`
  height: 100%;
  min-height: 600px;
`;

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
