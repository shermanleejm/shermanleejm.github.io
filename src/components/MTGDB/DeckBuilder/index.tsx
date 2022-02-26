import Brightness7Icon from '@mui/icons-material/Brightness7';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import ParkIcon from '@mui/icons-material/Park';
import LandscapeIcon from '@mui/icons-material/Landscape';
import LooksIcon from '@mui/icons-material/Looks';
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
} from '@mui/material';
import Board from './Board';
import DeckList from './DeckList';
import { useEffect, useState } from 'react';
import { CardsTableType } from '../../../database';
import { useSelector } from 'react-redux';
import { State } from '../../../state/reducers';
import InfoIcon from '@mui/icons-material/Info';
import ClearIcon from '@mui/icons-material/Clear';

enum colorSlug {
  BLACK = 'B',
  WHITE = 'W',
  GREEN = 'G',
  BLUE = 'U',
  RED = 'R',
}

enum numberSlug {
  _1 = '1',
  _2 = '2',
  _3 = '3',
  _4 = '4',
  _5 = '5',
  _6 = '6',
  _7 = '7',
  _8 = '8',
  _9 = '9',
  _10 = '10',
}

enum miscSlug {
  LAND = 'land',
  RAINBOW = 'rainbow',
}

type combinedSlug = miscSlug | colorSlug | numberSlug;

const defaultFilterState = {
  [colorSlug.WHITE]: false,
  [colorSlug.BLACK]: false,
  [colorSlug.BLUE]: false,
  [colorSlug.GREEN]: false,
  [colorSlug.RED]: false,
  [miscSlug.LAND]: false,
  [miscSlug.RAINBOW]: false,
  [numberSlug._1]: false,
  [numberSlug._2]: false,
  [numberSlug._3]: false,
  [numberSlug._4]: false,
  [numberSlug._5]: false,
  [numberSlug._6]: false,
  [numberSlug._7]: false,
  [numberSlug._8]: false,
  [numberSlug._9]: false,
  [numberSlug._10]: false,
};

