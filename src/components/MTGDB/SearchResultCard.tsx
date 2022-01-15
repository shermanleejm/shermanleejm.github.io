import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { ScryfallDataType } from '../../interfaces';

export type SearchResultCardType = {
  sr: ScryfallDataType;
  cardDict: { [key: string]: boolean };
  storeCard: (sr: ScryfallDataType, tag?: string) => void;
};

const SearchResultCard = (props: SearchResultCardType) => {
  const [tag, setTag] = useState<string | undefined>();

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
  };

  return (
    <Grid item xs={6} md={2}>
      <Card>
        <CardMedia
          component="img"
          image={props.sr.image_uris === undefined ? '' : props.sr.image_uris.small}
        />
        <CardContent>
          <Typography>{props.sr.name}</Typography>
        </CardContent>
        <CardActions>
          <Grid container direction={'column'}>
            <Grid item>
              <TextField onChange={handleTagChange} value={tag} label={'tag'} />
            </Grid>
            <Grid item>
              <Button
                disabled={props.cardDict ? props.cardDict[props.sr.name] : false}
                onClick={() => props.storeCard(props.sr, tag)}
              >
                add card
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default SearchResultCard;
