import { getDateNumbers } from '@/components/ExpenditureTracker/Input';
import { calculateRecurring } from '@/components/ExpenditureTracker/Input/BigNumbers';
import { RecurrenceTypes } from '@/components/ExpenditureTracker/Input/Form';
import { ChartData, Inner } from '@/components/ExpenditureTracker/Insights';
import {
  ExpenditureTableType,
  FormCategories,
  negativeTypes,
  TransactionTypes,
} from '@/database';
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
import dayjs, { Dayjs } from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { max, round } from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';

type InnerPlusType = Inner & { type: TransactionTypes };

export default () => {
  const db = useSelector((state: State) => state.database);
  const { startDate, endDate } = getDateNumbers();
  const [items, setItems] = useState<{ name: string; children: InnerPlusType[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useLiveQuery(async () => {
    const _startDate = dayjs.unix(startDate);

    let currentMonth = await db.expenditure
      .where(FormCategories.datetime)
      .between(startDate, endDate || Infinity, true, false)
      .toArray();

    const currentMonthRecurring = calculateRecurring(
      await db.recurring.toArray(),
      startDate,
      endDate
    );

    currentMonth = [...currentMonth, ...currentMonthRecurring];

    let _items = [...new Set(currentMonth.map((item) => item.category))]
      .map((val) => ({
        name: val,
        children: currentMonth
          .filter((item) => item.category === val)
          .map((item) => {
            return {
              name: item.name,
              amount: item.amount,
              type: item.txn_type,
            };
          })
          .reduce((a: any[], c) => {
            let existing: InnerPlusType | undefined = a.find(
              (n: InnerPlusType) => n.name?.toLowerCase() === c.name.toLowerCase()
            );
            if (existing) {
              existing.amount += Number(c.amount);
            } else {
              a.push(c);
            }
            return a;
          }, [] as InnerPlusType[])
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

  type LineItemProps = {
    name: string;
    key?: number;
  };
  const LineItem: React.FC<LineItemProps> = ({ children, name, key }) => {
    return (
      <Grid container direction="row" justifyContent="space-between" key={key}>
        <Grid item>
          <Typography>{name}</Typography>
        </Grid>
        <Grid item>
          <Typography>{children}</Typography>
        </Grid>
      </Grid>
    );
  };

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
            {i.children.map((c: InnerPlusType, idx: number) => (
              <>
                <LineItem name={c.name} key={idx}>
                  <strong
                    style={{
                      color: negativeTypes.includes(c.type) ? 'red' : 'green',
                    }}
                  >
                    ${round(c.amount, 2)}
                  </strong>
                </LineItem>
                <Divider />
              </>
            ))}
            <LineItem name={'Total: '}>
              $
              {round(
                i.children.reduce((total, c) => (total += c.amount), 0),
                2
              )}
            </LineItem>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
