import { Button, Chip, Grid, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from '@/state/reducers';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { FormCategories, TransactionTypes } from '@/database';
import { useLiveQuery } from 'dexie-react-hooks';
import { Resizable } from 're-resizable';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { downloadFile } from '@/components/Helpers';
import { calculateRecurring } from '@/components/ExpenditureTracker/Input/BigNumbers';
import { sortBy } from 'lodash';

const ExpenditureTable = () => {
  const db = useSelector((state: State) => state.database);
  const tableWidth = '90vw';
  const [tableHeight, setTableHeight] = useState(400);
  const [easterEggCounter, setEasterEggCounter] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string>('');

  const data = useLiveQuery(async () => {
    const normalExpenditure = await db.expenditure.toArray();

    let { minDate, maxDate } = normalExpenditure.reduce(
      (dates, curr) => {
        return {
          minDate: Math.min(curr.datetime, dates.minDate),
          maxDate: Math.max(curr.datetime, dates.maxDate),
        };
      },
      { minDate: Infinity, maxDate: 0 }
    );

    const maxId = normalExpenditure.reduce((id, curr) => Math.max(id, curr.id || 0), 0);

    const monthlyRecurring = calculateRecurring(
      await db.recurring.where('start').belowOrEqual(maxDate).toArray(),
      minDate,
      maxDate
    ).map((val, index) => ({ ...val, id: maxId + index }));

    return sortBy([...normalExpenditure, ...monthlyRecurring], ['datetime']);
  });

  const handleRowEdit = useCallback((params: any) => {
    let id = params.row.id;
    let field = params.field;
    let newValue = params.value;
    db.expenditure
      .update(id, { [field]: field === 'amount' ? parseFloat(newValue) : newValue })
      .then()
      .finally();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'datetime',
      renderCell: (params: any) => {
        return `${dayjs.unix(params.row.datetime).format('YYYY MMM DD')}`;
      },
    },
    {
      field: 'category',
      editable: true,
      renderCell: (params: any) => {
        let chips: string[] = [];
        try {
          chips = JSON.parse(params.row.category);
        } catch (e) {
          console.error(e);
        }
        return (
          <>
            {chips.map((c) => (
              <Chip label={c} />
            ))}
          </>
        );
      },
    },
    { field: 'credit_card' },
    { field: 'name', editable: true },
    { field: 'amount', editable: true },
    {
      field: 'delete',
      renderCell: (params: any) => {
        return (
          <IconButton
            onClick={async () => {
              if (params.row.recurringId) {
                await db.recurring.delete(params.row.recurringId);
              } else {
                await db.expenditure.delete(params.row.id);
              }
            }}
          >
            <DeleteForeverIcon />
          </IconButton>
        );
      },
    },
    {
      field: 'txn_type',
    },
  ];

  return (
    <div>
      <Resizable
        size={{ width: tableWidth, height: tableHeight }}
        onResizeStop={(e, direction, ref, d) => {
          setTableHeight(tableHeight + d.height);
        }}
        minWidth={tableWidth}
        maxWidth={tableWidth}
        minHeight={220}
      >
        <DataGrid
          sx={{
            [`& .${TransactionTypes.DEBIT}`]: { bgcolor: 'green' },
            [`& .${TransactionTypes.CREDIT}`]: { bgcolor: 'red' },
            [`& .${TransactionTypes.SALARY}`]: { bgcolor: 'blue' },
            [`& .${TransactionTypes.RECURRING}`]: { bgcolor: 'orange', color: 'grey' },
          }}
          onCellEditCommit={handleRowEdit}
          disableSelectionOnClick={true}
          columns={columns}
          rows={data || []}
          getRowClassName={(params) => params.row[FormCategories.transactionType]}
          initialState={{
            sorting: {
              sortModel: [
                {
                  field: 'datetime',
                  sort: 'desc',
                },
              ],
            },
          }}
        />
      </Resizable>

      <Grid
        style={{ width: '100%' }}
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid item>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={async () => {
              const expenditure = await db.expenditure.toArray();
              const recurring = await db.recurring.toArray();
              downloadFile({ expenditure, recurring }, `expenditure`);
            }}
          >
            export
          </Button>
        </Grid>
        <Grid item>
          <Typography
            variant="subtitle2"
            onClick={() => setEasterEggCounter(easterEggCounter + 1)}
          >
            *psst this table is resizable
          </Typography>
        </Grid>
      </Grid>

      {easterEggCounter >= 10 && (
        <div>
          <Button
            size="small"
            onClick={() => {
              const parsedUploadedFile = JSON.parse(uploadedFile) as {
                expenditure: any;
                recurring: any;
              };
              if ('expenditure' in parsedUploadedFile) {
                db.expenditure.clear().then(() => {
                  db.expenditure.bulkAdd(parsedUploadedFile.expenditure);
                });
              }
              if ('recurring' in parsedUploadedFile) {
                db.recurring.clear().then(() => {
                  db.recurring.bulkAdd(parsedUploadedFile.recurring);
                });
              }
            }}
          >
            upload
          </Button>
          <input
            type="file"
            accept="application/json"
            onChange={(e) => {
              let fileReader = new FileReader();
              if (e.target.files !== null) {
                fileReader.readAsText(e.target.files[0], 'UTF-8');
                fileReader.onload = (e: any) => {
                  setUploadedFile(e.target?.result);
                };
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ExpenditureTable;
