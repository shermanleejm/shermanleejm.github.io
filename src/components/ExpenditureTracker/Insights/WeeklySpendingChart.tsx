import { getDateNumbers } from '@/components/ExpenditureTracker/Input';
import { FormCategories, negativeTypes } from '@/database';
import { State } from '@/state/reducers';
import { ResponsiveBar } from '@nivo/bar';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { round } from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default () => {
  const db = useSelector((state: State) => state.database);
  const { startDate, endDate } = getDateNumbers();
  const emptyData = [...Array(7).keys()].reduce((acc, i) => {
    acc[dayjs('01/01/2023', 'DD/MM/YYYY').add(i, 'day').format('ddd')] = 0;
    return { ...acc };
  }, {} as Record<string, number>);
  const darkMode = useSelector((state: State) => state.darkMode);
  type DataType = {
    day: string;
    amount: number;
  };
  const [data, setData] = useState<DataType[]>([]);

  useLiveQuery(async () => {
    const currentMonth = (
      await db.expenditure
        .where(FormCategories.datetime)
        .between(startDate, endDate || Infinity, true, false)
        .toArray()
    ).reduce((acc, val) => {
      let day = dayjs.unix(val.datetime).format('ddd');
      if (!(day in acc)) {
        acc[day] = 0;
      }
      if (negativeTypes.includes(val.txn_type)) {
        acc[day] += val.amount as number;
      }
      return { ...acc };
    }, emptyData);

    const res = Object.keys(currentMonth).reduce((acc, val) => {
      return [...acc, { day: val, amount: round(currentMonth[val], 2) }];
    }, [] as { day: string; amount: number }[]);

    setData(res);
  }, [startDate, endDate]);

  return (
    <div
      style={{
        height: '30vh',
        width: '90vw',
      }}
    >
      <ResponsiveBar
        data={data}
        keys={['amount']}
        indexBy="day"
        margin={{ top: 10, right: 10, bottom: 50, left: 50 }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Day of the week',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '💰💰💰',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        theme={{
          axis: {
            legend: { text: { fill: darkMode ? '#939393' : '#000' } },
            ticks: { text: { fill: darkMode ? '#939393' : '#000' } },
          },
        }}
        tooltip={({ id, value, color }) => (
          <div
            style={{
              padding: 12,
              color,
              background: '#222222',
            }}
          >
            <span>Look, I'm custom </span>
            <br />
            <strong>
              {id}: {value}
            </strong>
          </div>
        )}
        animate={true}
      />
    </div>
  );
};
