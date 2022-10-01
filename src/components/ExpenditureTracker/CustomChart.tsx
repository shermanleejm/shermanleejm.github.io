import { useLiveQuery } from 'dexie-react-hooks';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';
import { ResponsiveSunburst } from '@nivo/sunburst';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import { getDateRange } from '.';

interface Inner {
  name: string;
  amount: number;
}

const CustomChart = () => {
  const db = useSelector((state: State) => state.database);
  const darkMode = useSelector((state: State) => state.darkMode);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [payday, setPayday] = useState(25);
  const [dateRange, setDateRange] = useState(getDateRange());
  const [totalSpending, setTotalSpending] = useState(1);

  useEffect(() => {
    function getPayday() {
      let payday = Number(window.localStorage.getItem('payday') || '15');
      setPayday(payday);
      setDateRange(getDateRange());
    }
    function monitorLocalStorage() {
      window.addEventListener('storage', () => {
        getPayday();
      });
    }
    getPayday();
    monitorLocalStorage();
  }, [isLoading]);

  useLiveQuery(async () => {
    let _data = await db.expenditure.toArray();
    let res = [
      ...new Set(_data.filter((item) => !item.is_credit).map((item) => item.category)),
    ].map((val) => ({
      name: val,
      children: _data
        .filter((item) => item.category === val && item.datetime >= dateRange.startDate)
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

    let spending = (await db.expenditure.toArray())
      .filter((x) => !x.is_credit && x.datetime >= dateRange.startDate)
      .map((item) => item.amount)
      .reduce((prev, next) => Number(prev) + Number(next), 0);

    setTotalSpending(Number(spending));
    setData({ name: 'total', children: res });
    setIsLoading(false);
  }, [dateRange]);

  return isLoading ? (
    <div>
      <CircularProgress />
    </div>
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
          >{`${e.id} ${((e.value / totalSpending) * 100).toFixed(2)}%`}</div>
        )}
      />
    </div>
  );
};

export default CustomChart;
