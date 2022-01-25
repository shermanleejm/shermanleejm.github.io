import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { ScryfallDataType } from "../../interfaces";

export type SearchResultCardType = {
  sr: ScryfallDataType;
  cardDict: { [key: string]: boolean };
  storeCard: (
    sr: ScryfallDataType,
    tag?: string,
    price?: string,
    qty?: number,
    imgUri?: string
  ) => void;
};

const SearchResultCard = (props: SearchResultCardType) => {
  const [tag, setTag] = useState<string | undefined>();
  const [isClicked, setIsClicked] = useState(false);
  const [price, setPrice] = useState<string>();
  const [priceSelectOptions, setPriceSelectOptions] = useState<
    { type: string; money: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgUri, setImgUri] = useState("");

  useEffect(() => {
    function preCheck() {
      if (props.cardDict && props.cardDict[props.sr.name]) {
        setIsClicked(true);
      }

      let tmp: { type: string; money: string }[] = [];
      if (props.sr.prices.usd !== null) {
        tmp.push({
          type: "Non-foil",
          money: props.sr.prices.usd,
        });
      }
      if (props.sr.prices.usd_foil !== null) {
        tmp.push({
          type: "Foil",
          money: props.sr.prices.usd_foil,
        });
      }
      if (props.sr.prices.usd_etched !== null) {
        tmp.push({
          type: "Etched",
          money: props.sr.prices.usd_etched,
        });
      }
      setPriceSelectOptions(tmp);
      if (tmp.length > 0) {
        setPrice(tmp[0].money);
      }
      setIsLoading(false);
      setImgUri(
        props.sr.image_uris === undefined
          ? props.sr.card_faces !== undefined
            ? props.sr.card_faces[0].image_uris.small
            : ""
          : props.sr.image_uris.small
      );
    }

    preCheck();
  }, []);

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
  };

  return isLoading ? (
    <div>
      <CircularProgress />
    </div>
  ) : (
    <Grid item xs={6} md={4} lg={3}>
      <Card raised sx={{ bgcolor: "grey" }}>
        <CardMedia component="img" image={imgUri} />
        <CardContent>
          <Typography>{props.sr.name}</Typography>
          <br />
          <Typography>{props.sr.set_name}</Typography>
          <br />
          <TextField
            select
            fullWidth
            value={price}
            defaultChecked
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPrice(e.target.value);
            }}
          >
            {priceSelectOptions.map((pso) => (
              <MenuItem
                value={pso.money}
              >{`US$${pso.money} - ${pso.type}`}</MenuItem>
            ))}
          </TextField>
          <br />
          <br />
          <NumberFormat
            customInput={TextField}
            value={qty}
            thousandSeparator
            decimalScale={0}
            label="Quantity"
            onValueChange={(values) => {
              let { floatValue } = values;
              setQty(floatValue || 1);
            }}
            inputProps={{ fullWidth: "true" }}
          />
        </CardContent>
        <CardActions>
          <Grid container direction={"column"}>
            <Grid item>
              <TextField onChange={handleTagChange} value={tag} label={"tag"} />
            </Grid>
            <Grid item>
              <Button
                disabled={isClicked}
                onClick={() => {
                  setIsClicked(true);
                  props.storeCard(props.sr, tag, price, qty);
                }}
              >
                add card
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default SearchResultCard;
