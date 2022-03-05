import { Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import { CardsTableType } from '../../../database';
import { HtmlTooltip } from '../CardDataGrid';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import { State } from '../../../state/reducers';

type DeckListItemType = {
  data: CardsTableType;
  refreshParent: () => void;
  key: number;
  deckId: string;
};

const DeckListItem = ({ data, refreshParent, key, deckId }: DeckListItemType) => {
  const db = useSelector((state: State) => state.database);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'deckListItem',
    item: data,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  async function removeFromDeck() {
    await db.decks.delete(parseInt(deckId));
    refreshParent();
  }

  return (
    <Card
      ref={drag}
      elevation={3}
      style={{
        marginBottom: 5,
        border: isDragging ? '5px solid pink' : '',
        cursor: 'all-scroll',
      }}
      key={key}
    >
      <HtmlTooltip
        title={
          <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {data.image_uri.small.map((s: string, i: number) => (
                <img key={i} src={data.image_uri.small[i]} alt=""></img>
              ))}
            </div>
          </React.Fragment>
        }
        followCursor
      >
        <CardContent style={{ padding: 3 }} onClick={() => removeFromDeck()}>
          <Grid container spacing={2}>
            <Grid item>
              <Typography>{data.cmc}</Typography>
            </Grid>
            <Grid item>
              <Typography>{data.name}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </HtmlTooltip>
    </Card>
  );
};

export default DeckListItem;
