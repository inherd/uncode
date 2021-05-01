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
  } as any);

  useEffect(() => {
    TauriShortcuts.getStory().then(stories => {
      let column_map: any = {};
      let card_map: any = {};
      let column_id = 1;
      for (let story of stories) {
        if (!column_map[story.status]) {
          column_map[story.status] = {
            id: column_id,
            title: story.status,
            cards: [],
          };
        }

        if (!card_map[story.status]) {
          card_map[story.status] = 1;
        } else {
          card_map[story.status]++;
        }

        column_map[story.status].cards.push({
          id: card_map[story.status],
          title: story.title,
          description: story.description,
        });
      }

      let new_board = { columns: [] };
      for (let key in column_map) {
        // @ts-ignore
        new_board.columns.push(column_map[key]);
      }

      setBoard(new_board);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Uncode Story</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Board>{board}</Board>
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
