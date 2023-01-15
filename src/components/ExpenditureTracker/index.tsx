import Goals from '@/components/ExpenditureTracker/Goals';
import SpecialInput from '@/components/ExpenditureTracker/Input';
import Insights from '@/components/ExpenditureTracker/Insights';
import Toaster from '@/components/ExpenditureTracker/Toaster';
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import Toolbar from './Toolbar';

const ExpenditureTabs = [
  {
    name: 'Input',
    component: SpecialInput,
  },
  {
    name: 'Insights',
    component: Insights,
  },
  {
    name: 'Goals',
    component: Goals,
  },
];

export default () => {
  const [chosenTab, setChosenTab] = useState(ExpenditureTabs[2].name);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Toolbar />

      <Tabs
        value={chosenTab}
        onChange={(e: any, newValue: string) => setChosenTab(newValue)}
      >
        {ExpenditureTabs.map((t, i) => (
          <Tab label={t.name} key={i} value={t.name} />
        ))}
      </Tabs>

      <Box sx={{ mt: 2, mb: 6 }}>
        {ExpenditureTabs.map((t, i) => {
          if (chosenTab === t.name) {
            return <t.component />;
          }
        })}
      </Box>

      <Toaster />
    </Box>
  );
};
