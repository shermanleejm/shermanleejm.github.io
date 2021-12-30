import { Button, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';
import Cropper from 'react-easy-crop';
import getCroppedImg from './helper';

const MTGDB = () => {
  const [img, setImg] = useState('');
  const [text, setText] = useState('');
  const [worker, setWorker] = useState() as any;
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   let worker = createWorker({
  //     logger: (m) => console.log(m),
  //   });
  //   setWorker(worker);
  //   setIsLoading(false);
  // }, [isLoading]);

  const handleClick = async () => {
    //   await worker.load();
    //   await worker.loadLanguage('eng');
    //   await worker.initialize('eng');
    //   const {
    //     data: { text },
    //   } = await worker.recognize('');
    //   console.log(text);
    //   await worker.terminate();
  };

  const handleChange = (event: any) => {
    setImg(URL.createObjectURL(event.target.files[0]));
    setIsLoading(false);
  };

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null) as any;
  const [rotation, setRotation] = useState(0);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(img, croppedAreaPixels, rotation);
      console.log('donee', { croppedImage });
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  return (
    <div>
      <input type="file" accept="image/*" capture="environment" onChange={handleChange} />

      <Button onClick={handleClick}>do magic</Button>

      <div style={{ position: 'relative', height: '480px', width: '480px' }}>
        {!isLoading && (
          <Cropper
            image={img}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        )}
        <Button onClick={showCroppedImage} variant="contained" color="primary"></Button>
      </div>
      <img src={croppedImage} alt="cropped" />
    </div>
  );
};

export default MTGDB;
