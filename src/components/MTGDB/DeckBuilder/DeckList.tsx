import {
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CardsTableType } from "../../../database";
import ManaChart from "./ManaChart";

type DeckListType = {
  cards: Set<CardsTableType>;
  deleteFromDeckList: (c: CardsTableType) => void;
};

const DeckList = (props: DeckListType) => {
  const [cards, setCards] = useState<CardsTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deckName, setDeckName] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(true);
  const [exportJson, setExportJson] = useState<string>("");

  useEffect(() => {
    function init() {
      setCards(Array.from(props.cards));
      setIsLoading(false);
    }

    init();
  }, [props.cards, isLoading]);

  return isLoading ? (
    <CircularProgress />
  ) : (
    <div>
      <Grid container justifyContent={"center"} alignItems={"flex-start"}>
        <Grid item xs={12}>
          <ManaChart />
        </Grid>
        <Grid item xs={12}>
          <TextField
            size='small'
            fullWidth
            label={"Deck Name"}
            value={deckName}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => setDeckName(e.target.value)}
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          {isGenerating ? (
            <Button
              onClick={() => {
                let tmp = cards.map((c) => {
                  let tmp = c;
                  tmp.tags.push(deckName);
                  return tmp;
                });
                setExportJson(JSON.stringify(Array.from(new Set(tmp))));
                setIsGenerating(false);
              }}
            >
              generate json
            </Button>
          ) : (
            <Button
              href={`data:text/json;charset=utf-8,${encodeURIComponent(
                exportJson
              )}`}
              download={`MTGDB_dump_${Date.now()}.json`}
            >
              download json
            </Button>
          )}

          <Button
            href={`data:application/octet-stream,${encodeURIComponent(
              Array.from(props.cards)
                .map((c) => c.name)
                .join("\n")
            )}`}
            download={`MTGDB_dump_${Date.now()}.txt`}
          >
            export just names
          </Button>
        </Grid>
        <Grid item xs={12}>
          {cards.map((c) => (
            <Card elevation={3} style={{ marginBottom: 5 }}>
              <CardActionArea
                style={{ padding: 3 }}
                onClick={() => {
                  props.deleteFromDeckList(c);
                  setIsLoading(true);
                }}
              >
                <Grid container spacing={2}>
                  <Grid item>
                    <Typography>{c.cmc}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{c.name}</Typography>
                  </Grid>
                </Grid>
              </CardActionArea>
            </Card>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default DeckList;
