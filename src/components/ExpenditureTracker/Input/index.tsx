import { Grid } from '@mui/material';
import { useEffect } from 'react';
import Form from './Form';
import { useLocation } from 'react-router-dom';
import { changeManifest } from '@/components';
import BigNumbers from './BigNumbers';
import dayjs from 'dayjs';
import { atom, useAtom } from 'jotai';
import { useSelector } from 'react-redux';
import { State } from '@/state/reducers';
import { useLiveQuery } from 'dexie-react-hooks';
import { TransactionTypes } from '@/database';
import ExpenditureTable from '@/components/ExpenditureTracker/Insights/ExpenditureTable';

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
  // const today = dayjs().subtract(totalMonths - monthOffset, 'month');
  // const startDate = today.startOf('month').unix();
  // const endDate = today.endOf('month').unix();

  return { minDate, totalMonths, paydays, startDate, endDate };
}

export default () => {
  const location = useLocation();

  useEffect(() => {
    changeManifest(location);
  });

  return (
    <div>
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
          <Form />
        </Grid>
      </Grid>
    </div>
  );
};
