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
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  styled,
  Switch,
  TextField,
  Tooltip,
  TooltipProps,
  Typography,
} from "@mui/material";
import { CardsTableType } from "../../database";
import { useSelector } from "react-redux";
import { State } from "../../state/reducers";
import { infoHelper, rarityTypes } from "./DeckDisplay/DeckBuilderUI";
import InfoIcon from "@mui/icons-material/Info";
import LaunchIcon from "@mui/icons-material/Launch";

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({}));

const CardDataGrid = () => {
  const [cards, setCards] = useState<CardsTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCards, setSelectedCards] = useState<CardsTableType[]>([]);
  const [totalPrice, setTotalPrice] = useState(-1);
  const [deleteDialogState, setDeleteDialogState] = useState(false);
  const [calculateDialogState, setCalculateDialogState] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("general");
  const [memoCards, setMemoCards] = useState<CardsTableType[]>([]);
  const [uniqueTags, setUniqueTags] = useState<string[]>();
  const [uniqueSets, setUniqueSets] = useState<string[]>();
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [andOr, setAndOr] = useState(false);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);

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
            uTags = new Set([
              ...new Set(curr.tags),
              ...new Set(Array.from(uTags)),
            ]);
          }
          setUniqueSets(Array.from(uSets));
          setUniqueTags(Array.from(uTags));
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }

    updateCards();
  }, [isLoading]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName:
        window.innerWidth < 400 ? "Name (tap and hold to preview)" : "Name",
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
                    <img key={i} src={data.image_uri.small[i]} alt=''></img>
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
    { field: "cmc", headerName: "CMC", flex: 1 },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) => {
        return `$${params.value}`;
      },
    },
    {
      field: "edhrec_rank",
      headerName: "EDHREC Rank",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => {
        return params.row.edhrec_rank ?? 999999;
      },
      renderCell: (params: GridRenderCellParams) => {
        let data: CardsTableType = params.row;
        let edhName = data.name
          .split("//")[0]
          .trim()
          .replace(/[^a-zA-Z\s-]/g, "")
          .replace(/\s/g, "-")
          .toLowerCase();
        let typeLine = data.type_line.toLowerCase();
        let canBeCommander =
          typeLine.includes("legendary") &&
          (typeLine.includes("creature") ||
            data.oracle_text?.toLowerCase().includes("can be your commander"));
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>{params.row.edhrec_rank ?? 999999}</Typography>
            <IconButton
              onClick={() =>
                window.open(`https://edhrec.com/cards/${edhName}`, "_blank")
              }
            >
              <LaunchIcon />
            </IconButton>
            {canBeCommander && (
              <Button
                onClick={() =>
                  window.open(
                    `https://edhrec.com/commanders/${edhName}`,
                    "_blank"
                  )
                }
              >
                commander
              </Button>
            )}
          </div>
        );
      },
    },
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
        return uniqueTags;
      case "set_name":
        return uniqueSets;
      case "colors":
        return ["W", "U", "B", "R", "G"];
      case "type_line":
        return [
          "legendary",
          "artifact",
          "enchantment",
          "creature",
          "sorcery",
          "instant",
        ];
      default:
        return [];
    }
  }

  async function updateTags(id: number, tags: string[]) {
    await db.cards.update(id, { tags: tags });
  }

  const filters = [
    { slug: "tags", name: "Tags" },
    { slug: "set_name", name: "Set Name" },
    { slug: "name", name: "Card Name" },
    { slug: "price", name: "Price" },
    { slug: "colors", name: "Colours" },
    { slug: "type_line", name: "Card Type" },
    { slug: "general", name: "MTG Arena Style" },
  ];

  function filterLogicAnd(c: CardsTableType, val: string[]) {
    if (val.length > 0) {
      return val.every((q) => {
        q = q.toLowerCase();
        if (q.includes(":")) {
          let type = q.split(":")[0].trim();
          let qq = q.split(":")[1].trim();

          switch (type) {
            case "t":
              return c.type_line.toLowerCase().includes(qq);
            case "o":
              return c.oracle_text?.toLowerCase().includes(qq);
            case "set":
              return c.set_name.toLowerCase().includes(qq);
            case "p":
              let currFloat: number = parseFloat(qq.match(/[0-9.]+/)![0]);
              if (!isNaN(currFloat)) {
                if (qq.includes("<")) {
                  return c.price < currFloat;
                } else if (qq.includes(">")) {
                  return c.price > currFloat;
                }
              }
              break;
            case "r":
              let rareType = qq.toLowerCase();
              let rareTypes: { [key: string]: string } = {
                r: rarityTypes.RARE,
                rare: rarityTypes.RARE,
                m: rarityTypes.MYTHIC,
                mythic: rarityTypes.MYTHIC,
                u: rarityTypes.UNCOMMON,
                uncommon: rarityTypes.UNCOMMON,
                c: rarityTypes.COMMON,
                common: rarityTypes.COMMON,
              };
              if (!Object.keys(rareTypes).includes(rareType)) {
                return c.rarity.includes("WRONG");
              }
              return c.rarity === rareTypes[rareType];
            case "s":
              let specialQuery = qq.toLowerCase();
              if (specialQuery === "tap") {
                return c.oracle_text?.includes("{T}");
              }
              if (specialQuery === "etb") {
                return (
                  c.oracle_text &&
                  c.oracle_text.toLowerCase().includes("enters the battlefield")
                );
              }
              if (specialQuery === "commander") {
                let _typeLine = c.type_line.toLowerCase();
                let _oracleText = c.oracle_text?.toLowerCase();
                return (
                  _typeLine.includes("legendary") &&
                  (_typeLine.includes("creature") ||
                    _oracleText?.includes("can be your commander"))
                );
              }
              return false;
            default:
              return false;
          }
        }
        return (
          c.name.toLowerCase().includes(q) ||
          c.set_name.toLowerCase().includes(q) ||
          c.oracle_text?.toLowerCase().includes(q) ||
          c.type_line.toLowerCase().includes(q)
        );
      });
    }
    return true;
  }

  function filterLogicOr(c: CardsTableType, val: string[]) {
    if (val.length > 0) {
      return val.some((q) => {
        q = q.toLowerCase();
        if (q.includes(":")) {
          let type = q.split(":")[0].trim();
          let qq = q.split(":")[1].trim();

          switch (type) {
            case "t":
              return c.type_line.toLowerCase().includes(qq);
            case "o":
              return c.oracle_text?.toLowerCase().includes(qq);
            case "set":
              return c.set_name.toLowerCase().includes(qq);
            case "p":
              let currFloat: number = parseFloat(qq.match(/[0-9.]+/)![0]);
              if (!isNaN(currFloat)) {
                if (qq.includes("<")) {
                  return c.price < currFloat;
                } else if (qq.includes(">")) {
                  return c.price > currFloat;
                }
              }
              break;
            case "r":
              let rareType = qq.toLowerCase();
              let rareTypes: { [key: string]: string } = {
                r: rarityTypes.RARE,
                rare: rarityTypes.RARE,
                m: rarityTypes.MYTHIC,
                mythic: rarityTypes.MYTHIC,
                u: rarityTypes.UNCOMMON,
                uncommon: rarityTypes.UNCOMMON,
                c: rarityTypes.COMMON,
                common: rarityTypes.COMMON,
              };
              if (!Object.keys(rareTypes).includes(rareType)) {
                return c.rarity.includes("WRONG");
              }
              return c.rarity === rareTypes[rareType];
            case "s":
              let specialQuery = qq.toLowerCase();
              if (specialQuery === "tap") {
                return c.oracle_text?.includes("{T}");
              }
              if (specialQuery === "etb") {
                return (
                  c.oracle_text &&
                  c.oracle_text.toLowerCase().includes("enters the battlefield")
                );
              }
              if (specialQuery === "commander") {
                let _typeLine = c.type_line.toLowerCase();
                let _oracleText = c.oracle_text?.toLowerCase();
                return (
                  _typeLine.includes("legendary") &&
                  (_typeLine.includes("creature") ||
                    _oracleText?.includes("can be your commander"))
                );
              }
              return false;
            default:
              return false;
          }
        }
        return (
          c.name.toLowerCase().includes(q) ||
          c.set_name.toLowerCase().includes(q) ||
          c.oracle_text?.toLowerCase().includes(q) ||
          c.type_line.toLowerCase().includes(q)
        );
      });
    }
    return true;
  }

  function filterCardArr(k: string, val: string[]) {
    if (val.length <= 0) {
      setCards(memoCards);
      return "";
    }
    switch (k) {
      case "general":
        setCards(
          memoCards.filter((c) =>
            andOr
              ? filterLogicAnd((c = c), (val = val))
              : filterLogicOr((c = c), (val = val))
          )
        );
        break;
      case "tags":
        setCards(memoCards.filter((c) => val.some((v) => c[k].includes(v))));
        break;
      case "set_name":
        console.log(val);
        setCards(memoCards.filter((c) => val.some((v) => c[k] === v)));
        break;
      case "type_line":
        setCards(
          memoCards.filter((c) =>
            val.every((v) => c[k].toLowerCase().includes(v.toLowerCase()))
          )
        );
        break;
      case "name":
        setCards(
          memoCards.filter((c) =>
            val.some((v) => c[k].toLowerCase().includes(v.toLowerCase()))
          )
        );
        break;
      case "price":
        let tmp = memoCards;
        for (let i = 0; i < val.length; i++) {
          let curr = val[i];
          let currFloat: number = parseFloat(curr.match(/[0-9.]+/)![0]);
          if (!isNaN(currFloat)) {
            if (curr.includes("<")) {
              tmp = tmp.filter((c) => c.price < currFloat);
            } else if (curr.includes(">")) {
              tmp = tmp.filter((c) => c.price > currFloat);
            }
          }
        }
        setCards(tmp);
        break;
      case "colors":
        setCards(
          memoCards.filter((c) =>
            val.every((v) => c.colors.includes(v.toUpperCase()))
          )
        );
        break;
    }
  }

  async function deleteCards() {
    for (let i = 0; i < selectedCards.length; i++) {
      await db.cards.delete(selectedCards[i].id ?? -1);
      if (selectedCards[i].id) {
        await db.decks.bulkDelete(
          (
            await db.decks.where({ card_id: selectedCards[i].id }).toArray()
          ).map((d) => d.id!)
        );
      }
    }
    setIsLoading(true);
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
  }

  const infoDialog = () => {
    return (
      <Dialog open={showInfoDialog} onClose={() => setShowInfoDialog(false)}>
        <DialogTitle>Helpful tips for searching</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText>
                <Typography variant='body1'>
                  Seperate multiple queries with a comma.
                </Typography>
              </ListItemText>
            </ListItem>
            {infoHelper.map((ele) => (
              <ListItem>
                <ListItemText>
                  <Typography variant='body1'>{ele.title}</Typography>
                  <Typography variant='body2'>{ele.explanation}</Typography>

                  <Typography variant='body2' sx={{ fontFamily: "monospace" }}>
                    {ele.example}
                  </Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
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
      {infoDialog()}
      <Grid
        container
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {/* Filter */}
        <Grid item>
          <div style={{ width: "80vw" }}>
            <Grid container alignItems={"center"}>
              {selectedFilter === "general" && (
                <Grid item xs={2} sm={1} md={0.5}>
                  <IconButton onClick={() => setShowInfoDialog(true)}>
                    <InfoIcon />
                  </IconButton>
                </Grid>
              )}
              <Grid
                item
                xs={selectedFilter === "general" ? 10 : 12}
                sm={selectedFilter === "general" ? 11 : 4}
                md={selectedFilter === "general" ? 3 : 3.5}
              >
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

              {selectedFilter === "general" && (
                <Grid item xs={5} sm={2.5} md={2} lg={1.2}>
                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "1rem",
                    }}
                  >
                    And
                    <Switch
                      checked={andOr}
                      onChange={() => {
                        setAndOr(!andOr);
                      }}
                    />
                    Or
                  </div>
                </Grid>
              )}

              <Grid
                item
                xs={selectedFilter === "general" ? 7 : 12}
                sm={selectedFilter === "general" ? 9.5 : 8}
                md={selectedFilter === "general" ? 6.5 : 8.5}
                lg={selectedFilter === "general" ? 7.3 : 8.5}
              >
                <Autocomplete
                  fullWidth
                  id='tags-standard'
                  options={filterOptions(selectedFilter) || []}
                  freeSolo
                  multiple={true}
                  onChange={(_, v) => {
                    filterCardArr(selectedFilter, v);
                    setSearchQueries(v);
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
          </div>
        </Grid>

        {/* Data Grid */}
        <Grid item>
          <div
            style={{
              height: "100%",
              width: "80vw",
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
