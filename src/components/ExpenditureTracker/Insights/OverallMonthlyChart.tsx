import { useLiveQuery } from 'dexie-react-hooks';
import { useSelector } from 'react-redux';
import { State } from '@/state/reducers';
import { ResponsiveSunburst } from '@nivo/sunburst';
import { useState } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { FormCategories, negativeTypes } from '@/database';
import { getDateNumbers } from '@/components/ExpenditureTracker/Input';
import { ChartData, Inner } from '@/components/ExpenditureTracker/Insights';

export default () => {
  const db = useSelector((state: State) => state.database);
  const { startDate, endDate } = getDateNumbers();
  const darkMode = useSelector((state: State) => state.darkMode);
  const [data, setData] = useState<ChartData>({
    name: '',
    children: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [totalSpending, setTotalSpending] = useState(1);

  useLiveQuery(async () => {
    const currentMonth = await db.expenditure
      .where(FormCategories.datetime)
      .between(startDate, endDate, true, false)
      .toArray();

    let res: ChartData[] = [
      ...new Set(
        currentMonth
          .filter((item) => negativeTypes.includes(item.txn_type))
          .map((item) => item.category)
      ),
    ].map((val) => ({
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
        }, []),
    }));

    let spending = currentMonth
      .filter((ex) => negativeTypes.includes(ex.txn_type))
      .reduce((prev, next) => prev + Number(next.amount), 0);

    setTotalSpending(spending);
    setData({ name: 'total', children: res });
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [startDate, endDate]);

  return isLoading ? (
    <CircularProgress />
  ) : data.children.length === 0 ? (
    <Typography>Your chart is empty 🪹, please input some data first 🍆</Typography>
  ) : (
    <div
      style={{
        height: '40vh',
        width: '80vw',
      }}
    >
      <ResponsiveSunburst
        data={data}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        id="name"
        value="amount"
        cornerRadius={2}
        borderColor={{ theme: 'background' }}
        colors={{ scheme: 'dark2' }}
        childColor={{
          from: 'color',
          modifiers: [['brighter', 1]],
        }}
        enableArcLabels={true}
        arcLabelsSkipAngle={10}
        arcLabel={(e) => `${e.id} $${e.value}`}
        arcLabelsTextColor={darkMode ? '#fff' : '#000'}
        tooltip={(e) => (
          <div
            style={{
              backgroundColor: darkMode ? '#000' : '#fff',
              color: darkMode ? '#fff' : '#000',
              padding: '5px 10px 5px 10px',
              borderRadius: '25px',
            }}
          >
            {`${e.id} ${((e.value / totalSpending) * 100).toFixed(2)}% $${e.value.toFixed(
              2
            )}`}
          </div>
        )}
      />
    </div>
  );
};
