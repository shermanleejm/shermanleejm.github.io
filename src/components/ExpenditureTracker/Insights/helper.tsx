import { calculateRecurring } from '@/components/ExpenditureTracker/Input/BigNumbers';
import {
  db,
  ExpenditureTableType,
  RecurringTableType,
  TransactionTypes,
} from '@/database';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import _, { round } from 'lodash';

export const STARTING_MONTHS = 6;
export const DAYJS_FORMAT = 'MMM YYYY';

export const useAllDB = () => {
  const dbExpenditure = useLiveQuery(
    () => db.expenditure.toArray(),
    [],
    [] as ExpenditureTableType[]
  );
  const dbRecurring = calculateRecurring(
    useLiveQuery(
      () => db.recurring.where('start').belowOrEqual(dayjs().unix()).toArray(),
      [],
      [] as RecurringTableType[]
    ),
    useLiveQuery(
      () => db.expenditure.where({ txn_type: TransactionTypes.SALARY }).toArray(),
      [],
      [] as ExpenditureTableType[]
    )?.map((val) => val.datetime)[0] || dayjs().unix(),
    dayjs().unix()
  );
  return [...dbExpenditure, ...dbRecurring];
};

export function recalculateData({
  tags,
  dates,
  ALL_DB,
}: {
  tags: string[];
  dates: string[];
  ALL_DB: ExpenditureTableType[];
}) {
  type weird = Omit<ExpenditureTableType, 'category'> & { category: string[] };
  return _(
    _(ALL_DB)
      ?.sortBy((val) => val.datetime)
      .map((val) => ({
        ...val,
        category: (() => {
          try {
            return JSON.parse(val.category) as string[];
          } catch (e) {
            return [] as string[];
          }
        })(),
      }))
      .filter(
        (val) =>
          val.category.every((v) => tags.includes(v)) &&
          dates.includes(dayjs.unix(val.datetime).format(DAYJS_FORMAT))
      )
      .reduce((a, b) => {
        b.category.forEach((c) => {
          if (!(c in a)) {
            a[c] = [] as weird[];
          }
          a[c].push(b as weird);
        });
        return a;
      }, {} as Record<string, weird[]>)
  )
    .toPairs()
    .map(([key, value]) => ({
      id: key,
      data: _(value)
        .groupBy((val) => dayjs.unix(val.datetime).format(DAYJS_FORMAT))
        .toPairs()
        // TODO: need sort again
        .map(([k, v]) => ({
          x: dayjs(k, DAYJS_FORMAT).format('MMM'),
          y: v.reduce((a, b) => round(a + (b.amount as number), 2), 0),
        }))
        .value(),
    }))
    .value();
}
