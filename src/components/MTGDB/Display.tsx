import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  styled,
  TextField,
  Tooltip,
  TooltipProps,
  Typography,
} from "@mui/material";
import { MTGDBProps } from ".";
import { CardsTableType } from "../../database";

const Display = (props: MTGDBProps) => {
  const [cards, setCards] = useState<CardsTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCards, setSelectedCards] = useState<CardsTableType[]>([]);
  const [totalPrice, setTotalPrice] = useState(-1);
  const [deleteDialogState, setDeleteDialogState] = useState(false);
  const [calculateDialogState, setCalculateDialogState] = useState(false);

  const colWidth = (window.innerWidth * 0.8) / 4;

  useEffect(() => {
    function updateCards() {
      setCards(props.cardArr);
      setIsLoading(false);
    }

    updateCards();
  }, [isLoading, props.cardArr]);

  async function updateTags(id: number, tags: string[]) {
    await props.db.cards.update(id, { tags: tags });
    props.refresh(true);
  }

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({}));

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: colWidth,
      renderCell: (params: GridRenderCellParams) => {
        let data: CardsTableType = params.row;
        return (
          <HtmlTooltip
            title={
              <React.Fragment>
                <img src={data.image_uri}></img>
              </React.Fragment>
            }
            followCursor
          >
            <Typography>{data.name}</Typography>
          </HtmlTooltip>
        );
      },
    },
    { field: "cmc", headerName: "CMC", width: 65 },
    {
      field: "price",
      headerName: "Price",
      width: colWidth / 2,
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
      field: "tags",
      headerName: "tags",
      width: colWidth * 2,
      renderCell: (params: GridRenderCellParams) => {
        let data: CardsTableType = params.row;
        return (
          <Autocomplete
            fullWidth
            multiple
            id="tags-standard"
            options={data.tags || []}
            freeSolo
            onChange={(_, values) => {
              updateTags(data.id || 0, values);
            }}
            renderTags={(value: readonly string[], getTagProps) => {
              return value.map((option: string, index: number) => {
                console.log(option);
                return (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                );
              });
            }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" />
            )}
          />
        );
      },
    },
  ];

  type SortType = {
    key: string;
    order: boolean;
    checked: boolean;
  };

  const [checkboxValues, setCheckboxValues] = useState<{
    [key: string]: SortType;
  }>({
    name: { key: "name", order: false, checked: false },
    price: { key: "price", order: false, checked: false },
    cmc: { key: "cmc", order: false, checked: false },
  });
  const sortNames = ["name", "price", "cmc"];

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
    for (let i = 0; i < selectedCards.length; i++) {
      await props.db.cards.delete(selectedCards[i].id ?? -1);
    }
    props.refresh(true);
    setIsLoading(false);
  }

  function calculateSelected() {
    let res = 0;
    for (let i = 0; i < selectedCards.length; i++) {
      res += parseFloat(selectedCards[i]["price"]);
    }
    setTotalPrice(parseFloat(res.toFixed(2)));
  }

  function closeDeleteDialog() {
    setDeleteDialogState(false);
    setSelectedCards([]);
    setIsLoading(true);
    props.refresh(true);
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Box>
      <Grid
        container
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
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
        <Grid item style={{ width: "80vw" }}>
          <div
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                sx={{
                  ".u-text": { backgroundColor: "#2C458B", color: "white" },
                  ".b-text": { backgroundColor: "#3C0C5D", color: "white" },
                  ".r-text": { backgroundColor: "#731421", color: "white" },
                  ".w-text": { backgroundColor: "#ffffff", color: "black" },
                  ".g-text": { backgroundColor: "#2A6438", color: "white" },
                  ".m-text": { backgroundColor: "#FFD700", color: "black" },
                  ".c-text": { backgroundColor: "#808080", color: "white" },
                  ".tags": { borderRadius: "50%", border: "1" },
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
                  setSelectedCards(selectedRows);
                }}
                getCellClassName={(params: GridCellParams<number>) => {
                  let res = "";
                  if (params.field === "name") {
                    if (params.row.colors.length < 1) {
                      res += "c-text";
                    } else if (params.row.colors.length > 1) {
                      res += "m-text";
                    } else {
                      res += params.row.colors[0].toLowerCase() + "-text";
                    }
                  }

                  if (params.field === "cmc") {
                    res += "pill";
                  }
                  return res;
                }}
              />
            </div>
          </div>
        </Grid>
        <Grid item>
          <Button onClick={() => setDeleteDialogState(true)}>
            delete selected
          </Button>
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
      </Grid>

      {/* Delete Dialog */}
      <Dialog onClose={deleteCards} open={deleteDialogState}>
        <DialogTitle>Confirm delete?</DialogTitle>
        <List>
          {selectedCards.map((card) => (
            <ListItem>
              <ListItemText primary={card.name} />
            </ListItem>
          ))}
        </List>
        <DialogActions>
          <Button
            onClick={() => {
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
      <Dialog
        onClose={() => setCalculateDialogState(false)}
        open={calculateDialogState}
      >
        <DialogTitle>US${totalPrice}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setCalculateDialogState(false)}>close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Display;
