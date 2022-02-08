import { Button, CircularProgress, Typography } from "@mui/material";
import "dexie-export-import";
import { useState } from "react";
import { MTGDBProps, ToasterSeverityEnum } from ".";
import {
  CardsTableColumns,
  CardsTableType,
  CustomImageUris,
} from "../../database";
import { CSVLink } from "react-csv";
import axios from "axios";
import { ScryfallDataType } from "./interfaces";
import sample from "../../assets/War_of_the_spark.json";

const NetExports = (props: MTGDBProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUpdateCard, setCurrentUpdateCard] = useState("");

  const handleCsv = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (ee: any) => {
      let json = "";
      try {
        json = JSON.parse(ee.target.result);
      } catch (err) {
        json = ee.target.result;
      }
      console.log(json);
    };
  };

  const handleJsonAndUpdate = async (e: any) => {
    setIsLoading(true);
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = async (ee: any) => {
      let json: [CardsTableType];
      try {
        json = JSON.parse(ee.target.result);
      } catch (err) {
        props.toaster("Unable to process.", ToasterSeverityEnum.ERROR);
        return "";
      }

      for (const card of json) {
        let check = await props.db.cards.where(card).first();
        if (check === undefined) {
          setCurrentUpdateCard(card.name);

          let resp = await axios.get(
            "https://api.scryfall.com/cards/search?q=" + card.name
          );

          let newCard: ScryfallDataType = resp.data.data[0];
          let colors = [];
          if (newCard.card_faces) {
            colors = newCard.card_faces[0].colors;
          } else {
            colors = newCard.colors || [];
          }

          let imgUris: CustomImageUris = { small: [], normal: [] };
          if (newCard.card_faces) {
            for (let i = 0; i < newCard.card_faces.length; i++) {
              imgUris.small.push(newCard.card_faces[i].image_uris.small);
              imgUris.normal.push(newCard.card_faces[i].image_uris.normal);
            }
          } else if (newCard.image_uris) {
            imgUris = {
              small: [newCard.image_uris?.small],
              normal: [newCard.image_uris?.normal],
            };
          }

          const newEntry: CardsTableType = {
            scryfall_id: newCard.id,
            name: newCard.name,
            price: parseFloat(newCard.prices.usd || "0"),
            quantity: card.quantity,
            set_name: newCard.set_name,
            rarity: newCard.rarity,
            mana_cost: newCard.mana_cost,
            cmc: newCard.cmc,
            image_uri: imgUris,
            colors: colors,
            color_identity: newCard.color_identity,
            tags: card.tags,
            type_line: newCard.type_line,
            oracle_text: newCard.oracle_text,
            date_added: Date.now(),
          };

          await props.db.cards
            .put(newEntry)
            .then(() => {})
            .catch((err) => console.error(err));
        }
      }

      setIsLoading(false);
    };
  };

  const handleJson = async (e: any) => {
    setIsLoading(true);
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = async (ee: any) => {
      let json: [CardsTableType];
      try {
        json = JSON.parse(ee.target.result);
      } catch (err) {
        props.toaster("Unable to process.", ToasterSeverityEnum.ERROR);
        return "";
      }
      let added = 0;
      for (const card of json) {
        delete card.id;
        let exists =
          (await props.db.cards.where({ name: card.name }).first()) !==
          undefined;

        if (!exists) {
          setCurrentUpdateCard(card.name);
          await props.db.cards.put(card);
          added++;
        }
      }
      console.log("Added: ", added);
      console.log("Total: ", (await props.db.cards.toArray()).length);
      setIsLoading(false);
    };
  };

  const CSVDownload = () => {
    const options = {
      data: props.cardArr,
      headers: CardsTableColumns,
      filename: `MTGDB_dump_${Date.now()}.csv`,
      target: "_blank",
    };
    return (
      <CSVLink style={{ all: "unset" }} {...options}>
        export to csv
      </CSVLink>
    );
  };

  async function sampleJson() {
    console.log(sample);
    setIsLoading(true);

    for (const card of sample) {
      let exists: boolean = true;
      await props.db.cards
        .where({ name: card.name })
        .first()
        .then((res) => (exists = res !== undefined))
        .catch((err) => console.error(err));

      if (!exists) {
        setCurrentUpdateCard(card.name);
        await props.db.cards
          .put(card)
          .then(() => {})
          .catch((err) => console.error(err));
      }
    }

    setIsLoading(false);
  }

  return isLoading ? (
    <div style={{ margin: "auto" }}>
      <CircularProgress />
      <Typography>Processing {currentUpdateCard} ...</Typography>
    </div>
  ) : (
    <div style={{ width: "80vw", margin: "auto", textAlign: "center" }}>
      <Button fullWidth disabled>
        <CSVDownload></CSVDownload>
      </Button>

      <input
        type='file'
        accept='.csv'
        onChange={handleCsv}
        style={{ display: "none" }}
        id='upload-db-csv'
      />
      <label htmlFor='upload-db-csv'>
        <Button component='span' fullWidth disabled>
          upload csv
        </Button>
      </label>

      <Button
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(props.cardArr)
        )}`}
        download={`MTGDB_dump_${Date.now()}.json`}
      >
        export json
      </Button>

      <input
        type='file'
        accept='application/json'
        onChange={handleJson}
        style={{ display: "none" }}
        id='upload-db-json'
      />
      <label htmlFor='upload-db-json'>
        <Button component='span' fullWidth>
          upload json
        </Button>
      </label>

      <input
        type='file'
        accept='application/json'
        onChange={handleJsonAndUpdate}
        style={{ display: "none" }}
        id='upload-db-json-update'
      />
      <label htmlFor='upload-db-json-update'>
        <Button component='span' fullWidth>
          upload json and update
        </Button>
      </label>

      <Button onClick={() => sampleJson()}>load sample json (testing)</Button>
    </div>
  );
};

export default NetExports;
