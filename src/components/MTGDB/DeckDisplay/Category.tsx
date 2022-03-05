import { Typography } from '@mui/material';
import { ReactFragment, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { changeCategory, getDeckCards } from '..';
import { CardsTableType, DecksTableType } from '../../../database';
import { State } from '../../../state/reducers';
import DeckListItem from './DeckListItem';

type CategoryPropsType = {
  title: string;
  deckName: string;
  deleteFromDeckList: (c: CardsTableType) => void;
  refreshParent: () => void;
};

export const Category = ({
  title,
  deckName,
  deleteFromDeckList,
  refreshParent,
}: CategoryPropsType) => {
  const db = useSelector((state: State) => state.database);
  const [deckIdToCard, setDeckIdToCard] = useState<{ [key: string]: CardsTableType }>({});

  useEffect(() => {
    async function init() {
      let _cards = await getDeckCards(db, deckName, title);
      let _deckIdToCard: { [key: string]: CardsTableType } = {};
      // get the deck id
      for (let i = 0; i < _cards.length; i++) {
        let _c = _cards[i];
        if (_c.id) {
          let _deckRow = await db.decks.where({ card_id: _c.id }).first();
          if (_deckRow && _deckRow.id) {
            _deckIdToCard[_deckRow.id] = _c;
          }
        }
      }
      setDeckIdToCard(_deckIdToCard);
    }
    init();
  }, []);

  async function updateCategory(card: CardsTableType) {
    let deckRow = await db.decks.where({ name: deckName, card_id: card.id }).first();
    if (!deckRow && card.id) {
      deckRow = {
        card_id: card.id,
        name: deckName,
        format: 'commander',
        is_commander: false,
        category: 'default',
      };
    }
    await changeCategory(db, deckRow, title);

    refreshParent();
  }

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'deckListItem',
    drop: (item: CardsTableType) => updateCategory(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div ref={drop} style={{ border: isOver && canDrop ? '5px solid green' : '' }}>
      <Typography variant="h5">{title}</Typography>
      {Object.keys(deckIdToCard).map((c: string, i: number) => (
        <DeckListItem
          data={deckIdToCard[c]}
          deckId={c}
          key={i}
          deleteFromDeckList={(c) => deleteFromDeckList(c)}
          refreshParent={() => refreshParent()}
        />
      ))}
    </div>
  );
};
export default Category;
