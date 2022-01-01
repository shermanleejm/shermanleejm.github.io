import {
  Button,
  CircularProgress,
  Grid,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { createWorker } from 'tesseract.js';
import Cropper from 'react-easy-crop';
import getCroppedImg from './helper';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';

const AddNewCard = () => {
  const [img, setImg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imgUploaded, setImgUploaded] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [text, setText] = useState('');
  const [rotation, setRotation] = useState(0);
  const [qty, setQty] = useState(1);
  const [lastRequest, setLastRequest] = useState(Date.now());
  const [price, setPrice] = useState(-1);

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

  function getCardPrice(queryName: string) {
    const coolingPeriod = 500;

    if (Date.now() - lastRequest < coolingPeriod) {
      return 0;
    }

    axios
      .get('https://api.scryfall.com/cards/search?q=' + queryName)
      .then((res) => {
        const usd = res.data.data[0].prices.usd;
        if (usd === null || usd === undefined) {
          setPrice(-1);
        }
        setPrice(res.data.data[0].prices.usd);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        let newTs = Date.now();
        setLastRequest(newTs);
      });
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
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
      <Grid item xs={12} md={12}>
        {text !== '' && (
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
              <Button fullWidth onClick={() => getCardPrice(text)}>
                get card price and store
              </Button>
            </Grid>
            <Grid item>
              {price > -1 && (
                <div>
                  <Typography>This card costs US${price}</Typography>
                </div>
              )}
            </Grid>
          </Grid>
        )}
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
        {text !== '' && img !== '' && imgUploaded && (
          <Button
            onClick={() => {
              setText('');
              setImg('');
              setImgUploaded(false);
            }}
          >
            Close
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default AddNewCard;
