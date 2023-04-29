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
import { max, round, sortBy } from 'lodash';
import { atomWithStorage } from 'jotai/utils';
import { useAtom } from 'jotai';
import {
  calculatePortfolioValue,
  totalPortfolioValue,
} from '@/components/AssetTracker/BoringTracker/hooks';
import { getBigNumbersData } from '@/components/ExpenditureTracker/Input/callbacks';

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
    credit_card: re.credit_card,
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
      // TODO: fix this
      case 'yearly':
        let _year = max([dayjs.unix(startDate).year(), dayjs.unix(endDate).year()]);
        let reYearDate = dayjs(reVal, 'DD-MM').set('year', _year || dayjs().year());
        if (reYearDate.unix() < endDate && reYearDate.unix() >= startDate) {
          pointer = dayjs.unix(re.start);
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
  const { startDate, endDate } = getDateNumbers();
  const [showBigNumbers, setShowBigNumbers] = useAtom(showBigNumbersAtom);
  const portPct = calculatePortfolioValue();
  const portVal = totalPortfolioValue();

  const data = useLiveQuery(
    () => getBigNumbersData(startDate, endDate),
    [startDate, endDate]
  );

  return (
    <div>
      <Grid
        container
        justifyContent={'center'}
        alignItems={'center'}
        direction={'row'}
        style={{ textAlign: 'center' }}
        spacing={1}
        onClick={() => setShowBigNumbers(!showBigNumbers)}
      >
        <Grid item xs={6} md={3}>
          <KeyItem
            value={!showBigNumbers ? `*****` : `$${data?.total.toLocaleString()}`}
            title={'Total funds'}
            color={
              !showBigNumbers
                ? undefined
                : Number(data?.total.toLocaleString()) < 0
                ? 'red'
                : 'green'
            }
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
            value={
              !showBigNumbers ? `*****` : `$${round(portVal, 2).toLocaleString()}` || '$0'
            }
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <KeyItem
            title="Total Portfolio (%)"
            value={!showBigNumbers ? `*****` : `${portPct}%` || '0%'}
            color={!showBigNumbers ? undefined : portPct < 0 ? 'red' : 'green'}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default BigNumbers;
