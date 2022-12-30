import { Alert, Grid, IconButton, Snackbar } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { ToasterSeverityEnum } from '@/components/MTGDB';
import Form from './Form';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from 'react-router-dom';
import { changeManifest } from '@/components';
import BigNumbers from './BigNumbers';
import dayjs from 'dayjs';
import { atom, useAtom } from 'jotai';
import { useSelector } from 'react-redux';
import { State } from '@/state/reducers';
import { useLiveQuery } from 'dexie-react-hooks';
import { TransactionTypes } from '@/database';

export const monthOffsetAtom = atom(0);

export function getDateNumbers() {
  const db = useSelector((state: State) => state.database);
  const [monthOffset] = useAtom(monthOffsetAtom);

  const minDate =
    useLiveQuery(async () => {
      return (await db.expenditure.orderBy('datetime').last())?.datetime;
    }) ?? 0;

  const paydays =
    useLiveQuery(async () => {
      return (
        await db.expenditure.where({ txn_type: TransactionTypes.SALARY })
      ).toArray();
    }) ?? [];

  const totalMonths = paydays.length || 0;
  const startDate = paydays[totalMonths - monthOffset - 1]?.datetime ?? minDate;
  const endDate =
    monthOffset === 0 ? dayjs().unix() : paydays[totalMonths - monthOffset]?.datetime;

  return { minDate, totalMonths, paydays, startDate, endDate };
}

export default () => {
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
    <div>
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
        spacing={2}
      >
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
      </Grid>
    </div>
  );
};
