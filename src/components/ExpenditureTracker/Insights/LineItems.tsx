import { getDateNumbers } from '@/components/ExpenditureTracker/Input';
import { ChartData, Inner } from '@/components/ExpenditureTracker/Insights';
import { State } from '@/state/reducers';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import { round } from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default () => {
  const db = useSelector((state: State) => state.database);
  const { startDate, endDate } = getDateNumbers();
  const [items, setItems] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useLiveQuery(async () => {
    const currentMonth = (await db.expenditure.toArray()).filter(
      (ex) => ex.datetime >= startDate && ex.datetime < endDate
    );

    let _items = [...new Set(currentMonth.map((item) => item.category))]
      .map((val) => ({
        name: val,
        children: currentMonth
          .filter((item) => item.category === val)
          .map((item) => {
            return {
              name: item.name,
              amount: item.amount,
            };
          })
          .reduce((a: any[], c) => {
            let existing: Inner | undefined = a.find(
              (n: Inner) => n.name?.toLowerCase() === c.name.toLowerCase()
            );
            if (existing) {
              existing.amount += Number(c.amount);
            } else {
              a.push(c);
            }
            return a;
          }, [])
          .sort((a, b) => b.amount - a.amount),
      }))
      .sort(
        (a, b) =>
          b.children.reduce((t, c) => (t += c.amount), 0) -
          a.children.reduce((t, c) => (t += c.amount), 0)
      );

    setItems(_items);
    setTimeout(() => setIsLoading(false), 1000);
  }, [startDate, endDate]);

  return isLoading ? (
    <CircularProgress />
  ) : items.length === 0 ? (
    <Typography>No data to show 😭</Typography>
  ) : (
    <Box sx={{ margin: '20px 0px' }}>
      {items.map((i: ChartData, idx: number) => (
        <Accordion sx={{ width: '80vw' }}>
          <AccordionSummary key={idx} expandIcon={<ExpandMore />}>
            <Typography>{i.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {i.children.map((c: Inner, idx: number) => (
              <>
                {idx !== 0 && <Divider />}
                <Grid key={idx} container direction="row" justifyContent="space-between">
                  <Grid item>
                    <Typography>{c.name}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
                      <strong>${round(c.amount, 2)}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
