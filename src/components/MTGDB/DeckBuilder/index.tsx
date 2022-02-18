import Brightness7Icon from '@mui/icons-material/Brightness7';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import ParkIcon from '@mui/icons-material/Park';
import LandscapeIcon from '@mui/icons-material/Landscape';
import LooksIcon from '@mui/icons-material/Looks';
import { TextField, IconButton, Grid, Typography, Button } from '@mui/material';
import Board from './Board';
import DeckList from './DeckList';
import { useEffect, useState } from 'react';
import { CardsTableType } from '../../../database';
import { useSelector } from 'react-redux';
import { State } from '../../../state/reducers';

const DeckBuilder = () => {
  const [memo, setMemo] = useState<CardsTableType[]>([]);
  const [cardArr, setCardArr] = useState<CardsTableType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [decklist, setDecklist] = useState<Set<CardsTableType>>(new Set());

  const db = useSelector((state: State) => state.database);

  function compare(a: any, b: any, type: keyof CardsTableType) {
    if (a[type] < b[type]) return -1;
    if (a[type] > b[type]) return 1;
    return 0;
  }

  useEffect(() => {
    async function initialLoad() {
      const arr: CardsTableType[] = await db.cards.toArray();
      setCardArr(arr.sort((a, b) => compare(a, b, 'name')));
      setMemo(arr.sort((a, b) => compare(a, b, 'name')));
    }

    initialLoad();
  }, []);

  enum colorSlug {
    BLACK = 'B',
    WHITE = 'W',
    GREEN = 'G',
    BLUE = 'U',
    RED = 'R',
  }

  function filterCardArrByColor(type: colorSlug) {
    let tmp = memo
      .filter((c) => c.colors.length === 1 && c.colors.includes(type))
      .sort((a, b) => compare(a, b, 'cmc'));
    setCardArr(tmp);
  }

  function filterCardArrByText(text: string) {
    setCardArr(
      memo
        .filter(
          (c) =>
            c.name.toLowerCase().includes(text.toLowerCase()) ||
            c.type_line.toLowerCase().includes(text.toLowerCase()) ||
            c.set_name.toLowerCase().includes(text.toLowerCase()) ||
            c.oracle_text?.toLowerCase().includes(text.toLowerCase())
        )
        .sort((a, b) => compare(a, b, 'cmc'))
        .sort((a, b) => compare(a, b, 'colors'))
    );
  }

  const colorButtons = [
    { icon: <Brightness7Icon />, name: colorSlug.WHITE },
    { icon: <InvertColorsIcon />, name: colorSlug.BLUE },
    { icon: <SentimentNeutralIcon />, name: colorSlug.BLACK },
    { icon: <WhatshotIcon />, name: colorSlug.RED },
    { icon: <ParkIcon />, name: colorSlug.GREEN },
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

  return (
    <Grid
      container
      spacing={1}
      justifyContent={'space-between'}
      alignItems={'flex-start'}
    >
      <Grid item xs={12}>
        <Grid container direction={'row'} justifyContent={'center'}>
          <Grid item>
            <TextField
              style={{ width: '50vw' }}
              label="general search"
              size="small"
              value={searchText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchText(e.target.value.replace(/[^a-zA-Z0-9\s\/\-]/g, ''))
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter') filterCardArrByText(searchText);
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
                setCardArr(memo.filter((c) => c.type_line.toLowerCase().includes('land')))
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
                        c.colors.length > 1 && !c.type_line.toLowerCase().includes('land')
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
                setCardArr(memo);
                setSearchText('');
              }}
            >
              reset
            </Button>
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
  );
};

export default DeckBuilder;
