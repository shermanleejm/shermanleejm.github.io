import ExpenditureInput from '@/components/ExpenditureTracker/Input';
import ExpenditureInsights from '@/components/ExpenditureTracker/Insights';
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import Toolbar from './Toolbar';

export default () => {
  const ExpenditureTabs = [
    {
      name: 'Input',
      component: <ExpenditureInput />,
    },
    {
      name: 'Insights',
      component: <ExpenditureInsights />,
    },
    {
      name: 'Goals',
      component: <div></div>,
    },
  ];
  const [chosenTab, setChosenTab] = useState(ExpenditureTabs[0].name);

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
            return t.component;
          }
        })}
      </Box>
    </Box>
  );
};
