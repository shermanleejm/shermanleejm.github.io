import { Box, Grid } from '@mui/material';
import OverallSavings from '@/components/ExpenditureTracker/Insights/OverallSavings';
import { FC } from 'react';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/App';
import CreditCard from '@/components/ExpenditureTracker/Insights/CreditCard';
import ExpenditureTable from '@/components/ExpenditureTracker/Insights/ExpenditureTable';

export default () => {
  return (
    <Grid container justifyContent="center" alignItems="center" direction="column">
      <Grid item>
        <CreditCard />
      </Grid>
      <Grid item>
        <OverallSavings />
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
