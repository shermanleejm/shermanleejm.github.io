import { Button, CircularProgress, Typography } from '@mui/material';
import 'dexie-export-import';
import { useEffect, useState } from 'react';
import { addToDeck, MTGDBProps, storeCard, ToasterSeverityEnum } from '.';
import { CardsTableColumns, CardsTableType } from '../../database';
import { CSVLink } from 'react-csv';
import axios, { AxiosResponse } from 'axios';
import { ScryfallDataType } from './interfaces';
import sample from '../../assets/War_of_the_spark.json';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';
import * as DexieExportImport from 'dexie-export-import';

const NetExports = (props: MTGDBProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUpdateCard, setCurrentUpdateCard] = useState('');
  const [cardArr, setCardArr] = useState<CardsTableType[]>([]);
  const [bulkExportReady, setBulkExportReady] = useState(false);
  // const [export , setExport] = useState<Blob>(new Blob());

  const db = useSelector((state: State) => state.database);

  useEffect(() => {
    async function init() {
      setCardArr(await db.cards.toArray());
    }

    init();
  }, []);

  const handleCsv = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (ee: any) => {
      let json = '';
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
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = async (ee: any) => {
      let json: [CardsTableType];
      try {
        json = JSON.parse(ee.target.result);
      } catch (err) {
        props.toaster('Unable to process.', ToasterSeverityEnum.ERROR);
        return '';
      }

      for (const card of json) {
        let check = await db.cards
          .where({ scryfall_id: card.scryfall_id || '0' })
          .first();
        setCurrentUpdateCard(card.name);
        let resp: AxiosResponse<any, any>;
        let newCard: ScryfallDataType = {} as ScryfallDataType;
        if (check?.collector_number !== undefined && check?.set !== undefined) {
          resp = await axios.get(
            `https://api.scryfall.com/cards/${check.set}/${check.collector_number}`
          );
          newCard = resp.data;
        } else {
          resp = await axios.get('https://api.scryfall.com/cards/search?q=' + card.name);
          for (let c of resp.data.data) {
            if (c.name === card.name) {
              newCard = c;
            }
          }
        }

        if (check !== undefined) {
          db.cards.delete(check.id || -1);
        }

        storeCard(db, newCard, card.tags, card.quantity);
      }

      setIsLoading(false);
    };
  };

  const handleJson = async (e: any) => {
    setIsLoading(true);
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = async (ee: any) => {
      let json: [CardsTableType];
      try {
        json = JSON.parse(ee.target.result);
      } catch (err) {
        props.toaster('Unable to process.', ToasterSeverityEnum.ERROR);
        return '';
      }
      let added = 0;
      for (const card of json) {
        setCurrentUpdateCard(card.name);
        let originalCard = await db.cards
          .where({ scryfall_id: card.scryfall_id || '0' })
          .first();
        if (originalCard === undefined) {
          await db.cards.put(card);
          await addToDeck(db, card.tags, card.id);
        } else {
          let newTags = Array.from(new Set([...card.tags, ...originalCard.tags]));
          await db.cards.update(originalCard.id || -1, { tags: newTags });
          await addToDeck(db, newTags, originalCard.id);
        }
        added++;
      }
      console.log('Added: ', added);
      console.log('Total: ', (await db.cards.toArray()).length);
      setIsLoading(false);
    };
  };

  const CSVDownload = () => {
    const options = {
      data: cardArr,
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

  async function sampleJson() {
    setIsLoading(true);

    for (const card of sample) {
      let exists: boolean = true;
      await db.cards
        .where({ name: card.name })
        .first()
        .then((res) => (exists = res !== undefined))
        .catch((err) => console.error(err));

      if (!exists) {
        setCurrentUpdateCard(card.name);
        await db.cards
          .put(card)
          .then(() => {})
          .catch((err) => console.error(err));
      }
    }

    setIsLoading(false);
  }

  const handleImport = async (e: any) => {
    setIsLoading(true);
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = async (ee: any) => {
      await db.delete();
      await DexieExportImport.importDB(e.target.files[0]);
      setIsLoading(false);
    };
  };

  async function generateBulkExport() {
    setBulkExportReady(true);
    const blob = await db.export();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `MTGDB_export.json`;
    setBulkExportReady(false);
    link.click();
  }

  return isLoading ? (
    <div style={{ margin: 'auto' }}>
      <CircularProgress />
      <Typography>Processing {currentUpdateCard} ...</Typography>
    </div>
  ) : (
    <div style={{ width: '80vw', margin: 'auto', textAlign: 'center' }}>
      <Button fullWidth disabled>
        <CSVDownload></CSVDownload>
      </Button>

      <input
        type="file"
        accept=".csv"
        onChange={handleCsv}
        style={{ display: 'none' }}
        id="upload-db-csv"
      />
      <label htmlFor="upload-db-csv">
        <Button component="span" fullWidth disabled>
          upload csv
        </Button>
      </label>

      <Button
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(cardArr)
        )}`}
        download={`MTGDB_dump_${Date.now()}.json`}
      >
        export json
      </Button>

      <input
        type="file"
        accept="application/json"
        onChange={handleJson}
        style={{ display: 'none' }}
        id="upload-db-json"
      />
      <label htmlFor="upload-db-json">
        <Button component="span" fullWidth>
          upload json
        </Button>
      </label>

      <input
        type="file"
        accept="application/json"
        onChange={handleJsonAndUpdate}
        style={{ display: 'none' }}
        id="upload-db-json-update"
      />
      <label htmlFor="upload-db-json-update">
        <Button component="span" fullWidth>
          upload json and update
        </Button>
      </label>

      <Button fullWidth onClick={() => sampleJson()}>
        load sample json (testing)
      </Button>

      {bulkExportReady ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <Button fullWidth onClick={() => generateBulkExport()}>
          download bulk export
        </Button>
      )}

      <input
        type="file"
        accept="application/json"
        onChange={handleImport}
        style={{ display: 'none' }}
        id="upload-db-import"
      />
      <label htmlFor="upload-db-import">
        <Button component="span" fullWidth>
          import db (will delete existing data)
        </Button>
      </label>
    </div>
  );
};

export default NetExports;
