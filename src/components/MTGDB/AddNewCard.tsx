import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Slider,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { createWorker } from "tesseract.js";
import getCroppedImg from "./helper";
import { ScryfallDataType, ImageUris } from "../../interfaces";
import { CardsTableType, CustomImageUris } from "../../database";
import { MTGDBProps, ToasterSeverityEnum } from ".";
import SearchResultCard from "./SearchResultCard";
import ClearIcon from "@mui/icons-material/Clear";

const AddNewCard = (props: MTGDBProps) => {
  const [img, setImg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [imgUploaded, setImgUploaded] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [text, setText] = useState(" ");
  const [rotation, setRotation] = useState(0);
  const [lastRequest, setLastRequest] = useState(Date.now());
  const [searchResults, setSearchResults] = useState<ScryfallDataType[]>([]);

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

  function searchCard(queryName: string) {
    setIsSearching(true);
    setSearchResults([]);
    const coolingPeriod = 500;

    if (Date.now() - lastRequest < coolingPeriod) {
      props.toaster("Too many requests", ToasterSeverityEnum.ERROR);
      setIsSearching(false);
      return 0;
    }

    axios
      .get("https://api.scryfall.com/cards/search?q=" + queryName)
      .then((res) => {
        console.log(res.data.data[0]);
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

  async function storeCard(
    card: ScryfallDataType,
    tag?: string,
    price?: string,
    qty?: number,
    imgUri?: string
  ) {
    let colors = [];
    if (card.card_faces) {
      colors = card.card_faces[0].colors;
    } else {
      colors = card.colors || [];
    }

    let imgUris: CustomImageUris = { small: [], normal: [] };
    if (card.card_faces) {
      for (let i = 0; i < card.card_faces.length; i++) {
        imgUris.small.push(card.card_faces[i].image_uris.small);
        imgUris.normal.push(card.card_faces[i].image_uris.normal);
      }
    } else if (card.image_uris) {
      imgUris = {
        small: [card.image_uris?.small],
        normal: [card.image_uris?.normal],
      };
    }

    const newEntry: CardsTableType = {
      name: card.name,
      price: price ? parseFloat(price) : parseFloat(card.prices.usd || "0"),
      quantity: qty || 1,
      set_name: card.set_name,
      rarity: card.rarity,
      mana_cost: card.mana_cost,
      cmc: card.cmc,
      image_uri: imgUris,
      colors: colors,
      color_identity: card.color_identity,
      tags: tag === undefined ? [] : [tag],
      type_line: card.type_line,
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
        {/* Upload and Magic button  */}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setText(e.target.value.replace(/[^a-zA-Z0-9\s]/g, ""))
                }
                label="Card Name (remove uneccessary characters)"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setText("")}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === "Enter") searchCard(text);
                }}
              />
            </Grid>
            <Grid item>
              {isSearching ? (
                <CircularProgress />
              ) : (
                <Button fullWidth onClick={() => searchCard(text)}>
                  search
                </Button>
              )}
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
            spacing={1}
            justifyContent={"start"}
            alignItems={"stretch"}
            style={{ width: "80vw" }}
          >
            {searchResults.map((sr: ScryfallDataType) => (
              <SearchResultCard
                sr={sr}
                storeCard={(
                  sr: ScryfallDataType,
                  tag?: string,
                  price?: string,
                  qty?: number
                ) => storeCard(sr, tag, price, qty)}
                cardDict={props.cardDict || {}}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddNewCard;
