import { Grid, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { CardsTableType } from '../../../database';
import DraggableCard from './DraggableCard';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type BoardProps = {
  cardArr: CardsTableType[];
};

const Board = (props: BoardProps) => {
  const perPage = 8;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(perPage);

  useEffect(() => {
    function resetPages() {
      setStartIndex(0);
      setEndIndex(perPage);
    }

    resetPages();
  }, [props.cardArr]);

  return (
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

      <div
        style={{
          width: '80vw',
          margin: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid container spacing={1}>
          {props.cardArr.slice(startIndex, endIndex).map((c: CardsTableType) => (
            <Grid item xs={3} lg={3}>
              <DraggableCard data={c} />
            </Grid>
          ))}
        </Grid>
      </div>

      <IconButton
        disabled={startIndex > props.cardArr.length - perPage}
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
