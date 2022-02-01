import {
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { CustomImageUris } from '../../database';
import { ScryfallDataType } from './interfaces';

export type SearchResultCardType = {
  sr: ScryfallDataType;
  cardDict: { [key: string]: boolean };
  storeCard: (
    sr: ScryfallDataType,
    tag?: string,
    price?: string,
    qty?: number,
    imgUri?: string
  ) => void;
  defaultTag?: string;
};

const SearchResultCard = (props: SearchResultCardType) => {
  const [tag, setTag] = useState<string | undefined>();
  const [isClicked, setIsClicked] = useState(false);
  const [price, setPrice] = useState<string>();
  const [priceSelectOptions, setPriceSelectOptions] = useState<
    { type: string; money: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgUri, setImgUri] = useState<CustomImageUris>({
    small: [],
    normal: [],
  });
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    function preCheck() {
      if (props.cardDict && props.cardDict[props.sr.name]) {
        setIsClicked(true);
      }

      let tmp: { type: string; money: string }[] = [];
      if (props.sr.prices.usd !== null) {
        tmp.push({
          type: 'Non-foil',
          money: props.sr.prices.usd,
        });
      }
      if (props.sr.prices.usd_foil !== null) {
        tmp.push({
          type: 'Foil',
          money: props.sr.prices.usd_foil,
        });
      }
      if (props.sr.prices.usd_etched !== null) {
        tmp.push({
          type: 'Etched',
          money: props.sr.prices.usd_etched,
        });
      }
      setPriceSelectOptions(tmp);
      if (tmp.length > 0) {
        setPrice(tmp[0].money);
      }
      setIsLoading(false);

      if (props.defaultTag) {
        setTag(props.defaultTag);
      }

      let imageUris: CustomImageUris = { small: [], normal: [] };
      console.log(props.sr);
      if (props.sr.card_faces && 'image_uris' in props.sr.card_faces[0]) {
        for (let i = 0; i < props.sr.card_faces.length; i++) {
          imageUris.small.push(props.sr.card_faces[i].image_uris.small);
          imageUris.normal.push(props.sr.card_faces[i].image_uris.normal);
        }
      } else {
        imageUris = {
          small: [props.sr.image_uris?.small || ''],
          normal: [props.sr.image_uris?.normal || ''],
        };
      }
      setImgUri(imageUris);
    }

    preCheck();
  }, []);

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
  };

  return isLoading ? (
    <div>
      <CircularProgress />
    </div>
  ) : (
    <>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={showOverlay}
        onClick={() => setShowOverlay(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {imgUri.normal.map((s: string, i: number) => (
            <img src={s} alt="" width={imgUri.normal.length === 1 ? '100%' : '50%'}></img>
          ))}
        </div>
      </Backdrop>

      <Card raised sx={{ bgcolor: 'grey' }}>
        <CardMedia
          component="img"
          image={imgUri.small[0]}
          onClick={() => setShowOverlay(true)}
        />
        <CardContent>
          <Typography>{props.sr.name}</Typography>
          <br />
          <Typography>{props.sr.set_name}</Typography>
          <br />
          <TextField
            select
            fullWidth
            value={price}
            defaultChecked
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPrice(e.target.value);
            }}
          >
            {priceSelectOptions.map((pso) => (
              <MenuItem value={pso.money}>{`US$${pso.money} - ${pso.type}`}</MenuItem>
            ))}
          </TextField>
          <br />
          <br />
          <NumberFormat
            customInput={TextField}
            value={qty}
            thousandSeparator
            decimalScale={0}
            label="Quantity"
            onValueChange={(values) => {
              let { floatValue } = values;
              setQty(floatValue || 1);
            }}
            inputProps={{ fullWidth: 'true' }}
          />
        </CardContent>
        <CardActions>
          <Grid container direction={'column'}>
            <Grid item>
              <TextField onChange={handleTagChange} value={tag} label={'tag'} />
            </Grid>
            <Grid item>
              <Button
                disabled={isClicked}
                onClick={() => {
                  setIsClicked(true);
                  props.storeCard(props.sr, tag, price, qty);
                }}
              >
                add card
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </>
  );
};

export default SearchResultCard;
