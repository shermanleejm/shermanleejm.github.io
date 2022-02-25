import Brightness7Icon from "@mui/icons-material/Brightness7";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import ParkIcon from "@mui/icons-material/Park";
import LandscapeIcon from "@mui/icons-material/Landscape";
import LooksIcon from "@mui/icons-material/Looks";
import {
  TextField,
  IconButton,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Box,
  InputAdornment,
} from "@mui/material";
import Board from "./Board";
import DeckList from "./DeckList";
import { useEffect, useState } from "react";
import { CardsTableType } from "../../../database";
import { useSelector } from "react-redux";
import { State } from "../../../state/reducers";
import InfoIcon from "@mui/icons-material/Info";
import ClearIcon from "@mui/icons-material/Clear";

enum filterSlug {
  BLACK = "B",
  WHITE = "W",
  GREEN = "G",
  BLUE = "U",
  RED = "R",
  LAND = "land",
  RAINBOW = "rainbow",
  _1 = "1",
  _2 = "2",
  _3 = "3",
  _4 = "4",
  _5 = "5",
  _6 = "6",
  _7 = "7",
  _8 = "8",
  _9 = "9",
  _10 = "10",
}

const defaultFilterState = {
  [filterSlug.WHITE]: false,
  [filterSlug.BLACK]: false,
  [filterSlug.BLUE]: false,
  [filterSlug.GREEN]: false,
  [filterSlug.RED]: false,
  [filterSlug.LAND]: false,
  [filterSlug.RAINBOW]: false,
  [filterSlug._1]: false,
  [filterSlug._2]: false,
  [filterSlug._3]: false,
  [filterSlug._4]: false,
  [filterSlug._5]: false,
  [filterSlug._6]: false,
  [filterSlug._7]: false,
  [filterSlug._8]: false,
  [filterSlug._9]: false,
  [filterSlug._10]: false,
};

