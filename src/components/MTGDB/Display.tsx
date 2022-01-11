import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { CardsTableType } from '../../database';

const Display = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<CardsTableType[]>([]);
  const db = useSelector((state: State) => state.database);

  useEffect(() => {
    async function loadCards() {
      setCards(await db.cards.toArray());
      console.log(await db.cards.toArray());
      setIsLoading(false);
    }

    loadCards();
  }, [isLoading, db]);

  const rows: GridRowsProp = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 3, col1: 'MUI', col2: 'is Amazing' },
  ];

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 300 },
    {
      field: 'price',
      headerName: 'Price',
      width: 300,
      valueFormatter: (params: GridValueFormatterParams) => {
        return `$${params.value}`;
      },
    },
  ];

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Grid container direction={'row'} justifyContent={'center'} alignItems={'center'}>
      <Grid item style={{ width: '80vw' }}>
        <div
          style={{
            height: 300,
            width: '100%',
          }}
        >
          <DataGrid rows={cards} columns={columns} />
        </div>
      </Grid>
    </Grid>
  );
};

export default Display;
