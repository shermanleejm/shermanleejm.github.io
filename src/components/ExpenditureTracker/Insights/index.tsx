import { Box, Grid } from '@mui/material';
import OverallMonthlyChart from '@/components/ExpenditureTracker/Insights/CurrentMonthSpendingChart';
import ListItems from '@/components/ExpenditureTracker/Insights/LineItems';
import WeeklySpendingChart from '@/components/ExpenditureTracker/Insights/WeeklySpendingChart';
import OverallSavings from '@/components/ExpenditureTracker/Insights/OverallSavings';
import { FC } from 'react';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/App';

export default () => {
  return (
    <Grid container justifyContent="center" alignItems="center" direction="column">
      <Grid item>
        <OverallSavings />
      </Grid>
      <Grid item>
        <WeeklySpendingChart />
      </Grid>
      <Grid item>
        <OverallMonthlyChart />
      </Grid>
      <Grid item>
        <ListItems />
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

export const chartContainerStyle = {
  m: 4,
  height: '40vh',
  width: '80vw',
  textAlign: 'center',
};

export const FunkyTooltip: FC = ({ children }) => {
  const [darkMode] = useAtom(darkModeAtom);
  return (
    <Box
      sx={{
        backgroundColor: darkMode ? '#000' : '#fff',
        padding: '5px 10px 5px 10px',
        borderRadius: '25px',
      }}
    >
      {children}
    </Box>
  );
};
