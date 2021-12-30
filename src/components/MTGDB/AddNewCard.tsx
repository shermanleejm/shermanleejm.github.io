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
      .finally(() => setLastRequest(Date.now()));
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
          <div
            style={{
              width: '80vw',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              margin: 16,
            }}
          >
            <TextField
              value={text}
              onChange={(e: any) => setText(e.target.value)}
              label="Card Name (remove uneccessary characters)"
            />
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
            />
            <Button onClick={() => getCardPrice(text)}>submit</Button>
            {price > -1 && <Typography>This card costs US${price}</Typography>}
          </div>
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
