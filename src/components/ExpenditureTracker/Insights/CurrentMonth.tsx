import { getDateNumbers } from '@/components/ExpenditureTracker/Input';
import { ExpenditureTableType, FormCategories, db } from '@/database';
import { Typography } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import _ from 'lodash';

export default function CurrentMonth() {
  const { startDate, endDate } = getDateNumbers();
  const { data, tags } = useLiveQuery(async () => {
    const currentRange = await db.expenditure
      .where(FormCategories.datetime)
      .between(startDate, endDate || Infinity, true, true)
      .toArray();

    const tags = _(currentRange)
      .countBy(FormCategories.category)
      .toPairs()
      .sortBy(1)
      .reverse()
      .map((row) => row[0])
      .value();

    const data = _(currentRange).value();

    return { data, tags };
  }) || { data: [], tags: [] };

  console.log(cleanData(data));

  return (
    <div>
      <Typography variant="h6">Current Month</Typography>
    </div>
  );
}

function cleanData(data: ExpenditureTableType[]) {
  return _(data).groupBy('category').value();
}
