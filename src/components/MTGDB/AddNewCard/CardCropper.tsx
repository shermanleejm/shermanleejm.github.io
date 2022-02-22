import { Button, Grid, Slider } from "@mui/material";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { createWorker } from "tesseract.js";
import getCroppedImg from "../helper";

interface CardCropperProps {
  setText: (newText: string) => void;
}

const CardCropper = ({ setText }: CardCropperProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [img, setImg] = useState("");
  const [imgUploaded, setImgUploaded] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [rotation, setRotation] = useState(0);

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
      const croppedImage: any = await getCroppedImg(
        img,
        croppedAreaPixels,
        rotation
      );
      try {
        let worker = createWorker({
          logger: (m) => console.log(m),
        });
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const {
          data: { text },
        } = await worker.recognize(croppedImage);
        setText(text.replace(/[^a-zA-Z0-9\s]/g, ""));
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

  return (
    <>
      {/* Upload and Magic button  */}
      <Grid item style={{ width: "80vw" }}>
        <Grid
          container
          direction='row'
          justifyContent='space-around'
          spacing={3}
        >
          <Grid item>
            <input
              type='file'
              accept='image/*'
              capture='environment'
              onChange={handleChange}
              style={{ display: "none" }}
              id='upload-image'
            />
            <label htmlFor='upload-image'>
              <Button component='span'>scanner</Button>
            </label>
          </Grid>
          <Grid item>
            <Button onClick={showCroppedImage}>do magic</Button>
          </Grid>
        </Grid>
      </Grid>
      {/* Cropper */}
      <Grid item>
        {imgUploaded && (
          <div style={{ width: "80vw" }}>
            <div style={{ position: "relative", height: 300, width: "100%" }}>
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
        {img !== "" && imgUploaded && (
          <Button
            onClick={() => {
              setImg("");
              setImgUploaded(false);
            }}
          >
            close scanner
          </Button>
        )}
      </Grid>
    </>
  );
};

export default CardCropper;