const DeckBuilder = () => {
  const [memo, setMemo] = useState<CardsTableType[]>([]);
  const [cardArr, setCardArr] = useState<CardsTableType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [decklist, setDecklist] = useState<Set<CardsTableType>>(new Set());
  const [colorFilters, setColorFilters] =
    useState<{ [key in combinedSlug]: boolean }>(defaultFilterState);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const db = useSelector((state: State) => state.database);

  function compare(a: any, b: any, type: keyof CardsTableType | 'default') {
    switch (type) {
      case 'default':
        if (a['colors'].length < b['colors'].length) return -1;
        if (a['colors'].length > b['colors'].length) return 1;
        if (a['colors'] > b['colors']) return -1;
        if (a['colors'] < b['colors']) return 1;
        if (a['cmc'] < b['cmc']) return -1;
        if (a['cmc'] > b['cmc']) return 1;
        return 0;
      case 'colors':
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
      setCardArr(arr.sort((a, b) => compare(a, b, 'default')));
      setMemo(arr);
    }

    initialLoad();
  }, []);

  function filterCardArr(type?: combinedSlug) {
    setColorFilters((prev) => {
      let queries = searchText.split(',').map((q) => q.toLowerCase());
      let numberFilters: number[] = [];
      let colorFilters: string[] = [];
      let miscFilters: string[] = [];
      let curr: any = { ...prev };

      if (type !== undefined) {
        curr = { ...prev, [type]: !prev[type] };
        for (let c in curr) {
          if (curr[c]) {
            if (Number.isInteger(parseInt(c))) {
              numberFilters.push(parseInt(c));
            } else if (c !== miscSlug.LAND && c !== miscSlug.RAINBOW) {
              colorFilters.push(c);
            } else {
              miscFilters.push(c);
            }
          }
        }
      }

      setCardArr(
        memo
          .filter((c) => {
            if (colorFilters.length > 0) {
              return colorFilters.some((f) => c.colors.includes(f));
            }
            return true;
          })
          .filter((c) => {
            if (numberFilters.length > 0) {
              return numberFilters.some((f) => c.cmc === f);
            }
            return true;
          })
          .filter((c) => {
            if (queries.length > 0) {
              return queries.every((q) => {
                q = q.toLowerCase();
                if (q.includes(':')) {
                  let type = q.split(':')[0].trim();
                  let qq = q.split(':')[1].trim();
                  if (qq === 'tap') {
                    qq = '{t}';
                  }
                  switch (type) {
                    case 't':
                      return c.type_line.toLowerCase().includes(qq);
                    case 'o':
                      return c.oracle_text?.toLowerCase().includes(qq);
                    case 's':
                      return c.set_name.toLowerCase().includes(qq);
                    default:
                      return false;
                  }
                }
                return (
                  c.name.toLowerCase().includes(q) ||
                  c.set_name.toLowerCase().includes(q) ||
                  c.oracle_text?.toLowerCase().includes(q) ||
                  c.type_line.toLowerCase().includes(q)
                );
              });
            }
            return true;
          })
          .sort((a, b) => compare(a, b, 'colors'))
      );
      return curr;
    });
  }

  const colorButtons = [
    {
      icon: (
        <Brightness7Icon
          style={{ color: colorFilters[colorSlug.WHITE] ? 'yellow' : '' }}
        />
      ),
      name: colorSlug.WHITE,
    },
    {
      icon: (
        <InvertColorsIcon style={{ color: colorFilters[colorSlug.BLUE] ? 'blue' : '' }} />
      ),
      name: colorSlug.BLUE,
    },
    {
      icon: (
        <SentimentNeutralIcon
          style={{ color: colorFilters[colorSlug.BLACK] ? 'grey' : '' }}
        />
      ),
      name: colorSlug.BLACK,
    },
    {
      icon: <WhatshotIcon style={{ color: colorFilters[colorSlug.RED] ? 'red' : '' }} />,
      name: colorSlug.RED,
    },
    {
      icon: <ParkIcon style={{ color: colorFilters[colorSlug.GREEN] ? 'green' : '' }} />,
      name: colorSlug.GREEN,
    },
  ];

  function modifyDecklist(c: CardsTableType, type: 'delete' | 'add') {
    switch (type) {
      case 'delete':
        let tmp1 = decklist;
        tmp1.delete(c);
        setDecklist(tmp1);
        break;
      case 'add':
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
      title: 'General',
      explanation: 'Searches the whole card text for the word.',
      example: 'Goldspan Dragon, Tiamat, Land',
    },
    {
      title: 'Card Types',
      explanation: 'Use t: in front of the type to search for.',
      example: 't:legendary creature, t:human, t:artifact',
    },
    {
      title: 'Set Names',
      explanation: 'Use s: in front of the set to search for.',
      example: 's:kamigawa neon dynasty, s:innistrad',
    },
    {
      title: 'Card Text (Oracle)',
      explanation: 'Use o: in front of the text to search for.',
      example: 'o:enters the battlefield, o:tap',
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
                <Typography variant="body1">
                  Seperate multiple queries with a comma.
                </Typography>
              </ListItemText>
            </ListItem>
            {infoHelper.map((ele) => (
              <ListItem>
                <ListItemText>
                  <Typography variant="body1">{ele.title}</Typography>
                  <Typography variant="body2">{ele.explanation}</Typography>

                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {ele.example}
                  </Typography>
                </ListItemText>
              </ListItem>
            ))}
            <ListItem>
              <ListItemText>
                <Typography variant="h6">Deckbuilding tips</Typography>
                <Typography>Ramp: 10-12</Typography>
                <Typography>Card Draw: 10</Typography>
                <Typography>Single Target Removal: 10-12</Typography>
                <Typography>Board Wipes: 3-4</Typography>
                <Typography>Lands: 35-38</Typography>
                <Typography>
                  Standalone (effective by themselves/with commander): 25
                </Typography>
                <Typography>
                  Enhancers (cards that amplify or are amplified by standalones or
                  commander): 10-12
                </Typography>
                <Typography>
                  Enablers (covers a weakness or fills a gap in your strategy): 7-8
                </Typography>
                <Typography>Cards on your theme: 30(ish)</Typography>
                <Typography>Considerations:</Typography>
                <Typography>
                  Overlaps (cards that count in multiple categories)
                </Typography>
                <Typography>
                  Partials (cards that count as 'half' in a given category. E.g. scry 3 as
                  half a card draw card)
                </Typography>
              </ListItemText>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div>
      <Grid container spacing={1} justifyContent={'center'} alignItems={'center'}>
        <Grid item>
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={1}>
              <IconButton onClick={() => setShowInfoDialog(true)}>
                <InfoIcon />
              </IconButton>
            </Grid>

            <Grid item xs={10} style={{ paddingLeft: 20 }}>
              <TextField
                // style={{ width: "50vw" }}
                label="general search"
                size="small"
                value={searchText}
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchText(e.target.value.replace(/[^a-zA-Z0-9\s\/\-:,]/g, ''))
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === 'Enter') filterCardArr();
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => {
                          setCardArr(memo.sort((a, b) => compare(a, b, 'default')));
                          setSearchText('');
                          setColorFilters(defaultFilterState);
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
                <IconButton key={i} onClick={() => filterCardArr(cb.name)}>
                  {cb.icon}
                </IconButton>
              ))}
              <IconButton
                onClick={() =>
                  setCardArr(
                    memo.filter((c) => c.type_line.toLowerCase().includes('land'))
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
                          !c.type_line.toLowerCase().includes('land')
                      )
                      .sort((a, b) => compare(a, b, 'colors'))
                  )
                }
              >
                <LooksIcon />
              </IconButton>
              <Button
                size="small"
                variant="text"
                onClick={() => {
                  setCardArr(memo.sort((a, b) => compare(a, b, 'default')));
                  setSearchText('');
                  setColorFilters(defaultFilterState);
                }}
              >
                reset
              </Button>
            </Grid>

            <Grid item>
              {[
                numberSlug._1,
                numberSlug._2,
                numberSlug._3,
                numberSlug._4,
                numberSlug._5,
                numberSlug._6,
                numberSlug._7,
                numberSlug._8,
                numberSlug._9,
                numberSlug._10,
              ].map((n) => (
                <Button
                  style={{
                    maxWidth: '30px',
                    maxHeight: '30px',
                    minWidth: '30px',
                    minHeight: '30px',
                  }}
                  variant={colorFilters[n] ? 'contained' : undefined}
                  onClick={() => filterCardArr(n)}
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
              addToDeckList={(c: CardsTableType) => modifyDecklist(c, 'add')}
            />
          )}
        </Grid>
        <Grid item xs={12} lg={3}>
          <DeckList
            cards={decklist}
            deleteFromDeckList={(c: CardsTableType) => modifyDecklist(c, 'delete')}
          />
        </Grid>
      </Grid>
      {infoDialog()}
    </div>
  );
};

export default DeckBuilder;
