import { Grid, IconButton } from '@mui/material';
import {
  DataGrid,
  GridCellEditCommitParams,
  GridColDef,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ExpenditureTableType } from '../../database';
import { State } from '../../state/reducers';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const ExpenditureTable = () => {
  const db = useSelector((state: State) => state.database);

  const [isLoading, setIsLoading] = useState(true);
  const [nonce, setNonce] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().startOf('month').unix(),
    endDate: dayjs().unix(),
  });
  const [data, setData] = useState<Array<ExpenditureTableType>>([]);

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
          <IconButton>
            <DeleteForeverIcon />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    async function getData() {
      let tmp = await db.expenditure
        .where('datetime')
        .between(dateRange.startDate, dateRange.endDate)
        .toArray();
      console.log(JSON.stringify(tmp));
      setData(tmp);
      setIsLoading(false);
    }

    getData();
  }, []);

  return (
    <div>
      <Grid container justifyContent={'center'} alignItems={'center'}>
        <Grid item>
          {!isLoading && (
            <div style={{ width: '90vw', height: '35vh' }}>
              <DataGrid
                onCellEditCommit={handleRowEdit}
                disableSelectionOnClick={true}
                columns={columns}
                rows={data}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ExpenditureTable;
