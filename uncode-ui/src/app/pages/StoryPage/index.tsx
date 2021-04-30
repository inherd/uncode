import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../../components/NavBar';
import { PageWrapper } from '../../components/PageWrapper';
import styled from 'styled-components/macro';
import Board from '@lourenci/react-kanban';
import '@lourenci/react-kanban/dist/styles.css';
import TauriShortcuts from '../../../tauri-shortcuts';

export function StoryPage() {
  let board = {
    columns: [
      {
        id: 1,
        title: 'Backlog',
        cards: [],
      },
      {
        id: 2,
        title: 'Doing',
        cards: [],
      },
      {
        id: 3,
        title: 'Doing',
        cards: [],
      },
      {
        id: 4,
        title: 'Done',
        cards: [],
      },
    ],
  };

  TauriShortcuts.getStory().then(stories => {
    let id = 1;
    for (let story of stories) {
      (board.columns[0].cards as any).push({
        id: id,
        title: story.title,
        description: story.description,
      });
      id = id + 1;
    }
  });

  return (
    <>
      <Helmet>
        <title>Uncode Story</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Board initialBoard={board} />
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
