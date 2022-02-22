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
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { ScryfallDataType, ScryfallSetType } from "../interfaces";
import { MTGDBProps, ToasterSeverityEnum } from "..";
import SearchResultCard from "./SearchResultCard";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { State } from "../../../state/reducers";
import InfiniteScroll from "./InfiniteScroll";
import CardCropper from "./CardCropper";

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

const COOLING_PERIOD = 500;

const AddNewCard = ({ toaster }: MTGDBProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [text, setText] = useState("");
  const [lastRequest, setLastRequest] = useState(Date.now());
  const [searchResults, setSearchResults] = useState<ScryfallDataType[]>([]);
  const [defaultTag, setDefaultTag] = useState("");
  const [setCodes, setSetCodes] = useState<SetSearchType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>(
    SearchCardFilter.name
  );
  const [selectedSet, setSelectedSet] = useState<SetSearchType>();
  const [isGeneratingMissing, setIsGeneratingMssing] = useState(false);
  const [showMissingDialog, setShowMissingDialog] = useState(false);
  const [missingTxt, setMissingTxt] = useState("");
  const [infiniteData, setInfiniteData] = useState<ScryfallDataType[]>([]);
  const PER_PAGE = 12;
  const [endPage, setEndPage] = useState(PER_PAGE);
  const [showBottomSpinner, setShowBottomSpinner] = useState(false);

  const db = useSelector((state: State) => state.database);

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

  function rootStore(arr: ScryfallDataType[]) {
    setSearchResults(arr);
    setInfiniteData(arr.slice(0, endPage + PER_PAGE));
  }

  const loadMoreCards = () => {
    setShowBottomSpinner(true);

    setTimeout(() => {
      let newEndPage = endPage + PER_PAGE;
      setInfiniteData(searchResults.slice(0, newEndPage));
      setEndPage(newEndPage);
      setShowBottomSpinner(false);
    }, 100);
  };

  interface multiScrySingleReturn {
    output: ScryfallDataType[];
    result: boolean;
  }

  async function multiScrySingle(q: string): Promise<multiScrySingleReturn> {
    let output = [];
    try {
      let res = await axios.get("https://api.scryfall.com/cards/search?q=" + q);
      output = res.data.data.filter(
        (c: ScryfallDataType) => c.name.substring(0, 2) !== "A-"
      );
      return { output: output, result: true };
    } catch (err: any) {
      console.error(err);
      if (err.response.status === 404 || err.response.status === 400) {
        toaster(`No card found for ${q}`, ToasterSeverityEnum.ERROR);
      }
      return { output: output, result: false };
    }
  }

  async function multiScry(arr: string[]): Promise<ScryfallDataType[]> {
    if (Date.now() - lastRequest < COOLING_PERIOD) {
      toaster("Too many requests. Waiting...", ToasterSeverityEnum.ERROR);
      await new Promise((resolve) => setTimeout(resolve, COOLING_PERIOD + 1));
      setLastRequest(Date.now());
    }

    let res: ScryfallDataType[] = [];
    for (let q of arr) {
      let r = await multiScrySingle(q);
      let maxAttempts = 2;
      let startAttempts = 0;
      while (startAttempts < maxAttempts && !r.result) {
        await new Promise((resolve) => setTimeout(resolve, COOLING_PERIOD + 1));
        r = await multiScrySingle(q);
        startAttempts++;
      }
      res = res.concat(r.output);
    }
    return res;
  }

  async function searchCard(queryName: string) {
    setIsSearching(true);
    rootStore([]);
    let queries = [];
    switch (selectedFilter) {
      case "bulk":
        queries = queryName.split("\n").map((q) => {
          if (q.match(/^[0-9]+\s[a-zA-Z\s\\\/,]+$/g)) {
            let qArr = q.split(" ");
            qArr.shift();
            return qArr.join(" ");
          } else {
            return q.trim();
          }
        });
        rootStore(await multiScry(queries));
        setIsSearching(false);
        break;
      case "name":
        queries = queryName.split("+").map((q) => {
          if (q.match(/^[0-9]+\s[a-zA-Z\s\\\/,]+$/g)) {
            let qArr = q.split(" ");
            qArr.shift();
            return qArr.join(" ");
          } else {
            return q.trim();
          }
        });
        rootStore(await multiScry(queries));
        setIsSearching(false);
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
                (c: ScryfallDataType) => c.name.substring(0, 2) !== "A-"
              )
            );
            uri = r.data.next_page;
          }
          rootStore(tmp);
        }
        setIsSearching(false);
        break;
      default:
        break;
    }
  }

  const filters = [
    { slug: SearchCardFilter.name, name: "Card Name" },
    { slug: SearchCardFilter.set_name, name: "Set Name" },
    { slug: "bulk", name: "Buld Entry" },
  ];

  async function generateMissingTxt() {
    let missingCardsTxt: Set<string> = new Set();
    for (let c of searchResults) {
      let exists = await db.cards
        .where("name")
        .equalsIgnoreCase(c.name)
        .first();
      if (!exists) {
        missingCardsTxt.add(`1 ${c.name.split(" // ")[0]}`);
      }
    }
    navigator.clipboard
      .writeText(Array.from(missingCardsTxt).join("\n").substring(0, 99999))
      .then(() => console.log("Copied"))
      .catch((err) =>
        toaster(
          "Sorry, your device settings does not allow me to copy to your clipboard",
          ToasterSeverityEnum.ERROR
        )
      );
    setIsGeneratingMssing(false);
    setMissingTxt(Array.from(missingCardsTxt).join("\n").substring(0, 99999));
    setShowMissingDialog(true);
    toaster("Copied to clipboard!", ToasterSeverityEnum.SUCCESS);
  }

  const BottomSpinner = () => {
    return infiniteData.length === searchResults.length ? (
      <Grid item>
        <Typography>You reached the bottom!</Typography>
      </Grid>
    ) : (
      <CircularProgress />
    );
  };

  function FilterTextFields() {
    switch (selectedFilter) {
      case "name":
        return (
          <TextField
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setText(e.target.value.replace(/[^a-zA-Z0-9\s\+]/g, ""))
            }
            label='Card Name'
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
        );
      case "set_name":
        return (
          <Autocomplete
            options={setCodes}
            onChange={(e, val) =>
              setSelectedSet(val === null ? undefined : val)
            }
            renderInput={(params) => <TextField {...params} label='Set Name' />}
          />
        );
      case "bulk":
        return (
          <TextField
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setText(e.target.value.replace(/[^a-zA-Z0-9\s\+]/g, ""))
            }
            label='Bulk Entry'
            multiline
            maxRows={8}
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
          />
        );
      default:
        return null;
    }
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
        direction='column'
        justifyContent='center'
        alignItems='center'
      >
        <CardCropper setText={(newText: string) => setText(newText)} />

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
                  {FilterTextFields()}
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
                    rootStore([]);
                    setEndPage(PER_PAGE * 2);
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
            <Grid
              container
              direction='row'
              spacing={1}
              justifyContent={"start"}
              alignItems={"stretch"}
              style={{ width: "80vw" }}
            >
              {infiniteData.map((sr: ScryfallDataType, i) => (
                <Grid item xs={6} md={4} lg={3} key={i}>
                  <SearchResultCard
                    sr={sr}
                    defaultTag={defaultTag}
                    toaster={toaster}
                  />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        </Grid>
        {searchResults.length > 0 && <BottomSpinner />}
      </Grid>

      <Dialog
        open={showMissingDialog}
        onClose={() => setShowMissingDialog(false)}
      >
        <DialogTitle>Missing Cards</DialogTitle>
        <TextField
          multiline
          value={missingTxt}
          onFocus={(e: any) => e.target.select()}
        />
      </Dialog>
    </div>
  );
};

export default AddNewCard;
