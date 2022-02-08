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
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
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
} from "@mui/material";
import { MTGDBProps } from ".";
import { CardsTableType } from "../../database";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const CardDataGrid = (props: MTGDBProps) => {
  const [cards, setCards] = useState<CardsTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCards, setSelectedCards] = useState<CardsTableType[]>([]);
  const [totalPrice, setTotalPrice] = useState(-1);
  const [deleteDialogState, setDeleteDialogState] = useState(false);
  const [calculateDialogState, setCalculateDialogState] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("tags");
  const [memoCards, setMemoCards] = useState<CardsTableType[]>([]);
  const [perPage, setPerPage] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [isProprietary, setIsProprietary] = useState(true);

  const colWidth = (window.innerWidth * 0.8) / 4;
  const lastPage = Math.floor(cards.length / perPage);

  useEffect(() => {
    function updateCards() {
      setCards(props.cardArr);
      setMemoCards(props.cardArr);
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
      minWidth: 200,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        let data: CardsTableType = params.row;
        return (
          <HtmlTooltip
            title={
              <React.Fragment>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {data.image_uri.small.map((s: string, i: number) => (
                    <img src={data.image_uri.small[i]} alt=''></img>
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
    { field: "cmc", headerName: "CMC", width: 65 },
    {
      field: "price",
      headerName: "Price",
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
      field: "tags",
      headerName: "tags",
      minWidth: 400,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        let data: CardsTableType = params.row;
        return (
          <Autocomplete
            fullWidth
            multiple
            id='tags-standard'
            options={data.tags || []}
            defaultValue={data.tags || []}
            freeSolo
            onChange={(_, values) => {
              updateTags(data.id || 0, values);
            }}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant='outlined'
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant='standard' />
            )}
          />
        );
      },
    },
  ];

  function filterOptions(k: string) {
    switch (k) {
      case "tags":
        return props.uniqueTags;
      case "set_name":
        return props.uniqueSets;
      default:
        return [];
    }
  }

  const filters = [
    { slug: "tags", name: "Tags" },
    { slug: "set_name", name: "Set Name" },
    { slug: "name", name: "Card Name" },
    { slug: "price", name: "Price" },
    { slug: "colors", name: "Colours" },
    { slug: "type_line", name: "Card Type" },
  ];

  function filterCardArr(k: string, val: string | null) {
    if (val === null) {
      setCards(memoCards);
      return "";
    }
    switch (k) {
      case "tags":
        setCards(cards.filter((c) => new Set(c[k]).has(val || "")));
        break;
      case "set_name":
        setCards(cards.filter((c) => c[k] === val));
        break;
      case "name":
        setCards(
          cards.filter((c) => c.name.toLowerCase().includes(val.toLowerCase()))
        );
        break;
      case "price":
        setCards(cards.filter((c) => c.price > parseFloat(val)));
        break;
      case "colors":
        setCards(cards.filter((c) => new Set(c.colors).has(val.toUpperCase())));
        break;
      case "type_line":
        setCards(
          cards.filter((c) =>
            c.type_line.toLowerCase().includes(val.toLowerCase())
          )
        );
    }
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
      res += selectedCards[i]["price"];
    }
    setTotalPrice(parseFloat(res.toFixed(2)));
  }

  function closeDeleteDialog() {
    setDeleteDialogState(false);
    setSelectedCards([]);
    setIsLoading(true);
    props.refresh(true);
  }

  function handlePageChange(pn: number, pp: number) {
    // setCards(cards.slice(pn * pp, pp * (pn + 1) - 1));
  }

  const NavigationBar = () => {
    return (
      <Grid item style={{ width: "80vw" }}>
        <Grid
          style={{ width: "100%" }}
          container
          alignItems={"center"}
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Grid item>
            <IconButton
              disabled={pageNumber <= 0}
              onClick={() => {
                setPageNumber(pageNumber - 1);
                handlePageChange(pageNumber - 1, perPage);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item>{`Page ${pageNumber + 1} of ${
            lastPage === perPage ? lastPage : lastPage + 1
          }`}</Grid>
          <Grid item>
            <Select
              defaultValue={perPage}
              onChange={(e) => {
                setIsProprietary(true);
                let newPerPage: number = e.target.value as number;
                if (newPerPage > 0) {
                  let newPageNum =
                    Math.floor((perPage * (pageNumber + 1)) / newPerPage) >=
                    lastPage
                      ? lastPage
                      : Math.floor((perPage * (pageNumber + 1)) / newPerPage);
                  newPageNum = 0;
                  handlePageChange(newPageNum, newPerPage);
                  setPerPage(newPerPage);
                  setPageNumber(newPageNum);
                } else {
                  setIsProprietary(false);
                  handlePageChange(0, props.cardArr.length);
                }
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={-1}>all</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <IconButton
              disabled={pageNumber >= lastPage}
              onClick={() => {
                setPageNumber(pageNumber + 1);
                handlePageChange(pageNumber + 1, perPage);
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Box
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
    >
      <Grid
        container
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {/* Filter */}
        <Grid item>
          <Grid container direction={"row"}>
            <Grid item style={{ width: "20vw" }}>
              <Select
                fullWidth
                defaultValue={filters[0].slug}
                onChange={(e) => setSelectedFilter(e.target.value as string)}
              >
                {filters.map((f) => (
                  <MenuItem value={f.slug}>{f.name}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item style={{ width: "60vw" }}>
              <Autocomplete
                fullWidth
                id='tags-standard'
                options={filterOptions(selectedFilter) || []}
                // defaultValue={data.tags || []}
                freeSolo
                onChange={(_, v) => {
                  filterCardArr(selectedFilter, v);
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip
                      variant='outlined'
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} variant='outlined' />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <NavigationBar />

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
                rows={cards.slice(pageNumber * perPage, perPage * (pageNumber + 1) - 1)}
                columns={columns}
                autoHeight
                checkboxSelection
                hideFooter={isProprietary}
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

export default CardDataGrid;
