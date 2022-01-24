import { Card, CardMedia } from '@mui/material';
import { useState } from 'react';
import { CardsTableType } from '../../../database';

type DraggableCardProps = {
  data: CardsTableType;
};

const DraggableCard = (props: DraggableCardProps) => {
  const [hidden, setHidden] = useState(false);

  return (
    <Card
      hidden={hidden}
      onClick={() => setHidden(true)}
      sx={{ maxWidth: { xs: '50vh', md: '30vh' } }}
    >
      <CardMedia component={'img'} image={props.data.image_uri} />
    </Card>
  );
};
export default DraggableCard;
