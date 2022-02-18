import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Slider,
  TextField,
} from '@mui/material';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { createWorker } from 'tesseract.js';
import getCroppedImg from './helper';
import { ScryfallDataType, ScryfallSetType } from './interfaces';
import { CardsTableType, CustomImageUris } from '../../database';
import { MTGDBProps, ToasterSeverityEnum } from '.';
import SearchResultCard from './SearchResultCard';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';
interface SetSearchType {
  label: string;
  code: string;
  search_uri: string;
  parent_set_code: string | undefined;
}

enum SearchCardFilter {
  name = 'name',
  set_name = 'set_name',
}

const AddNewCard = ({ toaster }: MTGDBProps) => {
  const [img, setImg] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [imgUploaded, setImgUploaded] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [text, setText] = useState('');
  const [rotation, setRotation] = useState(0);
  const [lastRequest, setLastRequest] = useState(Date.now());
  const [searchResults, setSearchResults] = useState<ScryfallDataType[]>([]);
  const [defaultTag, setDefaultTag] = useState('');
  const [setCodes, setSetCodes] = useState<SetSearchType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>(SearchCardFilter.name);
  const [selectedSet, setSelectedSet] = useState<SetSearchType>();
  const [isGeneratingMissing, setIsGeneratingMssing] = useState(false);
  const [showMissingDialog, setShowMissingDialog] = useState(false);
  const [missingTxt, setMissingTxt] = useState('');

  const db = useSelector((state: State) => state.database);

  useEffect(() => {
    function getSets() {
      axios
        .get('https://api.scryfall.com/sets')
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
                  e.parent_set_code === undefined && !e.label.includes('Alchemy')
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
      const croppedImage: any = await getCroppedImg(img, croppedAreaPixels, rotation);
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
        setText(text.replace(/[^a-zA-Z0-9\s]/g, ''));
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

  async function searchCard(queryName: string) {
    setIsSearching(true);
    setSearchResults([]);
    const coolingPeriod = 500;

    if (Date.now() - lastRequest < coolingPeriod) {
      toaster('Too many requests', ToasterSeverityEnum.ERROR);
      setIsSearching(false);
      return 0;
    }

    switch (selectedFilter) {
      case 'name':
        axios
          .get('https://api.scryfall.com/cards/search?q=' + queryName)
          .then((res) => {
            setSearchResults(
              res.data.data.filter(
                (c: ScryfallDataType) => c.name.substring(0, 2) !== 'A-'
              )
            );
          })
          .catch((err) => {
            console.error(err);
            if (err.response.status === 404 || err.response.status === 400) {
              toaster('No card found', ToasterSeverityEnum.ERROR);
            }
          })
          .finally(() => {
            setLastRequest(Date.now());
            setIsSearching(false);
          });
        break;
      case 'set_name':
        if (selectedSet !== undefined) {
          const resp = await axios.get(
            'https://api.scryfall.com/sets/' + selectedSet.code
          );
          let uri = resp.data.search_uri;
          let tmp: ScryfallDataType[] = [];
          while (uri !== undefined) {
            let r = await axios.get(uri);
            tmp = tmp.concat(
              r.data.data.filter((c: ScryfallDataType) => c.name.substring(0, 2) !== 'A-')
            );
            uri = r.data.next_page;
          }
          setSearchResults(tmp);
        }
        setIsSearching(false);
        break;
      default:
        break;
    }
  }

  const filters = [
    { slug: SearchCardFilter.name, name: 'Card Name' },
    { slug: SearchCardFilter.set_name, name: 'Set Name' },
  ];

  async function generateMissingTxt() {
    let missingCardsTxt: Set<string> = new Set();
    for (let c of searchResults) {
      let exists = await db.cards.where('name').equalsIgnoreCase(c.name).first();
      if (!exists) {
        missingCardsTxt.add(`1 ${c.name.split(' // ')[0]}`);
      }
    }
    navigator.clipboard
      .writeText(Array.from(missingCardsTxt).join('\n').substring(0, 99999))
      .then(() => console.log('Copied'))
      .catch((err) => console.log(err));
    setIsGeneratingMssing(false);
    setMissingTxt(Array.from(missingCardsTxt).join('\n').substring(0, 99999));
    setShowMissingDialog(true);
    toaster('Copied to clipboard!', ToasterSeverityEnum.SUCCESS);
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
        {/* Upload and Magic button  */}
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
                <Button component="span">scanner</Button>
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

        {/* Search and Tags */}
        <Grid item xs={12} md={12}>
          <Grid
            container
            direction="column"
            spacing={1}
            style={{
              width: '80vw',
              margin: '16 0 16 0',
            }}
          >
            <Grid item>
              <Grid container direction={'row'}>
                <Grid item xs={3}>
                  <Select
                    fullWidth
                    defaultValue={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value as string)}
                  >
                    {filters.map((f, i) => (
                      <MenuItem value={f.slug} key={i}>
                        {f.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={9}>
                  {selectedFilter === 'name' && (
                    <TextField
                      value={text}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setText(e.target.value.replace(/[^a-zA-Z0-9\s\+]/g, ''))
                      }
                      label="Card Name (remove uneccessary characters)"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end" onClick={() => setText('')}>
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                        if (e.key === 'Enter') searchCard(text);
                      }}
                    />
                  )}
                  {selectedFilter === 'set_name' && (
                    <Autocomplete
                      options={setCodes}
                      onChange={(e, val) =>
                        setSelectedSet(val === null ? undefined : val)
                      }
                      renderInput={(params) => <TextField {...params} label="Set Name" />}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <TextField
                label="Tag"
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
                    setText('');
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
          <Grid
            container
            direction="row"
            spacing={1}
            justifyContent={'start'}
            alignItems={'stretch'}
            style={{ width: '80vw' }}
          >
            {searchResults.map((sr: ScryfallDataType, i) => (
              <Grid item xs={6} sm={4} md={3} key={i}>
                <SearchResultCard sr={sr} defaultTag={defaultTag} toaster={toaster} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={showMissingDialog} onClose={() => setShowMissingDialog(false)}>
        <DialogTitle>Missing Cards</DialogTitle>
        <TextField multiline value={missingTxt} onFocus={(e: any) => e.target.select()} />
      </Dialog>
    </div>
  );
};

export default AddNewCard;
