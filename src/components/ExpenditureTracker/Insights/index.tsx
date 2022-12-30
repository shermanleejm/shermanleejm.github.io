import { Grid } from '@mui/material';
import ExpenditureTable from '@/components/ExpenditureTracker/Insights/ExpenditureTable';
import CustomChart from '@/components/ExpenditureTracker/Insights/CustomChart';
import ListItems from '@/components/ExpenditureTracker/Insights/LineItems';

export default () => {
  return (
    <Grid container justifyContent="center" alignItems="center" direction="column">
      <Grid item>
        <CustomChart />
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
