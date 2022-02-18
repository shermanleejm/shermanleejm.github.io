import {
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CardsTableType } from '../../../database';
import { MTGTypesEnum } from '../interfaces';
import ManaChart from './ManaChart';

type DeckListType = {
  cards: Set<CardsTableType>;
  deleteFromDeckList: (c: CardsTableType) => void;
};
export interface ManaDataInterface {
  cmc: string;
  [MTGTypesEnum.CREATURE]: number;
  [MTGTypesEnum.INSTANT]: number;
  [MTGTypesEnum.SORCERY]: number;
  [MTGTypesEnum.ARTIFACT]: number;
  [MTGTypesEnum.ENCHANTMENT]: number;
}

const DeckList = (props: DeckListType) => {
  const [cards, setCards] = useState<CardsTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deckName, setDeckName] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [exportJson, setExportJson] = useState<string>('');
  const [manaData, setManaData] = useState<ManaDataInterface[]>([]);

  useEffect(() => {
    function init() {
      setCards(Array.from(props.cards));
      setIsLoading(false);
      let cardArr = Array.from(props.cards);
      let manaDataTmp: ManaDataInterface[] = [];
      for (let i = 0; i < 11; i++) {
        manaDataTmp.push({
          cmc: i === 10 ? '10+' : `${i}`,
          [MTGTypesEnum.CREATURE]: 0,
          [MTGTypesEnum.INSTANT]: 0,
          [MTGTypesEnum.SORCERY]: 0,
          [MTGTypesEnum.ARTIFACT]: 0,
          [MTGTypesEnum.ENCHANTMENT]: 0,
        });
      }
      for (let i = 0; i < cardArr.length; i++) {
        let card = cardArr[i];
        let pos = card.cmc > 10 ? 10 : card.cmc;
        if (card.type_line.toLowerCase().includes(MTGTypesEnum.ARTIFACT)) {
          manaDataTmp[pos][MTGTypesEnum.ARTIFACT]++;
        } else if (card.type_line.toLowerCase().includes(MTGTypesEnum.CREATURE)) {
          manaDataTmp[pos][MTGTypesEnum.CREATURE]++;
        } else if (card.type_line.toLowerCase().includes(MTGTypesEnum.ENCHANTMENT)) {
          manaData[pos][MTGTypesEnum.ENCHANTMENT]++;
        } else if (card.type_line.toLowerCase().includes(MTGTypesEnum.INSTANT)) {
          manaDataTmp[pos][MTGTypesEnum.INSTANT]++;
        } else if (card.type_line.toLowerCase().includes(MTGTypesEnum.SORCERY)) {
          manaDataTmp[pos][MTGTypesEnum.SORCERY]++;
        }
      }
      setManaData(manaDataTmp);
    }

    init();
  }, [props.cards, isLoading]);

  return isLoading ? (
    <CircularProgress />
  ) : (
    <div>
      <Grid container justifyContent={'center'} alignItems={'flex-start'} spacing={1}>
        <Grid item xs={12}>
          <ManaChart data={manaData} />
        </Grid>

        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            label={'Deck Name'}
            value={deckName}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              setDeckName(e.target.value)
            }
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
              href={`data:text/json;charset=utf-8,${encodeURIComponent(exportJson)}`}
              download={`${deckName}_${Date.now()}.json`}
            >
              download json
            </Button>
          )}

          <Button
            href={`data:application/octet-stream,${encodeURIComponent(
              Array.from(props.cards)
                .map((c) => c.name)
                .join('\n')
            )}`}
            download={`MTGDB_dump_${Date.now()}.txt`}
          >
            export just names
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4">
            Non-land cards: {Array.from(props.cards).length}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          {cards.map((c, i) => (
            <Card elevation={3} style={{ marginBottom: 5 }} key={i}>
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
