import {
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CardsTableType } from "../../../database";

type DeckListType = {
  cards: Set<CardsTableType>;
  deleteFromDeckList: (c: CardsTableType) => void;
};

const DeckList = (props: DeckListType) => {
  const [cards, setCards] = useState<CardsTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          <Button
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(Array.from(props.cards))
            )}`}
            download={`MTGDB_dump_${Date.now()}.json`}
          >
            Export json
          </Button>
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
