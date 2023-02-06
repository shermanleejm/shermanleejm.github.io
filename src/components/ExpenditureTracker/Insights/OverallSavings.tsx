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
import { Box, Button, Grid, ToggleButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { round, sortBy } from 'lodash';
import { useSelector } from 'react-redux';
import { ResponsiveLine, Serie } from '@nivo/line';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/App';
import { useState } from 'react';

export default () => {
  const db = useSelector((state: State) => state.database);
  const LABELS = ['savings', 'spending'];
  type Labels = keyof typeof LABELS;

  type ChartData = {
    id: Labels;
    data: { x: string; y: number }[];
  };
  const [darkMode] = useAtom(darkModeAtom);
  const [selectedIds, setSelectedIds] = useState(LABELS);
  const overallSavings = useLiveQuery(async () => {
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

    const _all = sortBy([...allExpenditure, ...allRecurring], ['datetime']);

    let savingsData: { x: string; y: number }[] = [];
    let spendingData: { x: string; y: number }[] = [];
    paydays.forEach((payday, index) => {
      let nextPayday = paydays[index + 1];
      let chunk: ExpenditureTableType[];
      if (nextPayday === undefined) {
        chunk = _all.filter((val) => val.datetime >= payday);
      } else {
        chunk = _all.filter((val) => val.datetime >= payday && val.datetime < nextPayday);
      }
      if (chunk.length === 0) return;
      let _month = dayjs
        .unix(sortBy(chunk, ['datetime'])[chunk.length - 1]?.datetime)
        .format('MMM');

      savingsData.push({
        x: _month,
        y: round(
          chunk.reduce(
            (_total, _curr) =>
              (_total += positiveTypes.includes(_curr.txn_type)
                ? Number(_curr.amount)
                : -Number(_curr.amount)),
            0
          ),
          2
        ),
      });

      spendingData.push({
        x: _month,
        y: round(
          chunk.reduce(
            (_total, _curr) =>
              (_total += negativeTypes.includes(_curr.txn_type)
                ? Number(_curr.amount)
                : 0),
            0
          ),
          2
        ),
      });
    });

    return [
      {
        id: 'savings',
        data: savingsData,
      },
      {
        id: 'spending',
        data: spendingData,
      },
    ].filter((val) => selectedIds.includes(val.id)) as ChartData[];
  }, [selectedIds]);

  return (overallSavings || []).length === 0 ? (
    <></>
  ) : (
    <Box sx={{ ...chartContainerStyle, pb: 2 }}>
      <Typography variant="h6">Overall Savings and Spending</Typography>
      <ResponsiveLine
        data={overallSavings as Serie[]}
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
      <Grid container direction="row" spacing={1}>
        <Grid item xs={5}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setSelectedIds(['savings'])}
          >
            savings
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Button
            fullWidth
            variant="outlined"
            color="warning"
            onClick={() => setSelectedIds(['spending'])}
          >
            spending
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={() => setSelectedIds(LABELS)}
          >
            all
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
