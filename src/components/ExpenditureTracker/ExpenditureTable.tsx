import { Button, Grid, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { FormCategories } from '../../database';
import { useLiveQuery } from 'dexie-react-hooks';
import { Resizable } from 're-resizable';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { downloadFile } from '../Helpers';

const ExpenditureTable = () => {
  const db = useSelector((state: State) => state.database);
  const tableWidth = '90vw';
  const [tableHeight, setTableHeight] = useState(220);
  const [easterEggCounter, setEasterEggCounter] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string>('');

  const data = useLiveQuery(async () => {
    return db.expenditure.toArray();
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
    { field: 'category', editable: true },
    { field: 'name', editable: true },
    { field: 'amount', editable: true },
    {
      field: 'delete',
      renderCell: (params: any) => {
        return (
          <IconButton
            onClick={async () => {
              await db.expenditure.delete(params.row.id);
            }}
          >
            <DeleteForeverIcon />
          </IconButton>
        );
      },
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
            '& .credit': { bgcolor: 'green' },
            '& .debit': { bgcolor: 'red' },
          }}
          onCellEditCommit={handleRowEdit}
          disableSelectionOnClick={true}
          columns={columns}
          rows={data || []}
          getRowClassName={(params) =>
            params.row[FormCategories.isCredit] ? `credit` : `debit`
          }
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
          <Typography
            variant="subtitle2"
            onClick={() => setEasterEggCounter(easterEggCounter + 1)}
          >
            *psst this table is resizable
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={() => downloadFile(data, `expenditure`)}
          >
            export
          </Button>
          {easterEggCounter > 10 && (
            <>
              <Button
                onClick={() => {
                  db.expenditure.clear().then(() => {
                    db.expenditure.bulkAdd(JSON.parse(uploadedFile));
                  });
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
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ExpenditureTable;
