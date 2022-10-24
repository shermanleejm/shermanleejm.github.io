import { Grid } from '@mui/material';
import { KeyItem } from './KeyItem';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';
import { getDateNumbers } from '.';
import { negativeTypes, positiveTypes, TransactionTypes } from '../../database';
import dayjs from 'dayjs';

const BigNumbers = () => {
  const db = useSelector((state: State) => state.database);
  const { startDate, endDate } = getDateNumbers();

  const data = useLiveQuery(async () => {
    const wholeEx = await db.expenditure.toArray();
    const currentMonth = wholeEx.filter(
      (ex) => ex.datetime >= startDate && ex.datetime < endDate
    );

    let saving = currentMonth.reduce(
      (prev, next) =>
        prev + Number(next.amount) * (positiveTypes.includes(next.txn_type) ? 1 : -1),
      0
    );

    let spending = currentMonth
      .filter((ex) => negativeTypes.includes(ex.txn_type))
      .reduce((prev, next) => prev + Number(next.amount), 0);

    let total = wholeEx.reduce(
      (total, { amount, txn_type }) =>
        total +
        ([TransactionTypes.CREDIT, TransactionTypes.RECURRING].includes(txn_type)
          ? Number(amount) * -1
          : Number(amount)),
      0
    );

    return {
      total: total,
      spending: spending,
      saving: saving,
    };
  }, [startDate, endDate]);

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
          <KeyItem
            value={dayjs.unix(startDate).format('DD MMM')}
            title={'Pay day'}
            color="orange"
          />
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
