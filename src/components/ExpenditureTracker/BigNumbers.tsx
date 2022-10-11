import { ChangeEvent, useState, useEffect } from 'react';
import { Grid, IconButton, TextField } from '@mui/material';
import { KeyItem, KeyItemTitle } from './KeyItem';
import { useLiveQuery } from 'dexie-react-hooks';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';
import { getDateRange, monthOffsetAtom } from '.';
import { useAtom } from 'jotai';
import { TransactionTypes } from '../../database';

const BigNumbers = () => {
  const db = useSelector((state: State) => state.database);
  const [monthOffset] = useAtom(monthOffsetAtom);
  const originalDateRange = getDateRange();

  const [showEditPayday, setShowEditPayday] = useState(false);
  const [payday, setPayday] = useState(25);
  const [dateRange, setDateRange] = useState(originalDateRange);
  const [isLoading, setIsLoading] = useState(false);

  function recordPayday() {
    setShowEditPayday(false);
    window.localStorage.setItem('payday', payday.toString());
    setIsLoading(true);
  }

  useEffect(() => {
    function getPayday() {
      let payday = Number(window.localStorage.getItem('payday') || '15');
      setPayday(payday);
      setDateRange(originalDateRange);
    }
    function monitorLocalStorage() {
      window.addEventListener('storage', () => {
        getPayday();
      });
    }
    getPayday();
    monitorLocalStorage();
  }, [isLoading, monthOffset]);

  const data = useLiveQuery(async () => {
    let saving = (await db.expenditure.toArray())
      .filter(
        (ex) => ex.datetime >= dateRange.startDate && ex.datetime <= dateRange.endDate
      )
      .reduce(
        (total, { amount, txn_type }) =>
          total +
          ([TransactionTypes.CREDIT, TransactionTypes.RECURRING].includes(txn_type)
            ? Number(amount) * -1
            : Number(amount)),
        0
      );

    let total = (await db.expenditure.toArray()).reduce(
      (total, { amount, txn_type }) =>
        total +
        ([TransactionTypes.CREDIT, TransactionTypes.RECURRING].includes(txn_type)
          ? Number(amount) * -1
          : Number(amount)),
      0
    );

    let spending = (await db.expenditure.toArray())
      .filter(
        (x) => x.txn_type === TransactionTypes.CREDIT && x.datetime >= dateRange.startDate
      )
      .map((item) => item.amount)
      .reduce((prev, next) => Number(prev) + Number(next), 0);

    return {
      total: total,
      spending: spending,
      saving: saving,
    };
  }, [dateRange]);

  return (
    <div>
      <Grid
        container
        justifyContent={'center'}
        alignItems={'center'}
        direction={'row'}
        style={{ textAlign: 'center' }}
        spacing={2}
      >
        <Grid item xs={6} md={3}>
          <KeyItem
            value={`$${data?.total.toLocaleString()}`}
            title={'Total funds'}
            color={Number(data?.total.toLocaleString()) < 0 ? 'red' : 'green'}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <div>
            {showEditPayday ? (
              <>
                <KeyItemTitle title="Pay day" />
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <TextField
                    size="small"
                    // sx={{ width: 50 }}
                    value={payday}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPayday(Math.min(Number(e.target.value.replace(/\D/g, '')), 31))
                    }
                    onBlur={() => recordPayday()}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') {
                        recordPayday();
                      }
                    }}
                  />
                  <IconButton size="small" onClick={() => recordPayday()}>
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
        <Grid item xs={6} md={3}>
          <KeyItem
            title="Monthly Spend"
            value={`$${data?.spending.toLocaleString()}` || '$0'}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <KeyItem
            title="Monthly Save"
            value={`$${data?.saving.toLocaleString()}` || '$0'}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default BigNumbers;
