import {
  Autocomplete,
  Box,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import _, { omit, uniq } from 'lodash';
import { useEffect, useState } from 'react';
import hash from 'object-hash';
import {
  DAYJS_FORMAT,
  recalculateData,
  STARTING_MONTHS,
  useAllDB,
} from '@/components/ExpenditureTracker/Insights/helper';
import {
  chartContainerStyle,
  FunkyTooltip,
} from '@/components/ExpenditureTracker/Insights';
import { ResponsiveLine } from '@nivo/line';
import { darkModeAtom } from '@/App';
import { useAtom } from 'jotai';

export default function () {
  const [darkMode] = useAtom(darkModeAtom);
  const ALL_DB = useAllDB();
  const ALL_TAGS = uniq(
    ALL_DB.reduce((a, b) => [...a, ...JSON.parse(b.category)], [] as string[])
  );

  type DataType = {
    data: any;
    tags: string[];
    dates: string[];
    months: number;
  };
  const [state, setState] = useState<DataType>({
    data: [],
    tags: [],
    dates: new Array(STARTING_MONTHS)
      .fill('')
      .map((_val, i) => dayjs().subtract(i, 'month').format(DAYJS_FORMAT))
      .reverse(),
    months: STARTING_MONTHS,
  });

  function reducer({ type, payload }: { type: keyof DataType; payload: any }) {
    const newState = (() => {
      switch (type) {
        case 'tags':
          return {
            ...state,
            tags: payload,
            data: recalculateData({ tags: payload, dates: state.dates, ALL_DB }),
          };
        case 'months':
          const dates = new Array(payload)
            .fill('')
            .map((_val, i) => dayjs().subtract(i, 'month').format(DAYJS_FORMAT))
            .reverse();
          return {
            ...state,
            months: payload,
            dates,
            data: recalculateData({ tags: state.tags, dates, ALL_DB }),
          };
        default:
          return state;
      }
    })();

    setState(newState);
  }

  useEffect(() => {
    reducer({
      type: 'data',
      payload: recalculateData({ tags: state.tags, dates: state.dates, ALL_DB }),
    });
  }, [hash(ALL_DB)]);

  return (
    <Box sx={{ width: '80vw', textAlign: 'center' }}>
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Typography variant="h6">Overall Savings and Spending</Typography>
        </Grid>
        <Grid item>
          <Autocomplete
            multiple
            id="tags-standard"
            options={ALL_TAGS}
            value={state.tags}
            onChange={(_e, payload) => reducer({ type: 'tags', payload })}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                variant="outlined"
                label="Categories"
                placeholder="Categories"
              />
            )}
          />
        </Grid>
        <Grid item>
          <Select
            fullWidth
            size="small"
            variant="outlined"
            value={state.months}
            onChange={(e) => reducer({ type: 'months', payload: e.target.value })}
          >
            <MenuItem value={4}>Less</MenuItem>
            <MenuItem value={STARTING_MONTHS}>Normal</MenuItem>
            <MenuItem value={11}>More</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          {state.tags.length > 0 ? (
            <Box sx={omit(chartContainerStyle, ['m'])}>
              <ResponsiveLine
                data={state.data}
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
                // colors={(d) => d.color}
                yFormat=" >-.2f"
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                tooltip={(e) => (
                  <FunkyTooltip>
                    <Typography>
                      {(e.point.serieId as string).replace('/', '')}
                    </Typography>
                    <Typography>
                      {e.point.data.x}: {e.point.data.y}
                    </Typography>
                  </FunkyTooltip>
                )}
              />
            </Box>
          ) : (
            <Box>Please choose some filters</Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
