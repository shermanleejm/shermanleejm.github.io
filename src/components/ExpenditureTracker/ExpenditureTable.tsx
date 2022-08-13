import { Box, Grid, IconButton } from '@mui/material';
import {
  DataGrid,
  GridCellEditCommitParams,
  GridColDef,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { FormCategories } from '../../database';
import { useLiveQuery } from 'dexie-react-hooks';

const ExpenditureTable = () => {
  const db = useSelector((state: State) => state.database);
  const [tableHeight, setTableHeight] = useState(300);

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
          <Box
            sx={{
              width: '80vw',
              height: tableHeight,
              '& .credit': { bgcolor: 'green' },
              '& .debit': { bgcolor: 'red' },
            }}
          >
            <DataGrid
              onCellEditCommit={handleRowEdit}
              disableSelectionOnClick={true}
              columns={columns}
              rows={data || []}
              getRowClassName={(params) =>
                params.row[FormCategories.isCredit] ? `credit` : `debit`
              }
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default ExpenditureTable;
