import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import React, { memo, useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  styled,
  TextField,
  Tooltip,
  TooltipProps,
  Typography,
} from '@mui/material';
import { CardsTableType } from '../../database';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';

const CardDataGrid = () => {
  const [cards, setCards] = useState<CardsTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCards, setSelectedCards] = useState<CardsTableType[]>([]);
  const [totalPrice, setTotalPrice] = useState(-1);
  const [deleteDialogState, setDeleteDialogState] = useState(false);
  const [calculateDialogState, setCalculateDialogState] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('colors');
  const [memoCards, setMemoCards] = useState<CardsTableType[]>([]);
  const [uniqueTags, setUniqueTags] = useState<string[]>();
  const [uniqueSets, setUniqueSets] = useState<string[]>();

  const colWidth = (window.innerWidth * 0.8) / 4;
  const db = useSelector((state: State) => state.database);

  useEffect(() => {
    function updateCards() {
      db.cards
        .toArray()
        .then((arr) => {
          setCards(arr);
          setMemoCards(arr);
          let uTags = new Set<string>();
          let uSets = new Set<string>();
          let dict: Set<string> = new Set();
          for (let i = 0; i < arr.length; i++) {
            let curr = arr[i];
            dict.add(curr.name);
            uSets.add(curr.set_name);
            uTags = new Set([...new Set(curr.tags), ...new Set(Array.from(uTags))]);
          }
          setUniqueSets(Array.from(uSets));
          setUniqueTags(Array.from(uTags));
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }

    updateCards();
  }, [isLoading]);

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({}));

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 200,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        let data: CardsTableType = params.row;
        return (
          <HtmlTooltip
            title={
              <React.Fragment>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {data.image_uri.small.map((s: string, i: number) => (
                    <img key={i} src={data.image_uri.small[i]} alt=""></img>
                  ))}
                </div>
              </React.Fragment>
            }
            followCursor
          >
            <Typography>{data.name}</Typography>
          </HtmlTooltip>
        );
      },
    },
    { field: 'cmc', headerName: 'CMC', width: 65 },
    {
      field: 'price',
      headerName: 'Price',
      width: colWidth / 1.8,
      valueFormatter: (params: GridValueFormatterParams) => {
        return `$${params.value}`;
      },
    },
    // {
    //   field: "color",
    //   headerName: "Colours",
    //   width: colWidth / 1.5,
    //   valueGetter: (params) => {
    //     return params.row.colors.join(", ") ?? "";
    //   },
    // },
    {
      field: 'edhrec_rank',
      headerName: 'EDHREC Rank',
      width: colWidth / 1.5,
      valueGetter: (params) => {
        return params.row.edhrec_rank ?? 999999;
      },
    },
    {
      field: 'tags',
      headerName: 'tags',
      minWidth: 400,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        let data: CardsTableType = params.row;
        return (
          <Autocomplete
            fullWidth
            multiple
            id="tags-standard"
            options={data.tags || []}
            defaultValue={data.tags || []}
            freeSolo
            onChange={(_, values) => {
              updateTags(data.id || 0, values);
            }}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => <TextField {...params} variant="standard" />}
          />
        );
      },
    },
  ];

  function filterOptions(k: string) {
    switch (k) {
      case 'tags':
        return uniqueTags;
      case 'set_name':
        return uniqueSets;
      case 'colors':
        return ['W', 'U', 'B', 'R', 'G'];
      case 'type_line':
        return ['legendary', 'artifact', 'enchantment', 'creature', 'sorcery', 'instant'];
      default:
        return [];
    }
  }

  async function updateTags(id: number, tags: string[]) {
    await db.cards.update(id, { tags: tags });
  }

  const filters = [
    { slug: 'tags', name: 'Tags' },
    { slug: 'set_name', name: 'Set Name' },
    { slug: 'name', name: 'Card Name' },
    { slug: 'price', name: 'Price' },
    { slug: 'colors', name: 'Colours' },
    { slug: 'type_line', name: 'Card Type' },
  ];

  function filterCardArr(k: string, val: string[]) {
    if (val.length <= 0) {
      setCards(memoCards);
      return '';
    }
    switch (k) {
      case 'tags':
      case 'set_name':
        setCards(memoCards.filter((c) => val.some((v) => c[k].indexOf(v) >= 0)));
        break;
      case 'type_line':
        setCards(
          memoCards.filter((c) =>
            val.every((v) => c[k].toLowerCase().includes(v.toLowerCase()))
          )
        );
        break;
      case 'name':
        setCards(
          memoCards.filter((c) =>
            val.some((v) => c[k].toLowerCase().includes(v.toLowerCase()))
          )
        );
        break;
      case 'price':
        let p = 0;
        if (val.length > 0) {
          p = parseFloat(val[0]);
        }
        setCards(memoCards.filter((c) => c.price > p));
        break;
      case 'colors':
        setCards(
          memoCards.filter((c) => val.every((v) => c.colors.includes(v.toUpperCase())))
        );
        break;
    }
  }

  async function deleteCards() {
    for (let i = 0; i < selectedCards.length; i++) {
      await db.cards.delete(selectedCards[i].id ?? -1);
    }
    setIsLoading(true);
  }

  function calculateSelected() {
    let res = 0;
    for (let i = 0; i < selectedCards.length; i++) {
      res += selectedCards[i]['price'];
    }
    setTotalPrice(parseFloat(res.toFixed(2)));
  }

  function closeDeleteDialog() {
    setDeleteDialogState(false);
    setSelectedCards([]);
    setIsLoading(true);
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Box
      sx={{
        '.u-text': { backgroundColor: '#2C458B', color: 'white' },
        '.b-text': { backgroundColor: '#3C0C5D', color: 'white' },
        '.r-text': { backgroundColor: '#731421', color: 'white' },
        '.w-text': { backgroundColor: '#ffffff', color: 'black' },
        '.g-text': { backgroundColor: '#2A6438', color: 'white' },
        '.m-text': { backgroundColor: '#FFD700', color: 'black' },
        '.c-text': { backgroundColor: '#808080', color: 'white' },
        '.tags': { borderRadius: '50%', border: '1' },
      }}
    >
      <Grid
        container
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        {/* Filter */}
        <Grid item>
          <Grid container direction={'row'}>
            <Grid item style={{ width: '20vw' }}>
              <Select
                fullWidth
                defaultValue={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as string)}
              >
                {filters.map((f, i) => (
                  <MenuItem key={i} value={f.slug}>
                    {f.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item style={{ width: '60vw' }}>
              <Autocomplete
                fullWidth
                id="tags-standard"
                options={filterOptions(selectedFilter) || []}
                freeSolo
                multiple={true}
                onChange={(_, v) => {
                  console.log(v);
                  filterCardArr(selectedFilter, v);
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => <TextField {...params} variant="outlined" />}
              />
            </Grid>
          </Grid>
        </Grid>

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
                rows={cards}
                columns={columns}
                autoHeight
                checkboxSelection
                initialState={{
                  pagination: {
                    pageSize: 25,
                  },
                }}
                onSelectionModelChange={(ids) => {
                  let selectedIds = new Set(ids);
                  let selectedRows = cards.filter((card) =>
                    selectedIds.has(card.id ?? -1)
                  );
                  setSelectedCards(selectedRows);
                }}
                getCellClassName={(params: GridCellParams<number>) => {
                  let res = '';
                  if (params.field === 'name') {
                    if (params.row.colors.length < 1) {
                      res += 'c-text';
                    } else if (params.row.colors.length > 1) {
                      res += 'm-text';
                    } else {
                      res += params.row.colors[0].toLowerCase() + '-text';
                    }
                  }

                  if (params.field === 'cmc') {
                    res += 'pill';
                  }
                  return res;
                }}
              />
            </div>
          </div>
        </Grid>

        <Grid item>
          <Button onClick={() => setDeleteDialogState(true)}>delete selected</Button>
        </Grid>
        <Grid item>
          <Button
            onClick={() => {
              calculateSelected();
              setCalculateDialogState(true);
            }}
          >
            calculate selected
          </Button>
        </Grid>
        <Grid item>
          {selectedCards.length > 0 && (
            <Button
              href={`data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(selectedCards)
              )}`}
              download={`MTGDB_dump_${Date.now()}.json`}
            >
              export json
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Delete Dialog */}
      <Dialog onClose={deleteCards} open={deleteDialogState}>
        <DialogTitle>Confirm delete?</DialogTitle>
        <List>
          {selectedCards.map((card, i) => (
            <ListItem key={i}>
              <ListItemText primary={card.name} />
            </ListItem>
          ))}
        </List>
        <DialogActions>
          <Button
            onClick={() => {
              setIsLoading(true);
              deleteCards();
              closeDeleteDialog();
            }}
          >
            Confirm
          </Button>
          <Button onClick={() => closeDeleteDialog()}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Calculate Dialog */}
      <Dialog onClose={() => setCalculateDialogState(false)} open={calculateDialogState}>
        <DialogTitle>US${totalPrice}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setCalculateDialogState(false)}>close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CardDataGrid;
