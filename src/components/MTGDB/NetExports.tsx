import { Button } from "@mui/material";
import "dexie-export-import";
import { useState } from "react";
import { MTGDBProps } from ".";
import { CardsTableColumns, CardsTableType } from "../../database";
import { CSVLink } from "react-csv";

const NetExports = (props: MTGDBProps) => {
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
  return (
    <div>
      <Button>
        <CSVDownload></CSVDownload>
      </Button>
    </div>
  );
};

export default NetExports;
