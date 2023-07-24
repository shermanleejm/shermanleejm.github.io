import { Box, Grid } from '@mui/material';
import { FC } from 'react';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/App';
import CreditCard from '@/components/ExpenditureTracker/Insights/CreditCard';
import ExpenditureTable from '@/components/ExpenditureTracker/Insights/ExpenditureTable';
import OverallFiltering from '@/components/ExpenditureTracker/Insights/OverallFiltering';
import CurrentMonth from '@/components/ExpenditureTracker/Insights/CurrentMonth';

export default function Insights() {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
      spacing={2}
    >
      <Grid item>
        <CreditCard />
      </Grid>
      <Grid item>
        <CurrentMonth />
      </Grid>
      <Grid item>
        <OverallFiltering />
      </Grid>
      <Grid item>
        <ExpenditureTable />
      </Grid>
    </Grid>
  );
}

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
