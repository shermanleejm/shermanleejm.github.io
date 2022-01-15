import { Button, Input } from '@mui/material';
import 'dexie-export-import';
import { useState } from 'react';
import { MTGDBProps } from '.';
import { CardsTableColumns, CardsTableType } from '../../database';
import { CSVLink } from 'react-csv';

const NetExports = (props: MTGDBProps) => {
  const handleChange = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (ee: any) => {
      console.log(ee.target.result);
      let json = '';
      try {
        json = JSON.parse(ee.target.result);
      } catch (err) {
        json = ee.target.result;
      }
    };
  };

  const CSVDownload = () => {
    const options = {
      data: props.cardArr,
      headers: CardsTableColumns,
      filename: `MTGDB_dump_${Date.now()}.csv`,
      target: '_blank',
    };
    return (
      <CSVLink style={{ all: 'unset' }} {...options}>
        export to csv
      </CSVLink>
    );
  };
  return (
    <div style={{ width: '80vw', margin: 'auto' }}>
      <Button fullWidth>
        <CSVDownload></CSVDownload>
      </Button>
      <input
        type="file"
        accept=".csv, text/plain, application/json"
        onChange={handleChange}
        style={{ display: 'none' }}
        id="upload-db"
      />
      <label htmlFor="upload-db">
        <Button component="span" fullWidth>
          upload
        </Button>
      </label>
    </div>
  );
};

export default NetExports;
