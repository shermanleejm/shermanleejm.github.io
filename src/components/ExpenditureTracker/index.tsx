import {
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Snackbar,
  TextField,
} from '@mui/material';
import React, { ChangeEvent, useEffect } from 'react';
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
import { KeyItem, KeyItemTitle } from './KeyItem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { stringify } from 'querystring';

const ExpenditureTracker = () => {
  const db = useSelector((state: State) => state.database);
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterSeverity, setToasterSeverity] = useState<ToasterSeverityEnum>(
    ToasterSeverityEnum.SUCCESS
  );
  const [toasterMessage, setToasterMessage] = useState('');
  const [payday, setPayday] = useState(25);
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(1, 'months').date(payday).unix(),
    endDate: dayjs().unix(),
  });
  const [showEditPayday, setShowEditPayday] = useState(false);

  useEffect(() => {
    function getPayday() {
      let payday = Number(window.localStorage.getItem('payday') || '15');
      setPayday(payday);
    }
    function monitorLocalStorage() {
      window.addEventListener('storage', () => {
        getPayday();
      });
    }
    changeManifest(location);
    getPayday();
    monitorLocalStorage();
  }, [location]);

  const data = useLiveQuery(async () => {
    let currentMonth = (await db.expenditure.toArray())
      .filter(
        (ex) => ex.datetime >= dateRange.startDate && ex.datetime <= dateRange.endDate
      )
      .reduce(
        (total, { amount, is_credit }) =>
          total + (is_credit ? Number(amount) : Number(amount) * -1),
        0
      );

    let total = (await db.expenditure.toArray()).reduce(
      (total, { amount, is_credit }) =>
        total + (is_credit ? Number(amount) : Number(amount) * -1),
      0
    );

    return { currentMonth: currentMonth, total: total };
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
          <Grid container gap={6}>
            <Grid item>
              <KeyItem
                value={`$${data?.currentMonth.toLocaleString()}`}
                title={'Available funds'}
                color={Number(data?.currentMonth.toLocaleString()) < 0 ? 'red' : 'green'}
              />
            </Grid>
            <Grid item>
              <div>
                {showEditPayday ? (
                  <>
                    <KeyItemTitle title="Pay day" />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <TextField
                        size="small"
                        sx={{ width: 50 }}
                        value={payday}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setPayday(
                            Math.min(Number(e.target.value.replace(/\D/g, '')), 31)
                          )
                        }
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          setShowEditPayday(false);
                          window.localStorage.setItem('payday', payday.toString());
                          setIsLoading(true);
                        }}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </div>
                  </>
                ) : (
                  <div onClick={() => setShowEditPayday(true)}>
                    <KeyItem value={String(payday)} title={'Pay day'} color="orange" />
                  </div>
                )}
              </div>
            </Grid>
            {/* <Grid item>
              <KeyItems
                value={`$${data?.total.toLocaleString()}`}
                title={'Total savings'}
                color={Number(data?.total.toLocaleString()) < 0 ? 'red' : 'green'}
              />
            </Grid> */}
          </Grid>
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
