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
  refreshParent: () => void;
};

export const Category = ({ title, deckName, refreshParent }: CategoryPropsType) => {
  const db = useSelector((state: State) => state.database);
  const [cardIdToDeckId, setCardIdToDeckId] = useState<any>({});
  const [cards, setCards] = useState<CardsTableType[]>([]);

  useEffect(() => {
    async function init() {
      let _cards = await getDeckCards(db, deckName, title);
      let _cardIdToDeckId: any = {};
      _cards.sort((a, b) => {
        if (a.cmc > b.cmc) return 1;
        if (a.cmc < b.cmc) return -1;
        return 0;
      });
      // get the deck id
      for (let i = 0; i < _cards.length; i++) {
        let _c = _cards[i];
        if (_c.id) {
          let _deckRow = await db.decks.where({ card_id: _c.id }).first();
          if (_deckRow && _deckRow.id) {
            _cardIdToDeckId[_c.id] = _deckRow.id!;
          }
        }
      }
      setCards(_cards);
      setCardIdToDeckId(_cardIdToDeckId);
    }
    init();
  }, []);

  async function updateCategory(card: CardsTableType) {
    let categoryCollision = await db.decks
      .where({
        name: deckName,
        category: title,
        card_id: card.id!,
      })
      .first();
    if (categoryCollision) return '';

    let old = await db.decks.where({ name: deckName, card_id: card.id! }).first();
    if (old === undefined) {
      await db.decks.add({
        name: deckName,
        card_id: card.id!,
        category: title,
        is_commander: false,
        format: 'commander',
      });
    } else {
      await db.decks.update(old!.id!, { category: title });
    }

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
      <Typography variant="h5">
        {title} - {Object.keys(cardIdToDeckId).length}
      </Typography>
      {cards.map((c: CardsTableType, i: number) => (
        <DeckListItem
          data={c}
          deckId={cardIdToDeckId[c.id!]}
          key={i}
          refreshParent={() => refreshParent()}
        />
      ))}
    </div>
  );
};
export default Category;
