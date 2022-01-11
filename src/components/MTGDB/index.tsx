import { Alert, IconButton, Snackbar } from '@mui/material';
import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CardsTableType, MTGDatabase } from '../../database';
import { State } from '../../state/reducers';
import AddNewCard from './AddNewCard';
import CloseIcon from '@mui/icons-material/Close';
import Display from './Display';

export enum ToasterSeverityEnum {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type MTGDBProps = {
  refresh: (e: boolean) => void;
  toaster: (m: string, e: ToasterSeverityEnum) => void;
  db: MTGDatabase;
  cardDict: { [key: string]: boolean };
  cardArr: CardsTableType[];
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
      const array = await db.cards.toArray();
      let dict: { [key: string]: boolean } = {};
      for (let i = 0; i < array.length; i++) {
        dict[array[i].name] = true;
      }
      setCardDict(dict);
      setCardArr(array);
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

  return (
    <div>
      <AddNewCard
        refresh={(e: boolean) => setIsLoading(e)}
        db={db}
        cardDict={cardDict}
        cardArr={cardArr}
        toaster={function (m: string, e: ToasterSeverityEnum): void {
          openToaster(m, e);
        }}
      />

      <Display
        refresh={(e: boolean) => setIsLoading(e)}
        db={db}
        cardDict={cardDict}
        cardArr={cardArr}
        toaster={function (m: string, e: ToasterSeverityEnum): void {
          openToaster(m, e);
        }}
      />

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
