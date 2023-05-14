import { State } from '@/state/reducers';
import { Grid, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'handsontable/dist/handsontable.full.min.css';
import { registerAllModules } from 'handsontable/registry';
import { HotTable } from '@handsontable/react';
import HyperFormula from 'hyperformula';
import { cloneDeep, concat } from 'lodash';
import { atomWithStorage } from 'jotai/utils';
import { useAtom } from 'jotai';
import { Box } from '@mui/system';
import { ReactNode, useEffect } from 'react';
import { CellMeta, CellProperties } from 'handsontable/settings';
import Core from 'handsontable/core';
import { textRenderer } from 'handsontable/renderers';

registerAllModules();

const hyperformulaInstance = HyperFormula.buildEmpty({
  licenseKey: 'internal-use-in-handsontable',
});

const initialData = {
  startDate: dayjs().toString(),
  endDate: dayjs().add(1, 'M').toString(),
  expenditure: [['Line item name', 'Amount']] as any[][],
  income: [['Line item name', 'Amount']] as any[][],
  total: [['Total', `=sum(income!B1:B9999) - sum(expenditure!B1:B9999)`]],
};

type InitialDataKey = keyof typeof initialData;

const dataAtom = atomWithStorage('dataAtom', initialData);

export default () => {
  const db = useSelector((state: State) => state.database);
  const [data, setData] = useAtom(dataAtom);

  useEffect(() => {
    if (data.total.length > 1) {
      setData({ ...data, total: initialData.total });
    }
  }, []);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ width: '90vw' }}
      spacing={1}
    >
      <Grid item xs={6}>
        <BasicDatePicker value={data.startDate} label="Start Date" dataKey="startDate" />
      </Grid>
      <Grid item xs={6}>
        <BasicDatePicker value={data.endDate} label="End Date" dataKey="endDate" />
      </Grid>
      <Grid item xs={12}>
        <CustomHotTable
          data={data.expenditure}
          reducerKey="expenditure"
          updateData={reducer}
        />
      </Grid>
      <Grid item xs={12}>
        <CustomHotTable data={data.income} reducerKey="income" updateData={reducer} />
      </Grid>
      <Grid item xs={12}>
        <CustomHotTable
          data={data.total}
          reducerKey="total"
          updateData={reducer}
          minSpareRows={0}
          rowHeaders={false}
          readOnly={true}
        />
      </Grid>
    </Grid>
  );

  function reducer(action: { type: InitialDataKey; payload: any }) {
    const { type, payload } = action;
    const debouncedSetData = setData;

    switch (action.type) {
      case 'startDate':
      case 'endDate':
      case 'expenditure':
      case 'income':
        debouncedSetData({ ...data, [type]: payload });
        break;
      default:
        break;
    }
  }

  function BasicDatePicker({
    dataKey,
    label,
    value,
  }: {
    dataKey: InitialDataKey;
    label: string;
    value: string;
  }) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          inputFormat="DD MMM YYYY"
          label={label}
          onChange={(val) => reducer({ type: dataKey, payload: val })}
          value={dayjs(value)}
          renderInput={(params) => <TextField fullWidth {...params} />}
        />
      </LocalizationProvider>
    );
  }

  function CustomHotTable({
    reducerKey,
    data,
    updateData,
    minSpareRows = 1,
    rowHeaders = true,
    readOnly = false,
  }: {
    reducerKey: InitialDataKey;
    data: any[][];
    updateData: typeof reducer;
    minSpareRows?: number;
    rowHeaders?: boolean;
    readOnly?: boolean;
  }) {
    function firstRowRenderer(
      instance: Core,
      td: HTMLTableCellElement,
      row: number,
      col: number,
      prop: string | number,
      value: any,
      cellProperties: CellProperties
    ) {
      // @ts-ignore
      textRenderer.apply(this, arguments);
      td.style.fontWeight = 'bold';
      td.style.color = (() => {
        switch (reducerKey) {
          case 'expenditure':
            return 'red';
          case 'income':
            return 'green';
          case 'total':
          default:
            return 'black';
        }
      })();
      td.style.textAlign = 'center';
    }
    return (
      <Box sx={{ width: '90vw' }}>
        <HotTable
          stretchH="all"
          width="100%"
          data={data}
          rowHeaders={rowHeaders}
          minSpareRows={minSpareRows}
          readOnly={readOnly}
          licenseKey="non-commercial-and-evaluation"
          formulas={{
            engine: hyperformulaInstance,
            // @ts-ignore
            sheetName: reducerKey,
          }}
          cells={(row, col) => {
            const cellProperties: CellMeta = {};
            if (row === 0) {
              cellProperties.readOnly = true;
              cellProperties.renderer = firstRowRenderer;
            }
            return cellProperties;
          }}
          beforeChange={(changes) => {
            let tmp = cloneDeep(data);
            changes.forEach((change) => {
              if (change === null) return;
              const [row, col, oldVal, newVal] = change;
              console.log({ row, col, oldVal, newVal });
              if (row > data.length) {
                concat(tmp, new Array(data.length - row).fill(''));
              }
              if (typeof col === 'number') {
                tmp[row][col] = newVal;
              }
            });
            updateData({ type: reducerKey, payload: tmp });
          }}
        />
      </Box>
    );
  }
};
