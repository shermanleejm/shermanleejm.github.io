import { calculateRecurring } from '@/components/ExpenditureTracker/Input/BigNumbers';
import { db, negativeTypes, positiveTypes, TransactionTypes } from '@/database';
import dayjs from 'dayjs';
import { sortBy } from 'lodash';

export const getExpenditureTableData = async () => {
  const normalExpenditure = await db.expenditure.toArray();

  let { minDate, maxDate } = normalExpenditure.reduce(
    (dates, curr) => {
      return {
        minDate: Math.min(curr.datetime, dates.minDate),
        maxDate: Math.max(curr.datetime, dates.maxDate),
      };
    },
    { minDate: Infinity, maxDate: 0 }
  );

  const maxId = normalExpenditure.reduce((id, curr) => Math.max(id, curr.id || 0), 0);

  const monthlyRecurring = calculateRecurring(
    await db.recurring.where('start').belowOrEqual(maxDate).toArray(),
    minDate,
    maxDate
  ).map((val, index) => ({ ...val, id: maxId + index }));

  return sortBy([...normalExpenditure, ...monthlyRecurring], ['datetime']);
};

export const getBigNumbersData = async (startDate: number, endDate: number) => {
  const wholeEx = await db.expenditure.toArray();
  const currentMonth = wholeEx.filter(
    (ex) => ex.datetime >= startDate && ex.datetime <= endDate
  );

  let saving = currentMonth.reduce(
    (prev, next) =>
      prev + Number(next.amount) * (positiveTypes.includes(next.txn_type) ? 1 : -1),
    0
  );

  let spending = sortBy(
    currentMonth.filter((ex) => negativeTypes.includes(ex.txn_type)),
    ['datetime']
  ).reduce((prev, next) => prev + (next.amount as number), 0);

  const monthlyRecurring = calculateRecurring(
    await db.recurring.where('start').belowOrEqual(dayjs().unix()).toArray(),
    startDate,
    dayjs().unix()
  )
    .filter((val) => val.datetime >= startDate && val.datetime < endDate)
    .reduce((acc, v) => acc + (v.amount as number), 0);

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
    dayjs().unix()
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
};
