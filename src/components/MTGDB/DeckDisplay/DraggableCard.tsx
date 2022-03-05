import {
  Backdrop,
  Card,
  CardActions,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect, useState } from 'react';
import { CardsTableType } from '../../../database';
import { useDrag } from 'react-dnd';
import { DBCoreRangeType } from 'dexie';
import { useSelector } from 'react-redux';
import { State } from '../../../state/reducers';
import { changeCategory } from '..';

type DraggableCardType = {
  data: CardsTableType;
  addToDecklist: (c: CardsTableType) => void;
  deckName: string;
  refreshDeckList: () => void;
};

const DraggableCard = ({
  data,
  addToDecklist,
  deckName,
  refreshDeckList,
}: DraggableCardType) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'deckListItem',
    item: data,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const db = useSelector((state: State) => state.database);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (data.id) {
        setDisabled(
          (await db.decks.where({ card_id: data.id, name: deckName }).first()) !==
            undefined
        );
      }
      setIsLoading(false);
    }
    init();
  }, [data, isLoading]);

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
    await changeCategory(db, deckRow, deckName);
    refreshDeckList();
    setIsLoading(true);
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <div>
      <div>
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={showOverlay}
          onClick={() => setShowOverlay(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {data.image_uri.normal !== undefined
              ? data.image_uri.normal.map((s: string, i: number) => (
                  <img
                    key={i}
                    src={s}
                    alt=""
                    width={data.image_uri.normal.length === 1 ? '100%' : '50%'}
                    height="100%"
                  ></img>
                ))
              : ''}
          </div>
        </Backdrop>
      </div>

      <Card
        ref={drag}
        style={{ border: isDragging ? '5px solid pink' : '', cursor: 'pointer' }}
      >
        <CardMedia
          onClick={() => updateCategory(data)}
          component={'img'}
          image={data.image_uri.small[0]}
        />
        <CardActions style={{ cursor: 'pointer' }} onClick={() => setShowOverlay(true)}>
          <Grid container direction={'row'}>
            <Grid item>
              <IconButton>
                <ZoomInIcon />
              </IconButton>
            </Grid>

            <Grid item>
              <IconButton>{disabled ? <CheckCircleIcon /> : ''}</IconButton>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </div>
  );
};
export default DraggableCard;
