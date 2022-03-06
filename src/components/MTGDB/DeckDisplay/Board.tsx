import { CircularProgress, Grid, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { CardsTableType } from '../../../database';
import DraggableCard from './DraggableCard';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type BoardProps = {
  cardArr: CardsTableType[];
  decklist: Set<CardsTableType>;
  addToDeckList: (c: CardsTableType) => void;
  deckName: string;
  refreshDeckList: () => void;
};

const Board = ({
  cardArr,
  decklist,
  addToDeckList,
  deckName,
  refreshDeckList,
}: BoardProps) => {
  const PER_PAGE = window.innerWidth < 400 ? 8 : 12;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [showCards, setShowCards] = useState(true);

  useEffect(() => {
    function resetPages() {
      setStartIndex(0);
      setEndIndex(PER_PAGE);
      setIsLoading(false);
    }

    resetPages();
  }, [cardArr]);

  async function addToDecklistCallback(c: CardsTableType) {
    addToDeckList(c);
  }

  function refreshCards() {
    setShowCards(false);
    setShowCards(true);
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <div style={{ display: 'flex' }}>
      <IconButton
        disabled={startIndex - PER_PAGE < 0}
        onClick={() => {
          setStartIndex(startIndex - PER_PAGE);
          setEndIndex(endIndex - PER_PAGE);
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <Grid container spacing={1} justifyContent={'flex-start'} alignItems={'center'}>
        {showCards &&
          cardArr.slice(startIndex, endIndex).map((c: CardsTableType, i) => (
            <Grid item xs={3} sm={2} justifyContent={'center'} key={i}>
              <DraggableCard
                data={c}
                addToDecklist={(c: CardsTableType) => addToDecklistCallback(c)}
                deckName={deckName}
                refreshDeckList={refreshDeckList}
                refreshCards={() => refreshCards()}
              />
            </Grid>
          ))}
      </Grid>

      <IconButton
        disabled={startIndex >= cardArr.length - PER_PAGE}
        onClick={() => {
          setStartIndex(startIndex + PER_PAGE);
          setEndIndex(endIndex + PER_PAGE);
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  );
};

export default Board;
