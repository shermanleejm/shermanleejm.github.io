import { Grid, IconButton, Typography } from '@mui/material';
import {
  DataGrid,
  GridCellEditCommitParams,
  GridColDef,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { FormCategories } from '../../database';
import { useLiveQuery } from 'dexie-react-hooks';
import { Resizable } from 're-resizable';

const ExpenditureTable = () => {
  const db = useSelector((state: State) => state.database);
  const tableWidth = '90vw';
  const [tableHeight, setTableHeight] = useState(220);

  const data = useLiveQuery(async () => {
    return db.expenditure.toArray();
  });

  const handleRowEdit = useCallback((params: GridCellEditCommitParams) => {
    console.log(params);
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'datetime',
      valueGetter: (params: GridValueGetterParams) =>
        `${dayjs.unix(params.row.datetime).format('YYYY MMM DD')}`,
    },
    { field: 'category', editable: true },
    { field: 'name' },
    { field: 'amount' },
    {
      field: 'delete',
      renderCell: (params: GridValueGetterParams) => {
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
      <Grid container justifyContent={'center'} alignItems={'center'}>
        <Grid item>
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
                      sort: 'desc'
                    }
                  ]
                }
              }}
            />
          </Resizable>
          <Typography variant="subtitle2">*psst this table is resizable</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default ExpenditureTable;
