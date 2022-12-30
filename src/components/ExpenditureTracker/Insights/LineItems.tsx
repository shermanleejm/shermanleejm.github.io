import { getDateNumbers } from '@/components/ExpenditureTracker/Input';
import { ChartData, Inner } from '@/components/ExpenditureTracker/Insights';
import { State } from '@/state/reducers';
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import { round } from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default () => {
  const db = useSelector((state: State) => state.database);
  const { startDate, endDate } = getDateNumbers();
  const [listStates, setListStates] = useState<Record<string, boolean>>({});
  const [items, setItems] = useState<ChartData[]>([]);

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

    let _listStates = _items.reduce((res, i) => {
      res[i.name] = true;
      return res;
    }, {} as Record<string, boolean>);

    setItems(_items);
    setListStates(_listStates);
  }, [startDate, endDate]);

  return (
    <Box>
      <List sx={{ width: '80vw' }}>
        {items.map((i: ChartData, idx: number) => (
          <>
            <ListItemButton
              onClick={() => {
                let newValue = !listStates[i.name];
                let newRecord = listStates;
                newRecord[i.name] = newValue;
                setListStates(newRecord);
                console.log(listStates);
              }}
            >
              <ListItemText primary={i.name} />
            </ListItemButton>
            <div style={{ display: listStates[i.name] ? 'block' : 'none' }}>
              {i.children.map((c: Inner) => (
                <List>
                  <ListItemButton>
                    <ListItemText
                      sx={{ pl: 4 }}
                      primary={`${c.name} - $${round(c.amount, 2)}`}
                    />
                  </ListItemButton>
                </List>
              ))}
            </div>
          </>
        ))}
      </List>
    </Box>
  );
};
