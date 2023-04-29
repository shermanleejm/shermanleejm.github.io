import { getDateNumbers } from '@/components/ExpenditureTracker/Input';
import { calculateRecurring } from '@/components/ExpenditureTracker/Input/BigNumbers';
import { db, FormCategories, negativeTypes, TransactionTypes } from '@/database';
import { useLiveQuery } from 'dexie-react-hooks';
import _, { uniq } from 'lodash';
import { ResponsiveBar } from '@nivo/bar';
import { Box, Typography } from '@mui/material';
import {
  chartContainerStyle,
  FunkyTooltip,
} from '@/components/ExpenditureTracker/Insights';
import { darkModeAtom } from '@/App';
import { useAtom } from 'jotai';

export default function CreditCard() {
  const { startDate, endDate } = getDateNumbers();
  const [darkMode] = useAtom(darkModeAtom);
  const data = useLiveQuery(async () => {
    const currentMonth = await db.expenditure
      .where(FormCategories.datetime)
      .between(startDate, endDate || Infinity, true, true)
      .toArray();

    const currentMonthRecurring = calculateRecurring(
      await db.recurring.toArray(),
      startDate,
      endDate
    );

    const grouped = _([...currentMonth, ...currentMonthRecurring])
      .filter((val) => val.txn_type === TransactionTypes.CREDIT)
      .groupBy(FormCategories.creditCard)
      .mapValues((val) => val.reduce((a, b) => a + Number(b.amount), 0))
      .value();

    const banks: string[] = [];
    const chartData = Object.entries(grouped).reduce((a, b) => {
      const [source, amount] = b;
      banks.push(source);
      return [...a, { source, [source]: amount }];
    }, [] as any[]);

    return { chartData, banks: uniq(banks) };
  }, [startDate, endDate]);

  return (
    <Box sx={chartContainerStyle}>
      <Typography variant="h6">Spending by Card</Typography>
      <ResponsiveBar
        data={data?.chartData || []}
        indexBy="source"
        keys={data?.banks || []}
        tooltip={(e) => (
          <FunkyTooltip>{`${e.id} $${e.value.toLocaleString()}`}</FunkyTooltip>
        )}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        theme={{
          axis: {
            legend: { text: { fill: darkMode ? '#939393' : '#000' } },
            ticks: { text: { fill: darkMode ? '#939393' : '#000' } },
          },
          labels: {
            text: {
              fill: darkMode ? '#fff' : '#000',
              textShadow: `1px 1px ${darkMode ? 'black' : 'white'}`,
            },
          },
        }}
      />
    </Box>
  );
}
