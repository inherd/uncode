import * as React from 'react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from '../../components/NavBar';
import { PageWrapper } from '../../components/PageWrapper';
import styled from 'styled-components/macro';
import Board, { moveCard } from '@lourenci/react-kanban';
import '@lourenci/react-kanban/dist/styles.css';
import UncodeBridge from '../../../uncode-bridge';

export interface Card {
  id: number;
  title: string;
  description: string;
}

export function StoryPage() {
  UncodeBridge.title('Uncode - Story');
  let [board, setBoard] = useState(null as any);

  window.addEventListener('set_config', _ => {
    getStories();
  });

  function getStories() {
    UncodeBridge.get_story().then(stories => {
      let column_map: any = {
        backlog: { id: 1, title: 'Backlog', cards: [] },
        doing: { id: 2, title: 'Doing', cards: [] },
        done: { id: 3, title: 'Done', cards: [] },
      };
      let other_id = 4;
      let card_map: any = {};
      for (let story of stories) {
        if (!card_map[story.status]) {
          card_map[story.status] = 1;
        } else {
          card_map[story.status]++;
        }

        if (!column_map[story.status]) {
          column_map[story.status] = {
            id: other_id + 1,
            title: story.status,
            cards: [],
          };
          other_id = other_id + 1;
        }

        column_map[story.status].cards.push({
          id: story.id,
          title: story.id + ' - ' + story.title,
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
  }

  useEffect(() => {
    getStories();
  }, []);

  function onCardNew(newCard) {
    const card = { id: '', ...newCard };
    UncodeBridge.create_story(card);
    return card;
  }

  function handleCardMove(_card, source, destination) {
    const updatedBoard = moveCard(board, source, destination);
    setBoard(updatedBoard);
  }

  return (
    <>
      <Helmet>
        <title>Uncode Story</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        {board ? (
          <Board
            allowAddCard={{ on: 'top' }}
            onNewCardConfirm={onCardNew}
            onCardNew={console.log}
            disableColumnDrag
            onCardDragEnd={handleCardMove}
          >
            {board}
          </Board>
        ) : null}
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
