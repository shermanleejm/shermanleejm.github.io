import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Slider,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import NumberFormat from 'react-number-format';
import { createWorker } from 'tesseract.js';
import getCroppedImg from '../helper';
import { ScryfallDataType } from '../../../interfaces';
import { State } from '../../../state/reducers';
import { useSelector } from 'react-redux';
import { CardsTableType } from '../../../database';
import CloseIcon from '@mui/icons-material/Close';

const Scanner = () => {
  const [img, setImg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imgUploaded, setImgUploaded] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [text, setText] = useState(' ');
  const [rotation, setRotation] = useState(0);
  const [qty, setQty] = useState(1);
  const [lastRequest, setLastRequest] = useState(Date.now());
  const [searchResults, setSearchResults] = useState<ScryfallDataType[]>([]);
  const [showToaster, setShowToaster] = useState(false);
  const [cardExistence, setCardExistence] = useState({}) as any;

  const db = useSelector((state: State) => state.database);

  const handleChange = (event: any) => {
    setImg(URL.createObjectURL(event.target.files[0]));
    setImgUploaded(true);
  };

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    setIsLoading(true);
    try {
      const croppedImage: any = await getCroppedImg(img, croppedAreaPixels, rotation);
      console.log('donee', { croppedImage });
      try {
        let worker = createWorker({
          logger: (m) => console.log(m),
        });
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const {
          data: { text },
        } = await worker.recognize(croppedImage);
        setText(text);
        await worker.terminate();
      } catch (err) {
        console.error(err);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [croppedAreaPixels, img, rotation]);

  function searchCard(queryName: string) {
    const coolingPeriod = 500;

    if (Date.now() - lastRequest < coolingPeriod) {
      return 0;
    }

    axios
      .get('https://api.scryfall.com/cards/search?q=' + queryName)
      .then((res) => {
        setSearchResults(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLastRequest(Date.now());
      });
  }

  async function storeCard(card: ScryfallDataType) {
    const newEntry: CardsTableType = {
      name: card.name,
      price: parseInt(card.prices.usd || '0'),
      quantity: qty,
      date_added: Date.now(),
      set_name: card.set_name,
      rarity: card.rarity,
    };

    const collision: CardsTableType | undefined = await db.cards
      .where('name')
      .equalsIgnoreCase(card.name)
      .first();

    if (collision === undefined) {
      db.transaction('rw', db.cards, async () => {
        await db.cards.add(newEntry);
      });
    } else {
      db.transaction('rw', db.cards, async () => {
        await db.cards.update(collision.id || 0, newEntry);
      });
    }

    setShowToaster(true);
    setSearchResults([]);
  }

  const handleCloseToaster = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToaster(false);
  };

  const toaster = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseToaster}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  function cardExists(cardName: string) {
    let collision = db.cards.where('name').equalsIgnoreCase(cardName).first();
    return collision !== undefined;
  }

  return isLoading ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '36 0 36 0',
      }}
    >
      <CircularProgress />
    </div>
  ) : (
    <div>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item style={{ width: '80vw' }}>
          <Grid container direction="row" justifyContent="space-around" spacing={3}>
            <Grid item>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleChange}
                style={{ display: 'none' }}
                id="upload-image"
              />
              <label htmlFor="upload-image">
                <Button component="span">upload</Button>
              </label>
            </Grid>
            <Grid item>
              <Button onClick={showCroppedImage}>do magic</Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          {imgUploaded && (
            <div style={{ width: '80vw' }}>
              <div style={{ position: 'relative', height: 300, width: '100%' }}>
                <Cropper
                  image={img}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={2 / 0.5}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                />
              </div>
              <Slider
                value={rotation}
                min={-90}
                max={90}
                step={1}
                onChange={(_, rotation: any) => setRotation(rotation)}
              />
            </div>
          )}
        </Grid>
        <Grid item>
          {img !== '' && imgUploaded && (
            <Button
              onClick={() => {
                setImg('');
                setImgUploaded(false);
              }}
            >
              close scanner
            </Button>
          )}
        </Grid>

        <Grid item xs={12} md={12}>
          <Grid
            container
            direction="column"
            spacing={2}
            style={{
              width: '80vw',
              margin: '16 0 16 0',
            }}
          >
            <Grid item>
              <TextField
                value={text}
                onChange={(e: any) => setText(e.target.value)}
                label="Card Name (remove uneccessary characters)"
                fullWidth
              />
            </Grid>
            <Grid item>
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
            </Grid>
            <Grid item>
              <Button fullWidth onClick={() => searchCard(text)}>
                search
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid
            container
            direction="row"
            spacing={3}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            {searchResults.length > 0 &&
              searchResults.map((sr: ScryfallDataType) => {
                return (
                  <Grid item xs={6}>
                    <Card>
                      <CardMedia component="img" image={sr.image_uris.small} />
                      <CardContent>
                        <Typography>{sr.name}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          disabled={cardExists(sr.name)}
                          onClick={() => storeCard(sr)}
                        >
                          add card
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={showToaster}
        autoHideDuration={3000}
        onClose={handleCloseToaster}
        action={toaster}
        message="Card added"
      >
        <Alert severity="success">Card Added!</Alert>
      </Snackbar>
    </div>
  );
};

export default Scanner;