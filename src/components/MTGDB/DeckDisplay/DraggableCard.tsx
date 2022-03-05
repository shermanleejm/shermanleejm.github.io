import { Backdrop, Card, CardActions, CardMedia, Grid, IconButton } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import { CardsTableType } from '../../../database';
import { useDrag } from 'react-dnd';

type DraggableCardType = {
  data: CardsTableType;
  addToDecklist: (c: CardsTableType) => void;
  disabled: boolean;
};

const DraggableCard = ({ data, addToDecklist, disabled }: DraggableCardType) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'deckListItem',
    item: data,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
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

      <Card ref={drag} style={{ border: isDragging ? '5px solid pink' : '' }}>
        <CardMedia
          onClick={() => addToDecklist(data)}
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
            {disabled && (
              <Grid item>
                <IconButton>{disabled ? <CheckCircleIcon /> : ''}</IconButton>
              </Grid>
            )}
          </Grid>
        </CardActions>
      </Card>
    </div>
  );
};
export default DraggableCard;
