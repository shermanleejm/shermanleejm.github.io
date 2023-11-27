import { getDateNumbers } from '@/components/ExpenditureTracker/Input';
import { calculateRecurring } from '@/components/ExpenditureTracker/Input/BigNumbers';
import { db, FormCategories, TransactionTypes } from '@/database';
import { HotTable } from '@handsontable/react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Table as MUITable,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import _ from 'lodash';
import { useEffect, useRef } from 'react';

export default function Breakdown() {
  const hotRef = useRef<HotTable>(null);
  const { startDate, endDate } = getDateNumbers();
  const data =
    useLiveQuery(async () => {
      const currentMonth = await db.expenditure
        .where(FormCategories.datetime)
        .between(startDate, endDate || Infinity, true, true)
        .toArray();

      const currentMonthRecurring = calculateRecurring(
        await db.recurring.toArray(),
        startDate,
        endDate
      );

      const grouped = _([...currentMonth, ...currentMonthRecurring])
        .filter((val) => val.txn_type === TransactionTypes.CREDIT)
        .groupBy(FormCategories.category)
        .mapValues((x) => _(x).sortBy('amount').reverse().value())
        .toPairs()
        .sortBy((x) => _(x[1]).sumBy('amount'))
        .reverse()
        .map(([category, __children]) => ({
          name: category,
          amount: _.sumBy(__children, 'amount').toFixed(2),
          __children: _(__children)
            .map(_.partialRight(_.pick, ['name', 'amount']))
            .groupBy('name')
            .mapValues((x: { name: string; amount: number }[]) => ({
              name: x[0].name,
              amount: _.sumBy(x, 'amount').toFixed(2),
            }))
            .values()
            .value(),
        }))
        .value();

      return grouped;
    }, [startDate, endDate]) || [];
  const isLoading = data === null || data.length === 0;

  return (
    <div
      style={{
        width: '90vw',
        // overflow: 'auto',
      }}
    >
      {data.map((row) => (
        <Accordion>
          <AccordionSummary>
            <Grid container justifyContent={'space-between'}>
              <Grid item>{row.name}:</Grid>
              <Grid item>{row.amount}</Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <MUITable>
                {(row.__children as unknown as { name: string; amount: string }[]).map(
                  (x) => (
                    <TableRow>
                      <TableCell>{x.name}</TableCell>
                      <TableCell>{x.amount}</TableCell>
                    </TableRow>
                  )
                )}
              </MUITable>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );

  function Table() {
    useEffect(() => {
      const collapsingUI = (hotRef.current?.hotInstance?.getPlugin('nestedRows') as any)
        ?.collapsingUI;
      const collapseAll = collapsingUI?.__proto__?.collapseAll.bind(collapsingUI);
      if (collapseAll) {
        collapseAll();
      }
    }, [isLoading]);

    return (
      <HotTable
        data={data || []}
        width="100%"
        height="auto"
        stretchH="all"
        rowHeaderWidth={10}
        rowHeaders={() => ''}
        contextMenu={true}
        colHeaders={['Name', 'Amount']}
        bindRowsWithHeaders
        nestedRows
        licenseKey="non-commercial-and-evaluation"
      />
    );
  }
}
