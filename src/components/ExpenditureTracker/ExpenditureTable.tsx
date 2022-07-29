import { Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ExpenditureTableType } from '../../database';
import { State } from '../../state/reducers';

const ExpenditureTable = () => {
  const db = useSelector((state: State) => state.database);

  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().startOf('month').unix(),
    endDate: dayjs().unix(),
  });
  const [data, setData] = useState<Array<ExpenditureTableType>>([]);

  const columns: GridColDef[] = [
    {
      field: 'datetime',
      valueGetter: (params: GridValueGetterParams) =>
        `${dayjs.unix(params.row.datetime).format('YYYY MMM DD')}`,
    },
    { field: 'category' },
    { field: 'name' },
    { field: 'amount' },
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
              <DataGrid columns={columns} rows={data} />
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ExpenditureTable;
