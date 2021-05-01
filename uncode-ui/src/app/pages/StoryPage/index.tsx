import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../../components/NavBar';
import { PageWrapper } from '../../components/PageWrapper';
import styled from 'styled-components/macro';
import Board from '@lourenci/react-kanban';
import '@lourenci/react-kanban/dist/styles.css';
import TauriShortcuts from '../../../tauri-shortcuts';
import { useEffect, useState } from 'react';

export interface Card {
  id: number;
  title: string;
  description: string;
}

export function StoryPage() {
  let [board, setBoard] = useState({
    columns: [],
  });

  TauriShortcuts.getStory().then(stories => {
    let id = 1;
    let cards: Card[] = [];
    for (let story of stories) {
      cards.push({
        id: id,
        title: story.title,
        description: story.description,
      });
      id = id + 1;
    }
    board = {
      columns: [
        {
          id: 1,
          title: 'Backlog',
          cards: cards,
        },
        {
          id: 2,
          title: 'Doing',
          cards: [],
        },
        {
          id: 3,
          title: 'Done',
          cards: [],
        },
      ],
    } as any;
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
