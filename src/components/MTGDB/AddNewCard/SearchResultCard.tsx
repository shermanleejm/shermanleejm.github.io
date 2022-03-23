import {
  Autocomplete,
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { storeCard, ToasterSeverityEnum } from '..';
import { CustomImageUris } from '../../../database';
import { State } from '../../../state/reducers';
import { ScryfallDataType } from '../interfaces';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export type SearchResultCardType = {
  sr: ScryfallDataType;
  defaultTag: string;
  toaster: (m: string, e: ToasterSeverityEnum) => void;
};

const SearchResultCard = ({ sr, defaultTag, toaster }: SearchResultCardType) => {
  const [tags, setTags] = useState<string[]>([]);
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
  const [similarNameExists, setSimilarNameExists] = useState(false);

  const db = useSelector((state: State) => state.database);

  useEffect(() => {
    async function preCheck() {
      let check = await db.cards.where('scryfall_id').equalsIgnoreCase(sr.id).first();
      let check1 = await db.cards.where('name').equalsIgnoreCase(sr.name).first();
      setSimilarNameExists(check1 !== undefined && check === undefined);

      let oldTags: string[] = [];
      if (defaultTag !== '') {
        oldTags.push(defaultTag);
      }
      if (check !== undefined) {
        oldTags = oldTags.concat(check.tags);
        setIsClicked(true);
        if (check.id) {
          await db.cards.update(check.id, { tags: Array.from(new Set(oldTags)) });
        }
      }
      setTags(Array.from(new Set(oldTags)));

      let tmp: { type: string; money: string }[] = [];
      if (sr.prices.usd !== null) {
        tmp.push({
          type: 'Non-foil',
          money: sr.prices.usd,
        });
      }
      if (sr.prices.usd_foil !== null) {
        tmp.push({
          type: 'Foil',
          money: sr.prices.usd_foil,
        });
      }
      if (sr.prices.usd_etched !== null) {
        tmp.push({
          type: 'Etched',
          money: sr.prices.usd_etched,
        });
      }
      setPriceSelectOptions(tmp);
      if (tmp.length > 0) {
        setPrice(tmp[0].money);
      }
      setIsLoading(false);

      let imageUris: CustomImageUris = { small: [], normal: [] };
      if (sr.card_faces && 'image_uris' in sr.card_faces[0]) {
        for (let i = 0; i < sr.card_faces.length; i++) {
          imageUris.small.push(sr.card_faces[i].image_uris.small);
          imageUris.normal.push(sr.card_faces[i].image_uris.normal);
        }
      } else {
        imageUris = {
          small: [sr.image_uris?.small || ''],
          normal: [sr.image_uris?.normal || ''],
        };
      }
      setImgUri(imageUris);
    }

    preCheck();
  }, []);

  const handleTagChange = (
    event: SyntheticEvent<Element, Event>,
    value: (string | string[])[]
  ) => {
    let tmp: string[] = [];
    if (Array.isArray(value)) {
      for (let c of value) {
        if (typeof c === 'string') {
          tmp.push(c);
        }
      }
    }
    setTags(tmp);
  };

  async function removeCard() {
    let cardToDelete = await db.cards.where('scryfall_id').equals(sr.id).first();
    if (cardToDelete && cardToDelete.id) {
      await db.cards.delete(cardToDelete.id);
    }
    setIsClicked(!isClicked);
    toaster(`Removed ${sr.name}!`, ToasterSeverityEnum.SUCCESS);
  }

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
            <img
              key={i}
              src={s}
              alt=""
              width={imgUri.normal.length === 1 ? '100%' : '50%'}
            ></img>
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
          <Typography>{sr.name}</Typography>
          <br />
          <Typography>{sr.set_name}</Typography>
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
            {priceSelectOptions.map((pso, i) => (
              <MenuItem
                key={i}
                value={pso.money}
              >{`US$${pso.money} - ${pso.type}`}</MenuItem>
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
              <Autocomplete
                freeSolo
                multiple
                options={[]}
                onChange={handleTagChange}
                value={tags}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => <TextField {...params} label={'tags'} />}
              />
            </Grid>
            <Grid item>
              <Grid container>
                <Grid item>
                  <IconButton
                    disabled={isClicked}
                    onClick={() => {
                      setIsClicked(true);
                      storeCard(db, sr, tags, qty, price);
                      toaster(`Added ${sr.name}!`, ToasterSeverityEnum.SUCCESS);
                    }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Button disabled={!isClicked} onClick={() => removeCard()}>
                    undo
                  </Button>
                </Grid>
                <Grid item>
                  {similarNameExists ? (
                    <Typography>A card with the same name already exists</Typography>
                  ) : (
                    ''
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </>
  );
};

export default SearchResultCard;
