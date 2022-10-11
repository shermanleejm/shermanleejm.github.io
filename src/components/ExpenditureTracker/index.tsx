import { Alert, Grid, IconButton, Snackbar } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { ToasterSeverityEnum } from '../MTGDB';
import Form from './Form';
import CloseIcon from '@mui/icons-material/Close';
import ExpenditureTable from './ExpenditureTable';
import { useLocation } from 'react-router-dom';
import { changeManifest } from '..';
import BigNumbers from './BigNumbers';
import CustomChart from './CustomChart';
import Toolbar from './Toolbar';
import dayjs from 'dayjs';
import { atom, useAtom } from 'jotai';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';
import { useLiveQuery } from 'dexie-react-hooks';
import { TransactionTypes } from '../../database';

export const monthOffsetAtom = atom(0);

export function getDateRange() {
  const [monthOffset] = useAtom(monthOffsetAtom);
  let payday = Number(window.localStorage.getItem('payday') || '15');
  let lastMonth = dayjs()
    .subtract(1 + monthOffset, 'month')
    .date(payday)
    .unix();
  let currMonth = dayjs().subtract(monthOffset, 'month').date(payday).unix();
  let curr = dayjs().subtract(monthOffset, 'month').unix();

  return {
    startDate: curr < currMonth ? lastMonth : currMonth,
    endDate: curr,
  };
}

export function getDateNumbers() {
  const db = useSelector((state: State) => state.database);
  const [monthOffset] = useAtom(monthOffsetAtom);

  const minDate = useLiveQuery(async () => {
    return (await db.expenditure.orderBy('datetime').last())?.datetime;
  });

  const paydays = useLiveQuery(async () => {
    return (await db.expenditure.where({ txn_type: TransactionTypes.SALARY })).toArray();
  });

  const totalMonths = paydays?.length || 0;

  const startDate = paydays ? paydays[totalMonths - 2 - monthOffset] : minDate;
  const endDate = paydays ? 0 : dayjs().unix();

  return { minDate, totalMonths, paydays };
}

const ExpenditureTracker = () => {
  const location = useLocation();
  const [showToaster, setShowToaster] = useState(false);
  const [toasterSeverity, setToasterSeverity] = useState<ToasterSeverityEnum>(
    ToasterSeverityEnum.SUCCESS
  );
  const [toasterMessage, setToasterMessage] = useState('');

  useEffect(() => {
    changeManifest(location);
  });

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
    <div style={{ marginBottom: '10vh' }}>
      <Snackbar
        open={showToaster}
        autoHideDuration={3000}
        onClose={handleCloseToaster}
        action={toaster}
      >
        <Alert severity={toasterSeverity}>{toasterMessage}</Alert>
      </Snackbar>

      <Grid
        container
        justifyContent={'center'}
        alignItems={'center'}
        direction={'column'}
        spacing={3}
      >
        <Grid item xs={12}>
          <Toolbar />
        </Grid>

        <Grid item>
          <BigNumbers />
        </Grid>
        <Grid item>
          <Form
            toaster={function (m: string, e: ToasterSeverityEnum): void {
              openToaster(m, e);
            }}
          />
        </Grid>
        <Grid item>
          <CustomChart />
        </Grid>
        <Grid item>
          <ExpenditureTable />
        </Grid>
      </Grid>
    </div>
  );
};

export default ExpenditureTracker;
