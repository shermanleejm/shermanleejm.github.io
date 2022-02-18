import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { createWorker } from "tesseract.js";
import getCroppedImg from "./helper";
import { ScryfallDataType, ScryfallSetType } from "./interfaces";
import { CardsTableType, CustomImageUris } from "../../database";
import { MTGDBProps, ToasterSeverityEnum } from ".";
import SearchResultCard from "./SearchResultCard";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect } from "react";
import InfiniteScroll from "./InfiniteScroll";

interface SetSearchType {
  label: string;
  code: string;
  search_uri: string;
  parent_set_code: string | undefined;
}

enum SearchCardFilter {
  name = "name",
  set_name = "set_name",
}

const PER_PAGE = 24;

const AddNewCard = (props: MTGDBProps) => {
  const [img, setImg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [imgUploaded, setImgUploaded] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [text, setText] = useState("");
  const [rotation, setRotation] = useState(0);
  const [lastRequest, setLastRequest] = useState(Date.now());
  const [searchResults, setSearchResults] = useState<ScryfallDataType[]>([]);
  const [defaultTag, setDefaultTag] = useState("");
  const [setCodes, setSetCodes] = useState<SetSearchType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>(
    SearchCardFilter.name
  );
  const [selectedSet, setSelectedSet] = useState<SetSearchType>();
  const [isGeneratingMissing, setIsGeneratingMssing] = useState(false);
  const [infiniteData, setInfiniteData] = useState<ScryfallDataType[]>([]);
  const [infiniteRange, setInfiniteRange] = useState({
    prev: 0,
    next: PER_PAGE,
  });
  const [hasMoreInfinite, setHasMoreInfinite] = useState(true);
  const [showBottomSpinner, setShowBottomSpinner] = useState(false);

  useEffect(() => {
    function getSets() {
      axios
        .get("https://api.scryfall.com/sets")
        .then((res) => {
          setSetCodes(
            res.data.data
              .map((val: ScryfallSetType): SetSearchType => {
                return {
                  code: val.code,
                  parent_set_code: val.parent_set_code,
                  label: val.name,
                  search_uri: val.search_uri,
                };
              })
              .filter(
                (e: SetSearchType) =>
                  e.parent_set_code === undefined &&
                  !e.label.includes("Alchemy")
              )
          );
        })
        .catch((e) => console.error(e))
        .finally(() => setIsLoading(false));
    }

    getSets();
  }, []);

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

  function rootSetCards(arr: ScryfallDataType[]) {
    setSearchResults(arr);
    setInfiniteData(arr.slice(0, PER_PAGE));
  }

  async function searchCard(queryName: string) {
    setIsSearching(true);
    setInfiniteData([]);
    setSearchResults([]);
    const coolingPeriod = 500;

    if (Date.now() - lastRequest < coolingPeriod) {
      props.toaster("Too many requests", ToasterSeverityEnum.ERROR);
      setIsSearching(false);
      return 0;
    }

    switch (selectedFilter) {
      case "name":
        axios
          .get("https://api.scryfall.com/cards/search?q=" + queryName)
          .then((res) => {
            rootSetCards(
              res.data.data.filter(
                (c: ScryfallDataType) => c.name.substring(0, 2) != "A-"
              )
            );
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
        break;
      case "set_name":
        if (selectedSet !== undefined) {
          const resp = await axios.get(
            "https://api.scryfall.com/sets/" + selectedSet.code
          );
          let uri = resp.data.search_uri;
          let tmp: ScryfallDataType[] = [];
          while (uri !== undefined) {
            let r = await axios.get(uri);
            tmp = tmp.concat(
              r.data.data.filter(
                (c: ScryfallDataType) => c.name.substring(0, 2) != "A-"
              )
            );
            uri = r.data.next_page;
          }
          rootSetCards(tmp);
        }
        setIsSearching(false);
        break;
      default:
        break;
    }
  }

  async function storeCard(
    card: ScryfallDataType,
    tag?: string[],
    price?: string,
    qty?: number
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
      scryfall_id: card.id,
      price: price ? parseFloat(price) : parseFloat(card.prices.usd || "0"),
      quantity: qty || 1,
      set_name: card.set_name,
      rarity: card.rarity,
      mana_cost: card.mana_cost,
      cmc: card.cmc,
      image_uri: imgUris,
      colors: colors,
      color_identity: card.color_identity,
      tags: tag === undefined ? [] : tag,
      type_line: card.type_line,
      oracle_text: card.oracle_text,
      edhrec_rank: card.edhrec_rank,
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

  const filters = [
    { slug: SearchCardFilter.name, name: "Card Name" },
    { slug: SearchCardFilter.set_name, name: "Set Name" },
  ];

  async function generateMissingTxt() {
    let missingCardsTxt: Set<string> = new Set();
    for (let c of searchResults) {
      let evidence = props.cardDict?.has(c.name);
      if (evidence === undefined) {
        missingCardsTxt.add(`1 ${c.name.split(" // ")[0]}`);
      }
    }
    await navigator.clipboard.writeText(
      Array.from(missingCardsTxt).join("\n").substring(0, 99999)
    );
    setIsGeneratingMssing(false);
    props.toaster("Copied to clipboard!", ToasterSeverityEnum.SUCCESS);
  }

  const SearchResults = () => {
    return (
      <Grid
        container
        direction='row'
        spacing={1}
        justifyContent={"start"}
        alignItems={"stretch"}
        style={{ width: "80vw" }}
      >
        {infiniteData.map((sr: ScryfallDataType, index: number) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <SearchResultCard
              sr={sr}
              storeCard={(
                sr: ScryfallDataType,
                tags?: string[],
                price?: string,
                qty?: number
              ) => storeCard(sr, tags, price, qty)}
              cardDict={props.cardDict || new Set()}
              defaultTag={defaultTag}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  const loadMoreCards = () => {
    setShowBottomSpinner(true);

    setTimeout(() => {
      setInfiniteData(searchResults.slice(0, infiniteRange.next + PER_PAGE));
      setInfiniteRange((prevState) => ({
        prev: prevState.prev + PER_PAGE,
        next: prevState.next + PER_PAGE,
      }));
      setShowBottomSpinner(false);
    }, 500);
  };

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
    <div style={{ marginBottom: 50 }}>
      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'
      >
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

        {/* Search and Tags */}
        <Grid item xs={12} md={12}>
          <Grid
            container
            direction='column'
            spacing={1}
            style={{
              width: "80vw",
              margin: "16 0 16 0",
            }}
          >
            <Grid item>
              <Grid container direction={"row"}>
                <Grid item xs={3}>
                  <Select
                    fullWidth
                    defaultValue={selectedFilter}
                    onChange={(e) =>
                      setSelectedFilter(e.target.value as string)
                    }
                  >
                    {filters.map((f, i) => (
                      <MenuItem value={f.slug} key={i}>
                        {f.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={9}>
                  {selectedFilter === "name" && (
                    <TextField
                      value={text}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setText(e.target.value.replace(/[^a-zA-Z0-9\s]/g, ""))
                      }
                      label='Card Name (remove uneccessary characters)'
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setText("")}>
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                        if (e.key === "Enter") searchCard(text);
                      }}
                    />
                  )}
                  {selectedFilter === "set_name" && (
                    <Autocomplete
                      options={setCodes}
                      onChange={(e, val) =>
                        setSelectedSet(val === null ? undefined : val)
                      }
                      renderInput={(params) => (
                        <TextField {...params} label='Set Name' />
                      )}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <TextField
                label='Tag'
                value={defaultTag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDefaultTag(e.target.value)
                }
              ></TextField>
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
                    setInfiniteData([]);
                    setText("");
                  }}
                >
                  clear
                </Button>
              )}
            </Grid>
            <Grid item>
              {searchResults.length > 0 &&
                (isGeneratingMissing ? (
                  <CircularProgress />
                ) : (
                  <Button
                    onClick={() => {
                      setIsGeneratingMssing(true);
                      generateMissingTxt();
                    }}
                  >
                    copy missing to clipboard
                  </Button>
                ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Search results */}
        <Grid item>
          <InfiniteScroll
            hasMoreData={infiniteData.length < searchResults.length}
            isLoading={showBottomSpinner}
            onBottomHit={loadMoreCards}
          >
            <SearchResults />
          </InfiniteScroll>
        </Grid>

        {showBottomSpinner && (
          <Grid item>
            <CircularProgress />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default AddNewCard;
