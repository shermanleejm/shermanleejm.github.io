import { Button, CircularProgress, Input, Typography } from "@mui/material";
import "dexie-export-import";
import { useState } from "react";
import { MTGDBProps, ToasterSeverityEnum } from ".";
import { CardsTableColumns, CardsTableType } from "../../database";
import { CSVLink } from "react-csv";

const NetExports = (props: MTGDBProps) => {
  const [isLoading, setIsLoading] = useState(false);

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

      for (const card of json) {
        let exists: boolean = true;
        await props.db.cards
          .where(card)
          .first()
          .then((res) => (exists = res !== undefined))
          .catch((err) => console.error(err));

        if (!exists) {
          console.log(card);
          await props.db.cards
            .put(card)
            .then(() => {})
            .catch((err) => console.error(err));
        }
      }

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

  return isLoading ? (
    <div style={{ margin: "auto" }}>
      <CircularProgress />
      <Typography>Processing...</Typography>
    </div>
  ) : (
    <div style={{ width: "80vw", margin: "auto" }}>
      <Button fullWidth disabled>
        <CSVDownload></CSVDownload>
      </Button>
      <input
        type="file"
        accept=".csv"
        onChange={handleCsv}
        style={{ display: "none" }}
        id="upload-db-csv"
      />
      <label htmlFor="upload-db-csv">
        <Button component="span" fullWidth disabled>
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
        type="file"
        accept="application/json"
        onChange={handleJson}
        style={{ display: "none" }}
        id="upload-db-json"
      />
      <label htmlFor="upload-db-json">
        <Button component="span" fullWidth>
          upload json
        </Button>
      </label>
    </div>
  );
};

export default NetExports;
