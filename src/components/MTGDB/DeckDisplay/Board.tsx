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
};

const Board = ({ cardArr, decklist, addToDeckList, deckName }: BoardProps) => {
  const perPage = 8;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(perPage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function resetPages() {
      setStartIndex(0);
      setEndIndex(perPage);
      setIsLoading(false);
    }

    resetPages();
  }, [cardArr]);

  async function addToDecklistCallback(c: CardsTableType) {
    addToDeckList(c);
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <div style={{ display: 'flex' }}>
      <IconButton
        disabled={startIndex - perPage < 0}
        onClick={() => {
          setStartIndex(startIndex - perPage);
          setEndIndex(endIndex - perPage);
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <Grid container spacing={1} justifyContent={'flex-start'} alignItems={'center'}>
        {cardArr.slice(startIndex, endIndex).map((c: CardsTableType, i) => (
          <Grid item xs={6} sm={3} justifyContent={'center'} key={i}>
            <DraggableCard
              data={c}
              addToDecklist={(c: CardsTableType) => addToDecklistCallback(c)}
              disabled={decklist.has(c)}
            />
          </Grid>
        ))}
      </Grid>

      <IconButton
        disabled={startIndex >= cardArr.length - perPage}
        onClick={() => {
          setStartIndex(startIndex + perPage);
          setEndIndex(endIndex + perPage);
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  );
};

export default Board;
