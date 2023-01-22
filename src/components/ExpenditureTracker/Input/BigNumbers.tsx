import { Grid } from '@mui/material';
import { KeyItem } from './KeyItem';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSelector } from 'react-redux';
import { State } from '@/state/reducers';
import { getDateNumbers } from '.';
import {
  ExpenditureTableType,
  negativeTypes,
  positiveTypes,
  RecurringTableType,
  TransactionTypes,
} from '@/database';
import dayjs, { Dayjs } from 'dayjs';
import { RecurrenceTypes } from '@/components/ExpenditureTracker/Input/Form';
import { max } from 'lodash';
import { atomWithStorage } from 'jotai/utils';
import { useAtom } from 'jotai';
import {
  calculatePortfolioValue,
  totalPortfolioValue,
} from '@/components/AssetTracker/BoringTracker/hooks';

const showBigNumbersAtom = atomWithStorage('showBigNumbers', false);

function addToAddition(
  addition: (ExpenditureTableType & { recurringId?: number })[],
  re: RecurringTableType,
  pointer: Dayjs
) {
  addition.push({
    category: re.category,
    name: re.name,
    amount: re.amount,
    txn_type: TransactionTypes.RECURRING,
    datetime: pointer.unix(),
    recurringId: re.id,
  });
  return addition;
}

export function calculateRecurring(
  array: RecurringTableType[],
  startDate: number,
  endDate: number
) {
  return array.reduce((acc, re) => {
    if (endDate < re.start) return acc;

    let reType = re.cron.split(' ')[0] as RecurrenceTypes;
    let reVal = re.cron.split(' ')[1];
    let addition: (ExpenditureTableType & { recurringId?: number })[] = [];
    let pointer: Dayjs = dayjs.unix(startDate);
    switch (reType) {
      case 'weekly':
        let reDay = parseInt(reVal);
        let dayOfWeek = pointer.day();
        let difference = Math.abs(dayOfWeek - reDay);
        if (dayOfWeek < reDay) {
          pointer = pointer.add(difference, 'd');
        } else {
          pointer = pointer.add(7 - difference, 'd');
        }
        while (pointer.unix() < endDate) {
          addition = addToAddition(addition, re, pointer);
          pointer = pointer.add(1, 'w');
        }
        break;
      case 'monthly':
        let reDate = parseInt(reVal);
        let _difference = Math.abs(parseInt(reVal) - dayjs.unix(startDate).date());
        if (dayjs.unix(startDate).date() < dayjs.unix(re.start).date()) {
          pointer = pointer.add(_difference, 'd');
        } else {
          pointer = dayjs.unix(startDate).set('D', reDate);
        }
        while (pointer.unix() < endDate) {
          addition = addToAddition(addition, re, pointer);
          pointer = pointer.add(1, 'M');
        }
        break;
      case 'yearly':
        let _year = max([dayjs.unix(startDate).year(), dayjs.unix(endDate).year()]);
        let reYearDate = dayjs(reVal, 'DD-MM').set('year', _year || dayjs().year());
        if (reYearDate.unix() < endDate && reYearDate.unix() >= startDate) {
          addition = addToAddition(addition, re, pointer);
        }
        break;
      default:
        break;
    }

    return [...acc, ...addition];
  }, [] as ExpenditureTableType[]);
}

const BigNumbers = () => {
  const db = useSelector((state: State) => state.database);
  const { startDate, endDate } = getDateNumbers();
  const [showBigNumbers, setShowBigNumbers] = useAtom(showBigNumbersAtom);
  const portPct = calculatePortfolioValue();
  const portVal = totalPortfolioValue();

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

    const monthlyRecurring = calculateRecurring(
      await db.recurring.where('start').belowOrEqual(startDate).toArray(),
      startDate,
      endDate
    ).reduce((acc, v) => acc + (v.amount as number), 0);

    const firstPaycheck =
      (
        await db.expenditure
          .where({
            txn_type: TransactionTypes.SALARY,
          })
          .first()
      )?.datetime || 0;

    const allRecurring = calculateRecurring(
      await db.recurring.where('start').belowOrEqual(dayjs().unix()).toArray(),
      firstPaycheck,
      endDate
    ).reduce((acc, v) => acc + (v.amount as number), 0);

    let total = wholeEx.reduce(
      (total, { amount, txn_type }) =>
        total +
        ([TransactionTypes.CREDIT, TransactionTypes.RECURRING].includes(txn_type)
          ? Number(amount) * -1
          : Number(amount)),
      0
    );

    return {
      total: total - allRecurring,
      spending: spending + monthlyRecurring,
      saving: saving - monthlyRecurring,
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
        onClick={() => setShowBigNumbers(!showBigNumbers)}
      >
        <Grid item xs={6} md={3}>
          <KeyItem
            value={!showBigNumbers ? `*****` : `$${data?.total.toLocaleString()}`}
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
            value={
              !showBigNumbers ? `*****` : `$${data?.spending.toLocaleString()}` || '$0'
            }
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <KeyItem
            title="Monthly Save"
            value={
              !showBigNumbers ? `*****` : `$${data?.saving.toLocaleString()}` || '$0'
            }
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <KeyItem
            title="Total Portfolio"
            value={!showBigNumbers ? `*****` : `$${portVal}` || '$0'}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <KeyItem
            title="Total Portfolio"
            value={!showBigNumbers ? `*****` : `${portPct}%` || '0%'}
            color={!showBigNumbers ? 'white' : portPct < 0 ? 'red' : 'green'}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default BigNumbers;
