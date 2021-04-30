import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import ReactMarkdown from 'react-markdown';
const gfm = require('remark-gfm');

export function HomePage() {
  const markdown = `
 1. use \`Ctrl\` + \`O\` / \`Cmd\` + \`O\` to open project.
 2. choice Story in lifecycle.
`;

  return (
    <>
      <Helmet>
        <title>Uncode - 云研发 IDE</title>
        <meta name="description" content="cloud dev IDE" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <ReactMarkdown remarkPlugins={[gfm]} children={markdown} />
      </PageWrapper>
    </>
  );
}
