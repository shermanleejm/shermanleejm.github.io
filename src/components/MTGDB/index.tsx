import {
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Snackbar,
  Tab,
  Tabs,
} from '@mui/material';
import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CardsTableType, MTGDatabase } from '../../database';
import { State } from '../../state/reducers';
import AddNewCard from './AddNewCard';
import CloseIcon from '@mui/icons-material/Close';
import Display from './Display';
import NetExports from './NetExports';
import DeckBuilder from './DeckBuilder';

export enum ToasterSeverityEnum {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type MTGDBProps = {
  refresh: (e: boolean) => void;
  toaster: (m: string, e: ToasterSeverityEnum) => void;
  db: MTGDatabase;
  cardArr: CardsTableType[];
  filterCard?: (k: string, val: string) => void;
  cardDict?: { [key: string]: boolean };
  uniqueSets?: string[];
  uniqueTags?: string[];
};

const MTGDB = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cardDict, setCardDict] = useState<{ [key: string]: boolean }>({});
  const [cardArr, setCardArr] = useState<CardsTableType[]>([]);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterSeverity, setToasterSeverity] = useState<ToasterSeverityEnum>(
    ToasterSeverityEnum.SUCCESS
  );
  const [toasterMessage, setToasterMessage] = useState('');
  const [uniqueTags, setUniqueTags] = useState<string[]>();
  const [uniqueSets, setUniqueSets] = useState<string[]>();
  const [chosenTab, setChosenTab] = useState(2);

  const db = useSelector((state: State) => state.database);

  const handleCloseToaster = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToaster(false);
  };

  function filterCardArr(k: string, val: string) {
    switch (k) {
      case 'tags':
        setCardArr(cardArr.filter((c) => new Set(c[k]).has(val)));
        console.log(cardArr.filter((c) => new Set(c[k]).has(val)));
        break;
      case 'set_name':
        setCardArr(cardArr.filter((c) => c[k] === val));
        break;
      default:
        setIsLoading(true);
        break;
    }
  }

  function openToaster(message: string, severity: ToasterSeverityEnum) {
    setToasterMessage(message);
    setToasterSeverity(severity);
    setShowToaster(true);
  }

  useEffect(() => {
    async function getAllCards() {
      const arr = await db.cards.toArray();
      let uTags = new Set<string>();
      let uSets = new Set<string>();
      let dict: { [key: string]: boolean } = {};
      for (let i = 0; i < arr.length; i++) {
        let curr = arr[i];
        dict[curr.name] = true;
        uSets.add(curr.set_name);
        uTags = new Set([...new Set(curr.tags), ...new Set(Array.from(uTags))]);
      }
      setUniqueSets(Array.from(uSets));
      setUniqueTags(Array.from(uTags));
      setCardDict(dict);
      setCardArr(arr);
      setIsLoading(false);
    }

    getAllCards();
  }, [db.cards, isLoading]);

  const toaster = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseToaster}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  type CustomTabsType = {
    label: string;
    component: JSX.Element;
  };
  const CustomTabs: CustomTabsType[] = [
    {
      label: 'Add Card',
      component: (
        <AddNewCard
          refresh={(e: boolean) => setIsLoading(e)}
          db={db}
          cardDict={cardDict}
          cardArr={cardArr}
          toaster={function (m: string, e: ToasterSeverityEnum): void {
            openToaster(m, e);
          }}
        />
      ),
    },
    {
      label: 'Cards Table',
      component: (
        <Display
          refresh={(e: boolean) => setIsLoading(e)}
          db={db}
          cardArr={cardArr}
          toaster={function (m: string, e: ToasterSeverityEnum): void {
            openToaster(m, e);
          }}
          uniqueSets={uniqueSets}
          uniqueTags={uniqueTags}
          filterCard={function (k: string, v: string): void {
            filterCardArr(k, v);
          }}
        />
      ),
    },
    {
      label: 'Deck Builder',
      component: (
        <DeckBuilder
          refresh={(e: boolean) => setIsLoading(e)}
          db={db}
          cardArr={cardArr}
          toaster={function (m: string, e: ToasterSeverityEnum): void {
            openToaster(m, e);
          }}
        />
      ),
    },
    {
      label: 'Import/Export',
      component: (
        <NetExports
          db={db}
          refresh={(e: boolean) => setIsLoading(e)}
          cardArr={cardArr}
          toaster={function (m: string, e: ToasterSeverityEnum): void {
            openToaster(m, e);
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <Grid
        container
        direction={'column'}
        spacing={4}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Grid item>
          <Tabs
            value={chosenTab}
            onChange={(e: React.SyntheticEvent, newValue: number) => {
              setChosenTab(newValue);
              setIsLoading(true);
            }}
          >
            {CustomTabs.map((e: CustomTabsType) => (
              <Tab label={e.label} />
            ))}
          </Tabs>
        </Grid>

        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            {CustomTabs.map((e: CustomTabsType, i: number) => {
              return (
                <Grid item hidden={chosenTab !== i}>
                  {e.component}
                </Grid>
              );
            })}
          </>
        )}
      </Grid>

      <Snackbar
        open={showToaster}
        autoHideDuration={3000}
        onClose={handleCloseToaster}
        action={toaster}
      >
        <Alert severity={toasterSeverity}>{toasterMessage}</Alert>
      </Snackbar>
    </div>
  );
};

export default MTGDB;