const DeckBuilder = () => {
  const [memo, setMemo] = useState<CardsTableType[]>([]);
  const [cardArr, setCardArr] = useState<CardsTableType[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [decklist, setDecklist] = useState<Set<CardsTableType>>(new Set());
  const [colorFilters, setColorFilters] =
    useState<{ [key: string]: boolean }>(defaultFilterState);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const db = useSelector((state: State) => state.database);

  function compare(a: any, b: any, type: keyof CardsTableType | "default") {
    switch (type) {
      case "default":
        if (a["colors"].length < b["colors"].length) return -1;
        if (a["colors"].length > b["colors"].length) return 1;
        if (a["colors"] > b["colors"]) return -1;
        if (a["colors"] < b["colors"]) return 1;
        if (a["cmc"] < b["cmc"]) return -1;
        if (a["cmc"] > b["cmc"]) return 1;
        return 0;
      case "colors":
        if (a[type].length < b[type].length) return -1;
        if (a[type].length > b[type].length) return 1;
        if (a[type] < b[type]) return -1;
        if (a[type] > b[type]) return 1;
        return 0;
      default:
        if (a[type] < b[type]) return -1;
        if (a[type] > b[type]) return 1;
        return 0;
    }
  }

  useEffect(() => {
    async function initialLoad() {
      const arr: CardsTableType[] = await db.cards.toArray();
      setCardArr(arr.sort((a, b) => compare(a, b, "default")));
      setMemo(arr);
    }

    initialLoad();
  }, []);

  function filterCardArrByColor(type: filterSlug) {
    setColorFilters((prev) => {
      let curr = { ...prev, [type]: !prev[type] };
      let filters: string[] = [];
      for (let c in curr) {
        if (curr[c]) filters.push(c);
      }
      setCardArr(
        cardArr
          .filter((c) => filters.some((f) => c.colors.includes(f)))
          .sort((a, b) => compare(a, b, "colors"))
      );
      return curr;
    });
  }

  function filterCardArrByText(text: string) {
    let queries = text.split(",").map((q) => q.toLowerCase());
    setColorFilters({
      [filterSlug.WHITE]: false,
      [filterSlug.BLACK]: false,
      [filterSlug.BLUE]: false,
      [filterSlug.GREEN]: false,
      [filterSlug.RED]: false,
    });
    setCardArr(
      memo
        .filter((c) =>
          queries.every((q) => {
            q = q.toLowerCase();
            if (q.includes(":")) {
              let type = q.split(":")[0].trim();
              let qq = q.split(":")[1].trim();
              if (qq === "tap") {
                qq = "{t}";
              }
              switch (type) {
                case "t":
                  return c.type_line.toLowerCase().includes(qq);
                case "o":
                  return c.oracle_text?.toLowerCase().includes(qq);
                case "s":
                  return c.set_name.toLowerCase().includes(qq);
                default:
                  return false;
              }
            }
            console.log(q);
            return (
              c.name.toLowerCase().includes(q) ||
              c.set_name.toLowerCase().includes(q) ||
              c.oracle_text?.toLowerCase().includes(q) ||
              c.type_line.toLowerCase().includes(q)
            );
          })
        )
        .sort((a, b) => compare(a, b, "default"))
    );
  }

  const colorButtons = [
    {
      icon: (
        <Brightness7Icon
          style={{ color: colorFilters[filterSlug.WHITE] ? "yellow" : "" }}
        />
      ),
      name: filterSlug.WHITE,
    },
    {
      icon: (
        <InvertColorsIcon
          style={{ color: colorFilters[filterSlug.BLUE] ? "blue" : "" }}
        />
      ),
      name: filterSlug.BLUE,
    },
    {
      icon: (
        <SentimentNeutralIcon
          style={{ color: colorFilters[filterSlug.BLACK] ? "grey" : "" }}
        />
      ),
      name: filterSlug.BLACK,
    },
    {
      icon: (
        <WhatshotIcon
          style={{ color: colorFilters[filterSlug.RED] ? "red" : "" }}
        />
      ),
      name: filterSlug.RED,
    },
    {
      icon: (
        <ParkIcon
          style={{ color: colorFilters[filterSlug.GREEN] ? "green" : "" }}
        />
      ),
      name: filterSlug.GREEN,
    },
  ];

  function modifyDecklist(c: CardsTableType, type: "delete" | "add") {
    switch (type) {
      case "delete":
        let tmp1 = decklist;
        tmp1.delete(c);
        setDecklist(tmp1);
        break;
      case "add":
        let tmp2 = [...Array.from(decklist), c].sort((a, b) => {
          if (a.cmc < b.cmc) return -1;
          if (a.cmc > b.cmc) return 1;
          return 0;
        });
        setDecklist(new Set(tmp2));
        break;
      default:
        break;
    }
    setCardArr(cardArr);
  }

  const infoHelper = [
    {
      title: "General",
      explanation: "Searches the whole card text for the word.",
      example: "Goldspan Dragon, Tiamat, Land",
    },
    {
      title: "Card Types",
      explanation: "Use t: in front of the type to search for.",
      example: "t:legendary creature, t:human, t:artifact",
    },
    {
      title: "Set Names",
      explanation: "Use s: in front of the set to search for.",
      example: "s:kamigawa neon dynasty, s:innistrad",
    },
    {
      title: "Card Text (Oracle)",
      explanation: "Use o: in front of the text to search for.",
      example: "o:enters the battlefield, o:tap",
    },
  ];

  const infoDialog = () => {
    return (
      <Dialog open={showInfoDialog} onClose={() => setShowInfoDialog(false)}>
        <DialogTitle>Helpful tips for searching</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText>
                <Typography variant='body1'>
                  Seperate multiple queries with a comma.
                </Typography>
              </ListItemText>
            </ListItem>
            {infoHelper.map((ele) => (
              <ListItem>
                <ListItemText>
                  <Typography variant='body1'>{ele.title}</Typography>
                  <Typography variant='body2'>{ele.explanation}</Typography>

                  <Typography variant='body2' sx={{ fontFamily: "monospace" }}>
                    {ele.example}
                  </Typography>
                </ListItemText>
              </ListItem>
            ))}
            <ListItem>
              <ListItemText>
                <Typography variant='h6'>Deckbuilding tips</Typography>
                <Typography>Ramp: 10-12</Typography>
                <Typography>Card Draw: 10</Typography>
                <Typography>Single Target Removal: 10-12</Typography>
                <Typography>Board Wipes: 3-4</Typography>
                <Typography>Lands: 35-38</Typography>
                <Typography>
                  Standalone (effective by themselves/with commander): 25
                </Typography>
                <Typography>
                  Enhancers (cards that amplify or are amplified by standalones
                  or commander): 10-12
                </Typography>
                <Typography>
                  Enablers (covers a weakness or fills a gap in your strategy):
                  7-8
                </Typography>
                <Typography>Cards on your theme: 30(ish)</Typography>
                <Typography>Considerations:</Typography>
                <Typography>
                  Overlaps (cards that count in multiple categories)
                </Typography>
                <Typography>
                  Partials (cards that count as 'half' in a given category. E.g.
                  scry 3 as half a card draw card)
                </Typography>
              </ListItemText>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Grid
      container
      spacing={1}
      justifyContent={"space-between"}
      alignItems={"flex-start"}
    >
      <Grid item xs={12}>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
        >
          <Grid item>
            <IconButton onClick={() => setShowInfoDialog(true)}>
              <InfoIcon />
            </IconButton>
            {infoDialog()}
          </Grid>

          <Grid item xs={11}>
            <TextField
              style={{ width: "50vw" }}
              label='general search'
              size='small'
              value={searchText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchText(
                  e.target.value.replace(/[^a-zA-Z0-9\s\/\-:,]/g, "")
                )
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter") filterCardArrByText(searchText);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() => {
                        setSearchText("");
                        filterCardArrByText("");
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            ></TextField>
          </Grid>

          <Grid item>
            {colorButtons.map((cb, i) => (
              <IconButton key={i} onClick={() => filterCardArrByColor(cb.name)}>
                {cb.icon}
              </IconButton>
            ))}
            <IconButton
              onClick={() =>
                setCardArr(
                  memo.filter((c) => c.type_line.toLowerCase().includes("land"))
                )
              }
            >
              <LandscapeIcon />
            </IconButton>
            <IconButton
              onClick={() =>
                setCardArr(
                  memo
                    .filter(
                      (c) =>
                        c.colors.length > 1 &&
                        !c.type_line.toLowerCase().includes("land")
                    )
                    .sort((a, b) => compare(a, b, "colors"))
                )
              }
            >
              <LooksIcon />
            </IconButton>
            <Button
              size='small'
              variant='text'
              onClick={() => {
                setCardArr(memo.sort((a, b) => compare(a, b, "default")));
                setSearchText("");
                setColorFilters(defaultFilterState);
              }}
            >
              reset
            </Button>
          </Grid>

          <Grid item>
            {[
              filterSlug._1,
              filterSlug._2,
              filterSlug._3,
              filterSlug._4,
              filterSlug._5,
              filterSlug._6,
              filterSlug._7,
              filterSlug._8,
              filterSlug._9,
              filterSlug._10,
            ].map((n) => (
              <Button
                style={{
                  maxWidth: "30px",
                  maxHeight: "30px",
                  minWidth: "30px",
                  minHeight: "30px",
                }}
                variant={colorFilters[n] ? "contained" : undefined}
                onClick={() => filterCardArrByColor(n)}
              >
                {n}
              </Button>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} lg={9}>
        {cardArr.length === 0 ? (
          <Typography>Sorry, no cards meet this criteria</Typography>
        ) : (
          <Board
            cardArr={cardArr}
            decklist={decklist}
            addToDeckList={(c: CardsTableType) => modifyDecklist(c, "add")}
          />
        )}
      </Grid>
      <Grid item xs={12} lg={3}>
        <DeckList
          cards={decklist}
          deleteFromDeckList={(c: CardsTableType) =>
            modifyDecklist(c, "delete")
          }
        />
      </Grid>
    </Grid>
  );
};

export default DeckBuilder;
