import * as React from 'react';
import { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components/macro';
import * as monacoEditor from 'monaco-editor';
import Editor from '@monaco-editor/react';
// import * as MonacoMarkdown from 'monaco-markdown';

import { animated, useSpring } from 'react-spring/web.cjs';
import { Description, Folder } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { Box, Collapse, Grid, makeStyles } from '@material-ui/core';

import UncodeBridge from '../../../uncode-bridge';
import { NavBar } from '../../components/NavBar';
import { PageWrapper } from '../../components/PageWrapper';
import { getClientReady } from './client';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 800,
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
    if (node && node.children && node.children.length === 0) {
      UncodeBridge.open_dir(node.path).then(data => {
        node.children = data.children;
        setNode(node);

        props.click(node.path + suffix);
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
  const [expanded, setExpanded] = React.useState([data.name] as any);

  const handleToggle = useCallback(
    (event, nodeIds) => {
      setExpanded(nodeIds);
    },
    [setExpanded],
  );

  const handleClick = (nodeIds: any) => {
    handleSelect(nodeIds);
    setExpanded([...expanded, nodeIds]);
  };

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={[data.name]}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeToggle={handleToggle}
    >
      <FileTreeItem entry={data} click={handleClick} />
    </TreeView>
  );
}

export const CodePage: React.FC = () => {
  const [tree, setTree] = useState(null);
  const [content, setContent] = useState('');
  const [filePath, setFilePath] = useState('');

  React.useEffect(() => {
    UncodeBridge.open_dir().then(data => setTree(data));
  }, []);

  const openFile = (nodeIds: string) => {
    if (nodeIds.endsWith('?is_dir=true')) {
      return;
    }

    UncodeBridge.views.currentFile = nodeIds;
    UncodeBridge.open_file(nodeIds).then(data => {
      setFilePath(nodeIds);
      setContent(data);
    });
    console.log(UncodeBridge);
  };

  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor,
  ) => {
    setTimeout(() => {
      // let extension = new MonacoMarkdown.MonacoMarkdownExtension();
      // extension.activate(editor);

      editor.addAction({
        id: 'save-file',
        label: 'Save File',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        run: function (ed, any) {
          UncodeBridge.save_file(ed.getValue()).then(() => {});
        },
      });
    }, 300);
    getClientReady(editor, UncodeBridge.config.uncode.path);
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
              <Editor
                height="100%"
                path={filePath}
                value={content}
                onMount={editorDidMount}
              />
            </Grid>
          </Grid>
        </Box>
      </PageWrapper>
    </>
  );
};

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
