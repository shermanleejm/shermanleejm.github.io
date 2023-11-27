import { darkModeAtom } from '@/App';
import Breakdown from '@/components/ExpenditureTracker/Insights/Breakdown';
import CreditCard from '@/components/ExpenditureTracker/Insights/CreditCard';
import ExpenditureTable from '@/components/ExpenditureTracker/Insights/ExpenditureTable';
import OverallFiltering from '@/components/ExpenditureTracker/Insights/OverallFiltering';
import { Box, Grid } from '@mui/material';
import { useAtom } from 'jotai';
import { FC } from 'react';
import 'handsontable/dist/handsontable.full.min.css';
import { registerAllModules } from 'handsontable/registry';

registerAllModules();

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
        <Breakdown />
      </Grid>
      <Grid item>
        <CreditCard />
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
