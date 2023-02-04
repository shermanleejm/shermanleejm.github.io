import { calculateRecurring } from '@/components/ExpenditureTracker/Input/BigNumbers';
import {
  chartContainerStyle,
  FunkyTooltip,
} from '@/components/ExpenditureTracker/Insights';
import {
  ExpenditureTableType,
  negativeTypes,
  positiveTypes,
  TransactionTypes,
} from '@/database';
import { State } from '@/state/reducers';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { round, sortBy } from 'lodash';
import { useSelector } from 'react-redux';
import { ResponsiveLine } from '@nivo/line';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/App';

export default () => {
  const db = useSelector((state: State) => state.database);
  type Labels = 'savings' | 'spending';
  type ChartData = {
    id: Labels;
    data: { x: string; y: number }[];
  };
  const [darkMode] = useAtom(darkModeAtom);
  const overallSavings: ChartData[] =
    useLiveQuery(async () => {
      const paydays = [
        ...(
          await db.expenditure.where({ txn_type: TransactionTypes.SALARY }).toArray()
        ).map((e) => e.datetime),
        dayjs().unix(),
      ];
      if (paydays.length < 2) return [] as ChartData[];

      const allRecurring = calculateRecurring(
        await db.recurring.where('start').belowOrEqual(dayjs().unix()).toArray(),
        paydays[0],
        dayjs().unix()
      );

      const allExpenditure = await db.expenditure.toArray();

      let paydayPointer = 0;
      let accumulator: ExpenditureTableType[] = [];
      let allData = sortBy([...allExpenditure, ...allRecurring], ['datetime']).reduce(
        (total, curr) => {
          let _start = paydays[paydayPointer];
          let _end = paydays[paydayPointer + 1];

          if (curr.datetime >= _end) {
            paydayPointer += 1;
            let _tmp = accumulator;
            accumulator = [curr];
            return [...total, _tmp];
          }

          accumulator.push(curr);

          return total;
        },
        [] as ExpenditureTableType[][]
      );

      allData = [...allData, accumulator];

      return [
        {
          id: 'savings',
          data: allData.reduce((total, curr, index) => {
            return [
              ...total,
              {
                x: dayjs.unix(paydays[index]).format('MMM'),
                y: round(
                  curr.reduce(
                    (_total, _curr) =>
                      (_total += positiveTypes.includes(_curr.txn_type)
                        ? Number(_curr.amount)
                        : -Number(_curr.amount)),
                    0
                  ),
                  2
                ),
              },
            ] as { x: 'savings'; y: number }[];
          }, [] as { x: 'savings'; y: number }[]),
        },
        {
          id: 'spending',
          data: allData.reduce((total, curr, index) => {
            return [
              ...total,
              {
                x: dayjs.unix(paydays[index]).format('MMM'),
                y: round(
                  curr.reduce(
                    (_total, _curr) =>
                      (_total += negativeTypes.includes(_curr.txn_type)
                        ? Number(_curr.amount)
                        : 0),
                    0
                  ),
                  2
                ),
              },
            ] as { x: 'savings'; y: number }[];
          }, [] as { x: 'savings'; y: number }[]),
        },
      ];
    }) ?? ([] as ChartData[]);

  return overallSavings.length === 0 ? (
    <></>
  ) : (
    <Box sx={chartContainerStyle}>
      <Typography variant="h6">Overall Savings and Spending</Typography>
      <ResponsiveLine
        data={overallSavings}
        margin={{ top: 10, right: 10, bottom: 50, left: 50 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
        }}
        theme={{
          axis: {
            legend: { text: { fill: darkMode ? '#939393' : '#000' } },
            ticks: { text: { fill: darkMode ? '#939393' : '#000' } },
          },
        }}
        colors={{ scheme: 'category10' }}
        yFormat=" >-.2f"
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        tooltip={(e) => (
          <FunkyTooltip>
            <Typography>{e.point.serieId}</Typography>
            <Typography>
              {e.point.data.x}: {e.point.data.y}
            </Typography>
          </FunkyTooltip>
        )}
      />
    </Box>
  );
};
