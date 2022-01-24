import Brightness7Icon from '@mui/icons-material/Brightness7';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import ParkIcon from '@mui/icons-material/Park';
import { TextField, IconButton, Grid, Typography } from '@mui/material';
import { MTGDBProps } from '..';
import Board from './Board';
import { useEffect, useState } from 'react';
import { CardsTableType } from '../../../database';

const DeckBuilder = (props: MTGDBProps) => {
  const [cardArr, setCardArr] = useState<CardsTableType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  function compare(a: any, b: any, type: keyof CardsTableType) {
    if (a[type] < b[type]) return -1;
    if (a[type] > b[type]) return 1;
    return 0;
  }

  useEffect(() => {
    function initialLoad() {
      setCardArr(props.cardArr.sort((a, b) => compare(a, b, 'cmc')));
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
    let tmp = props.cardArr
      .filter((c) => c.colors.length === 1 && c.colors.includes(type))
      .sort((a, b) => compare(a, b, 'cmc'));
    setCardArr(tmp);
  }

  function filterCardArrByText(text: string) {
    setCardArr(
      props.cardArr
        .filter(
          (c) =>
            c.name.toLowerCase().includes(text.toLowerCase()) ||
            c.type_line.toLowerCase().includes(text.toLowerCase())
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

  return (
    <Grid container direction={'column'} justifyContent={'center'} alignItems={'center'}>
      <Grid item>
        <Grid container direction={'row'}>
          <Grid item>
            <TextField
              style={{ width: '50vw' }}
              label="general search"
              size="small"
              value={searchText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchText(e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter') filterCardArrByText(searchText);
              }}
            ></TextField>
          </Grid>
          <Grid item>
            {colorButtons.map((cb) => (
              <IconButton onClick={() => filterCardArrByColor(cb.name)}>
                {cb.icon}
              </IconButton>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        {cardArr.length === 0 ? (
          <Typography>Sorry, no cards meet this criteria</Typography>
        ) : (
          <Board cardArr={cardArr} />
        )}
      </Grid>
    </Grid>
  );
};

export default DeckBuilder;
