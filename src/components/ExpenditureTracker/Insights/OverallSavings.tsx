import { calculateRecurring } from '@/components/ExpenditureTracker/Input/BigNumbers';
import {
  chartContainerStyle,
  FunkyTooltip,
} from '@/components/ExpenditureTracker/Insights';
import {
  ExpenditureTableType,
  negativeTypes,
  positiveTypes,
  TransactionTypes,
} from '@/database';
import { State } from '@/state/reducers';
import {
  Box,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { omit, round, sortBy, uniq } from 'lodash';
import { useSelector } from 'react-redux';
import { ResponsiveLine, Serie } from '@nivo/line';
import { useAtom } from 'jotai';
import { darkModeAtom } from '@/App';
import { useEffect, useState } from 'react';

const COLORS = [
  '#77DD77',
  '#836953',
  '#89cff0',
  '#9adedb',
  '#aa9499',
  '#cb99c9',
  '#ff9899',
  '#e8c1a0',
  '#f47560',
  '#f1e15b',
  '#e8a838',
  '#61cdbb',
  '#97e3d5',
];

const BASE_LABELS = ['savings', 'spending'];

function dateChunker(dates: number[], keys: string[], _all: ExpenditureTableType[]) {
  let res: Record<string, { x: string; y: number }[]> = {
    savings: [],
    spending: [],
  };

  dates.forEach((payday, index) => {
    let nextPayday = dates[index + 1];
    let chunk: ExpenditureTableType[];
    if (nextPayday === undefined) {
      chunk = _all.filter((val) => val.datetime >= payday);
    } else {
      chunk = _all.filter((val) => val.datetime >= payday && val.datetime < nextPayday);
    }
    if (chunk.length === 0) return;
    let _month = dayjs
      .unix(sortBy(chunk, ['datetime'])[chunk.length - 1]?.datetime)
      .format('MMM');

    keys.map((k) => {
      switch (k) {
        case BASE_LABELS[0]:
          res[k].push({
            x: _month,
            y: round(
              chunk.reduce(
                (_total, _curr) =>
                  (_total += positiveTypes.includes(_curr.txn_type)
                    ? Number(_curr.amount)
                    : -Number(_curr.amount)),
                0
              ),
              2
            ),
          });
          break;

        case BASE_LABELS[1]:
          res[k].push({
            x: _month,
            y: round(
              chunk.reduce(
                (_total, _curr) =>
                  (_total += negativeTypes.includes(_curr.txn_type)
                    ? Number(_curr.amount)
                    : 0),
                0
              ),
              2
            ),
          });
          break;

        default:
          if (!(k in res)) {
            res[k] = [];
          }
          let _chunk: ExpenditureTableType[] = [];
          if (k.includes('/')) {
            _chunk = chunk.filter(
              (v) =>
                v.name.toLowerCase() === k.substring(1) &&
                negativeTypes.includes(v.txn_type)
            );
            res[k].push({
              x: _month,
              y: round(
                _chunk.reduce((total, curr) => total + Number(curr.amount), 0),
                2
              ),
            });
          } else {
            _chunk = chunk.filter(
              (v) => v.category === k && negativeTypes.includes(v.txn_type)
            );
            res[k].push({
              x: _month,
              y: round(
                _chunk.reduce((total, curr) => total + Number(curr.amount), 0),
                2
              ),
            });
          }

          break;
      }
    });
  });

  const _res = Object.keys(res).map((v, index) => ({
    id: v,
    data: res[v],
    color:
      v === 'spending'
        ? '#fa0690'
        : v === 'savings'
        ? '#128795'
        : COLORS[(index - 2) % COLORS.length],
  }));

  return _res;
}

export default () => {
  const db = useSelector((state: State) => state.database);

  type ChartData = {
    id: string;
    data: { x: string; y: number }[];
    color?: string;
  };
  const [darkMode] = useAtom(darkModeAtom);
  const [selectedId, setSelectedId] = useState<string>('all');
  const [categoryIds, setCategoryIds] = useState<string[]>(() => []);
  const [nameIds, setNameIds] = useState<string[]>(() => []);
  const [data, setData] = useState<ChartData[]>();
  const [selectedMonth, setSelectedMonth] = useState(6);

  const overallSavings = useLiveQuery(async () => {
    const paydays = [
      ...(
        await db.expenditure.where({ txn_type: TransactionTypes.SALARY }).toArray()
      ).map((e) => e.datetime),
      dayjs().unix(),
    ].filter((payday) => payday > dayjs().subtract(selectedMonth, 'month').unix());
    if (paydays.length < 2) return [] as ChartData[];

    const allRecurring = calculateRecurring(
      await db.recurring.where('start').belowOrEqual(dayjs().unix()).toArray(),
      paydays[0],
      dayjs().unix()
    );

    const allExpenditure = await db.expenditure.toArray();

    const _names = uniq((await db.expenditure.toArray()).map((val) => val.category));

    const _subKeys = uniq(
      (await db.expenditure.toArray()).map((val) => `/${val.name.toLowerCase()}`)
    );

    const _all = sortBy([...allExpenditure, ...allRecurring], ['datetime']);

    const res = dateChunker(
      paydays,
      ['spending', 'savings'].concat(_names).concat(_subKeys),
      _all
    );

    return res;
  }, [selectedMonth]);

  const names = useLiveQuery(async () => {
    return (await db.expenditure.toArray())
      .filter((val) => negativeTypes.includes(val.txn_type))
      .reduce((total, val) => {
        let tmp = total;
        let item = total.find((v) => v.name === val.category);

        if (item === undefined) {
          tmp.push({
            name: val.category,
            count: Number(val.amount),
          });
        } else {
          let index = total.indexOf(item);
          tmp[index] = { ...item, count: item.count + Number(val.amount) };
        }

        return total;
      }, [] as { name: string; count: number }[])
      .sort((a, b) => b.count - a.count)
      .map((val) => val.name);
  });

  const subNames = useLiveQuery(async () => {
    return uniq(
      (await db.expenditure.toArray())
        .filter(
          (val) =>
            negativeTypes.includes(val.txn_type) && categoryIds.includes(val.category)
        )
        .reduce((total, val) => {
          let tmp = total;
          let item = total.find((v) => v.name === val.name);

          if (item === undefined) {
            tmp.push({
              name: val.name,
              count: Number(val.amount),
            });
          } else {
            let index = total.indexOf(item);
            tmp[index] = { ...item, count: item.count + Number(val.amount) };
          }

          return total;
        }, [] as { name: string; count: number }[])
        .sort((a, b) => b.count - a.count)
        .map((val) => `/${val.name.toLowerCase()}`)
    );
  }, [categoryIds]);

  const elapsedMonths = useLiveQuery(async () => {
    const _min = (await db.expenditure.orderBy('datetime').first())?.datetime;
    const _max = (await db.expenditure.orderBy('datetime').last())?.datetime;
    if (_min === undefined || _max === undefined) return 12;
    return dayjs.unix(_max).diff(dayjs.unix(_min), 'month') + 1;
  });

  useEffect(() => {
    setData(
      overallSavings?.filter((val) => {
        switch (selectedId) {
          case 'all':
            return BASE_LABELS.includes(val.id);
          case 'spending':
            if (categoryIds.length === 0) return val.id === 'spending';
            if (nameIds.length === 0) return categoryIds.includes(val.id);
            return nameIds.includes(val.id);
          default:
            return val.id === selectedId;
        }
      }) as ChartData[]
    );
  }, [selectedId, overallSavings, categoryIds, nameIds]);

  return (overallSavings || []).length === 0 ? (
    <></>
  ) : (
    <Box sx={{ width: '80vw', textAlign: 'center' }}>
      <Typography variant="h6">Overall Savings and Spending</Typography>

      <TextField
        size="small"
        label="Last number of months"
        select
        fullWidth
        sx={{ color: darkMode ? 'white' : 'black', mt: 2, mb: 2 }}
        onChange={(e) => setSelectedMonth(Number(e.target.value))}
      >
        {Array.from({ length: elapsedMonths || 12 }, (_, i) => i + 1).map((i) => (
          <MenuItem value={i} key={`age-selector-${i}`}>
            {i}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={omit(chartContainerStyle, ['m'])}>
        <ResponsiveLine
          data={(data || []) as Serie[]}
          margin={{ top: 10, right: 10, bottom: 50, left: 50 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
          }}
          theme={{
            axis: {
              legend: { text: { fill: darkMode ? '#939393' : '#000' } },
              ticks: { text: { fill: darkMode ? '#939393' : '#000' } },
            },
          }}
          colors={(d) => d.color}
          yFormat=" >-.2f"
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          tooltip={(e) => (
            <FunkyTooltip>
              <Typography>{(e.point.serieId as string).replace('/', '')}</Typography>
              <Typography>
                {e.point.data.x}: {e.point.data.y}
              </Typography>
            </FunkyTooltip>
          )}
        />
      </Box>

      <ToggleButtonGroup
        exclusive
        value={selectedId}
        onChange={(_e, val) => {
          setCategoryIds([]);
          if (val !== null) {
            setSelectedId(val);
          }
        }}
      >
        {BASE_LABELS.concat('all').map((val) => (
          <ToggleButton size="small" value={val} color="primary">
            {val}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Box style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {names !== undefined && selectedId === 'spending' && (
          <ToggleButtonGroup
            value={categoryIds}
            onChange={(e, _categoryIds) => setCategoryIds(_categoryIds)}
            color="primary"
          >
            {names?.map((name) => (
              <ToggleButton size="small" value={name}>
                {name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      </Box>

      <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {subNames !== undefined && subNames.length > 0 && (
          <ToggleButtonGroup
            value={nameIds}
            onChange={(e, names) => setNameIds(names)}
            color="primary"
          >
            {subNames?.map((name) => (
              <ToggleButton size="small" value={name}>
                {name.substring(1)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      </Box>
    </Box>
  );
};
