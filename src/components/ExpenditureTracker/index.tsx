import { Alert, Grid, IconButton, Snackbar, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ToasterSeverityEnum } from '../MTGDB';
import Form from './Form';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';
import dayjs from 'dayjs';
import ExpenditureTable from './ExpenditureTable';
import { useLocation } from 'react-router-dom';
import { changeManifest } from '..';
import { useLiveQuery } from 'dexie-react-hooks';
import { ExpenditureTableType } from '../../database';

const ExpenditureTracker = () => {
  const db = useSelector((state: State) => state.database);
  const location = useLocation();

  const [showToaster, setShowToaster] = useState(false);
  const [toasterSeverity, setToasterSeverity] = useState<ToasterSeverityEnum>(
    ToasterSeverityEnum.SUCCESS
  );
  const [toasterMessage, setToasterMessage] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().startOf('month').unix(),
    endDate: dayjs().unix(),
  });

  useEffect(() => {
    changeManifest(location);
  }, [location]);

  const data = useLiveQuery(async () => {
    return (await db.expenditure.toArray())
      .filter(
        (ex) => ex.datetime >= dateRange.startDate && ex.datetime <= dateRange.endDate
      )
      .reduce(
        (total, { amount, is_credit }) =>
          total + (is_credit ? Number(amount) : Number(amount) * -1),
        0
      );
  }, [dateRange]);

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
    <div style={{ marginBottom: '20px' }}>
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
        <Grid item>
          Available funds{' '}
          <Typography variant="h3" style={{ color: Number(data) < 0 ? 'red' : 'green' }}>
            ${data?.toLocaleString()}
          </Typography>
        </Grid>
        <Grid item>
          <Form
            toaster={function (m: string, e: ToasterSeverityEnum): void {
              openToaster(m, e);
            }}
          />
        </Grid>
        <Grid item>
          <ExpenditureTable />
        </Grid>
      </Grid>
    </div>
  );
};

export default ExpenditureTracker;
