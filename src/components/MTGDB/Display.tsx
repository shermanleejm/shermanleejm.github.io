import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { MTGDBProps } from '.';
import { CardsTableType } from '../../database';

const Display = (props: MTGDBProps) => {
  const [cards, setCards] = useState<CardsTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toDelete, setToDelete] = useState<CardsTableType[]>([]);
  const [dialogState, setDialogState] = useState(false);

  const colWidth = (window.innerWidth * 0.8) / 3;

  useEffect(() => {
    function updateCards() {
      setCards(props.cardArr);
      setIsLoading(false);
    }

    updateCards();
  }, [isLoading, props.cardArr]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: colWidth },
    { field: 'cmc', headerName: 'Converted Mana Cost', width: colWidth },
    {
      field: 'price',
      headerName: 'Price',
      width: colWidth,
      valueFormatter: (params: GridValueFormatterParams) => {
        return `$${params.value}`;
      },
    },
    { field: 'color', headerName: 'Colours', width: colWidth },
  ];

  type SortType = {
    key: string;
    order: boolean;
    checked: boolean;
  };

  const [checkboxValues, setCheckboxValues] = useState<{ [key: string]: SortType }>({
    name: { key: 'name', order: false, checked: false },
    price: { key: 'price', order: false, checked: false },
    cmc: { key: 'cmc', order: false, checked: false },
  });
  const sortNames = ['name', 'price', 'cmc'];

  function dynamicSort(property: SortType) {
    let first = property.order ? 1 : -1;
    let second = property.order ? -1 : 1;
    return function (obj1: any, obj2: any) {
      return obj1[property.key] > obj2[property.key]
        ? first
        : obj1[property.key] < obj2[property.key]
        ? second
        : 0;
    };
  }

  function dynamicSortMultiple(props: SortType[]) {
    return function (obj1: any, obj2: any) {
      var i = 0,
        result = 0,
        numberOfProperties = props.length;
      while (result === 0 && i < numberOfProperties) {
        result = dynamicSort(props[i])(obj1, obj2);
        i++;
      }
      return result;
    };
  }

  async function deleteCards() {
    setIsLoading(true);
    for (let i = 0; i < toDelete.length; i++) {
      await props.db.cards.delete(toDelete[i].id ?? -1);
    }
    props.refresh(true);
    setIsLoading(false);
  }

  function closeDialog() {
    setDialogState(false);
    setToDelete([]);
    setIsLoading(true);
    props.refresh(true);
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Box>
      <Grid
        container
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        {/* Filter Section */}
        {/* <Grid item>Advanced Sort</Grid>
        <Grid item style={{ textAlign: 'center', width: '80vw' }}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {sortNames.map((k) => {
              return (
                <Grid item xs={4}>
                  <FormControlLabel
                    label={k}
                    control={<Checkbox checked={checkboxState(k)} onChange={() => {}} />}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid> */}

        {/* Data Grid */}
        <Grid item style={{ width: '80vw' }}>
          <div
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                sx={{
                  '& .u-text': { backgroundColor: '#2C458B', color: 'white' },
                  '& .b-text': { backgroundColor: '#3C0C5D', color: 'white' },
                  '& .r-text': { backgroundColor: '#731421', color: 'white' },
                  '& .w-text': { backgroundColor: '#D99836', color: 'black' },
                  '& .g-text': { backgroundColor: '#2A6438', color: 'white' },
                }}
                rows={cards}
                columns={columns}
                autoHeight
                checkboxSelection
                onSelectionModelChange={(ids) => {
                  let selectedIds = new Set(ids);
                  let selectedRows = cards.filter((card) =>
                    selectedIds.has(card.id ?? -1)
                  );
                  setToDelete(selectedRows);
                }}
                getCellClassName={(params: GridCellParams<number>) => {
                  if (params.field === 'name' && params.row.colors.length > 0) {
                    return params.row.colors[0].toLowerCase() + '-text';
                  }
                  return '';
                }}
              />
            </div>
          </div>
        </Grid>
        <Grid item>
          <Button onClick={() => setDialogState(true)}>delete selected</Button>
        </Grid>
      </Grid>

      {/* Dialog */}
      <Dialog onClose={deleteCards} open={dialogState}>
        <DialogTitle>Confirm delete?</DialogTitle>
        <List>
          {toDelete.map((card) => (
            <ListItem>
              <ListItemText primary={card.name} />
            </ListItem>
          ))}
        </List>
        <DialogActions>
          <Button
            onClick={() => {
              deleteCards();
              closeDialog();
            }}
          >
            Confirm
          </Button>
          <Button onClick={() => closeDialog()}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Display;
