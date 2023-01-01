import { Grid } from '@mui/material';
import ExpenditureTable from '@/components/ExpenditureTracker/Insights/ExpenditureTable';
import OverallMonthlyChart from '@/components/ExpenditureTracker/Insights/OverallMonthlyChart';
import ListItems from '@/components/ExpenditureTracker/Insights/LineItems';
import WeeklySpendingChart from '@/components/ExpenditureTracker/Insights/WeeklySpendingChart';

export default () => {
  return (
    <Grid container justifyContent="center" alignItems="center" direction="column">
      <Grid item>
        <WeeklySpendingChart />
      </Grid>
      <Grid item>
        <OverallMonthlyChart />
      </Grid>
      <Grid item>
        <ListItems />
      </Grid>
      <Grid item>
        <ExpenditureTable />
      </Grid>
    </Grid>
  );
};

export type Inner = {
  name: string;
  amount: number;
};

export type ChartData = {
  name: string;
  children: any[];
};
