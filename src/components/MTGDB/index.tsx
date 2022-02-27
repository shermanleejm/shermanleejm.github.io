import { Alert, CircularProgress, IconButton, Snackbar, Tab, Tabs } from '@mui/material';
import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CardsTableType, CustomImageUris, MTGDatabase } from '../../database';
import { State } from '../../state/reducers';
import AddNewCard from './AddNewCard';
import CloseIcon from '@mui/icons-material/Close';
import CardDataGrid from './CardDataGrid';
import NetExports from './NetExports';
import DeckBuilder from './DeckBuilder';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { ScryfallDataType } from './interfaces';

export enum ToasterSeverityEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export async function storeCard(
  db: MTGDatabase,
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
    price: price ? parseFloat(price) : parseFloat(card.prices.usd || '0'),
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

  const collision: CardsTableType | undefined = await db.cards
    .where('name')
    .equalsIgnoreCase(card.name)
    .first();

  if (collision === undefined) {
    db.transaction('rw', db.cards, async () => {
      await db.cards.add(newEntry);
    });
  } else {
    db.transaction('rw', db.cards, async () => {
      await db.cards.update(collision.id || 0, newEntry);
    });
  }
}

export type MTGDBProps = {
  toaster: (m: string, e: ToasterSeverityEnum) => void;
};

const MTGDB = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterSeverity, setToasterSeverity] = useState<ToasterSeverityEnum>(
    ToasterSeverityEnum.SUCCESS
  );
  const [toasterMessage, setToasterMessage] = useState('');
  const [chosenTab, setChosenTab] = useState(2);

  const db = useSelector((state: State) => state.database);

  const handleCloseToaster = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowToaster(false);
  };

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
      let dict: Set<string> = new Set();
      for (let i = 0; i < arr.length; i++) {
        let curr = arr[i];
        dict.add(curr.name);
        uSets.add(curr.set_name);
        uTags = new Set([...new Set(curr.tags), ...new Set(Array.from(uTags))]);
      }
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
          toaster={function (m: string, e: ToasterSeverityEnum): void {
            openToaster(m, e);
          }}
        />
      ),
    },
    {
      label: 'Cards Table',
      component: <CardDataGrid />,
    },
    {
      label: 'Deck Builder',
      component: <DeckBuilder />,
    },
    {
      label: 'Import Export',
      component: (
        <NetExports
          toaster={function (m: string, e: ToasterSeverityEnum): void {
            openToaster(m, e);
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ margin: 'auto', width: '90vw', paddingBottom: 40 }}>
      <Tabs
        centered
        variant="fullWidth"
        scrollButtons={true}
        value={chosenTab}
        onChange={(e: React.SyntheticEvent, newValue: number) => {
          setChosenTab(newValue);
          setIsLoading(true);
        }}
        style={{ marginBottom: 20 }}
      >
        {CustomTabs.map((e: CustomTabsType, i) => (
          <Tab key={i} label={e.label} />
        ))}
      </Tabs>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {CustomTabs.map((e: CustomTabsType, i: number) => {
            return (
              <div hidden={chosenTab !== i} key={i + 1}>
                {e.component}
              </div>
            );
          })}
        </>
      )}

      <Snackbar
        open={showToaster}
        autoHideDuration={3000}
        onClose={handleCloseToaster}
        action={toaster}
      >
        <Alert severity={toasterSeverity}>{toasterMessage}</Alert>
      </Snackbar>

      <IconButton
        size="large"
        style={{ position: 'fixed', right: 20, bottom: 20 }}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <ArrowCircleUpIcon style={{ transform: 'scale(1.8)' }} />
      </IconButton>
    </div>
  );
};

export default MTGDB;
