import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import NumberFormat from "react-number-format";
import { createWorker } from "tesseract.js";
import getCroppedImg from "./helper";
import { ScryfallDataType } from "../../interfaces";
import { CardsTableType } from "../../database";
import { MTGDBProps, ToasterSeverityEnum } from ".";

const AddNewCard = (props: MTGDBProps) => {
  const [img, setImg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(true);
  const [imgUploaded, setImgUploaded] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [text, setText] = useState(" ");
  const [rotation, setRotation] = useState(0);
  const [qty, setQty] = useState(1);
  const [lastRequest, setLastRequest] = useState(Date.now());
  const [searchResults, setSearchResults] = useState<any[]>([]);

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
    setIsSearching(true);
    setSearchResults([]);
    const coolingPeriod = 500;

    if (Date.now() - lastRequest < coolingPeriod) {
      return 0;
    }

    axios
      .get("https://api.scryfall.com/cards/search?q=" + queryName)
      .then((res) => {
        setSearchResults(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 404 || err.response.status === 400) {
          props.toaster("No card found", ToasterSeverityEnum.ERROR);
        }
      })
      .finally(() => {
        setLastRequest(Date.now());
        setIsSearching(false);
      });
  }

  async function storeCard(card: ScryfallDataType) {
    const newEntry: CardsTableType = {
      name: card.name,
      price: parseFloat(card.prices.usd || "0"),
      quantity: qty,
      set_name: card.set_name,
      rarity: card.rarity,
      mana_cost: card.mana_cost,
      cmc: card.cmc,
      image_uri: card.image_uris?.small ?? "",
      colors: card.colors,
      color_identity: card.color_identity,
      tags: [],
      date_added: Date.now(),
    };

    const collision: CardsTableType | undefined = await props.db.cards
      .where("name")
      .equalsIgnoreCase(card.name)
      .first();

    if (collision === undefined) {
      props.db.transaction("rw", props.db.cards, async () => {
        await props.db.cards.add(newEntry);
      });
    } else {
      props.db.transaction("rw", props.db.cards, async () => {
        await props.db.cards.update(collision.id || 0, newEntry);
      });
    }

    props.toaster("Recorded card!", ToasterSeverityEnum.SUCCESS);
    props.refresh(true);
  }

  return isLoading ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "36 0 36 0",
      }}
    >
      <CircularProgress />
    </div>
  ) : (
    <div>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item style={{ width: "80vw" }}>
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            spacing={3}
          >
            <Grid item>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleChange}
                style={{ display: "none" }}
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

        <Grid item xs={12} md={12}>
          <Grid
            container
            direction="column"
            spacing={2}
            style={{
              width: "80vw",
              margin: "16 0 16 0",
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
                inputProps={{ fullWidth: "true" }}
              />
            </Grid>
            <Grid item>
              <Button fullWidth onClick={() => searchCard(text)}>
                search
              </Button>
            </Grid>
            <Grid item>
              {searchResults.length > 0 && (
                <Button
                  fullWidth
                  onClick={() => {
                    setSearchResults([]);
                    setText("");
                  }}
                >
                  clear
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid
            container
            direction="row"
            spacing={3}
            justifyContent={"start"}
            alignItems={"center"}
            style={{ width: "80vw" }}
          >
            {!isSearching &&
              searchResults.map((sr: ScryfallDataType) => {
                return (
                  <Grid item xs={6} md={2}>
                    <Card>
                      <CardMedia
                        component="img"
                        image={
                          sr.image_uris === undefined ? "" : sr.image_uris.small
                        }
                      />
                      <CardContent>
                        <Typography>{sr.name}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          disabled={
                            props.cardDict ? props.cardDict[sr.name] : false
                          }
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
    </div>
  );
};

export default AddNewCard;