import { darkModeAtom } from '@/App';
import {
  FunkyTooltip,
  chartContainerStyle,
} from '@/components/ExpenditureTracker/Insights';
import { ExpenditureTableType, FormCategories, TransactionTypes, db } from '@/database';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { atom, useAtom } from 'jotai';
import _ from 'lodash';
import objectHash from 'object-hash';

const categoryFilters = atom<string[]>([]);

export default function OverallFiltering() {
  const [darkMode] = useAtom(darkModeAtom);
  const [filters, updateFilters] = useAtom(categoryFilters);
  const { data, tags } = useLiveQuery(async () => {
    const currentRange = (
      await db.expenditure
        .where(FormCategories.datetime)
        .between(dayjs().subtract(6, 'months').unix(), dayjs().unix(), true, true)
        .toArray()
    ).filter((row) => row.txn_type === TransactionTypes.CREDIT);

    const tags = _(currentRange)
      .countBy(FormCategories.category)
      .toPairs()
      .sortBy(1)
      .reverse()
      .map((row) => row[0])
      .value();

    const data = _(currentRange)
      .filter((row) => filters.includes(row[FormCategories.category]))
      .value();

    return { data, tags };
  }, [objectHash(filters)]) || { data: [], tags: [] };
  console.log(convertData(data));
  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6">Last 6 months</Typography>
      <Autocomplete
        size="small"
        multiple
        clearOnEscape
        freeSolo
        autoSelect
        autoComplete
        options={tags}
        sx={{ width: '80vw' }}
        value={filters}
        onChange={(_e, val) => updateFilters(val as string[])}
        renderInput={(params) => <TextField {...params} label="Source" />}
      />
      {data.length === 0 ? (
        <></>
      ) : (
        <Box sx={_.omit(chartContainerStyle, ['m'])}>
          <ResponsiveLine
            data={convertData(data)}
            margin={{ top: 50, right: 40, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: true,
              reverse: false,
            }}
            theme={{
              axis: {
                legend: { text: { fill: darkMode ? '#939393' : '#000' } },
                ticks: { text: { fill: darkMode ? '#939393' : '#000' } },
              },
            }}
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
      )}
    </div>
  );
}

function convertData(data: ExpenditureTableType[]) {
  return _(data)
    .map((row) => ({
      ...row,
      datetime: dayjs.unix(row.datetime).format('MMM YY'),
    }))
    .groupBy(FormCategories.category)
    .mapValues((value) =>
      _(value)
        .groupBy(FormCategories.datetime)
        .mapValues((v) => _.sumBy(v, (r) => r.amount as number))
        .toPairs()
        .map((row) => ({ x: row[0], y: row[1] }))
        .sortBy((row) => dayjs(row.x, 'MMM YY'))
        .value()
    )
    .toPairs()
    .map((row) => ({ id: row[0], data: row[1] }))
    .value();
}
