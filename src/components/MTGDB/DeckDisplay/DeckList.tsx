import { Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CardsTableType } from '../../../database';
import { MTGTypesEnum } from '../interfaces';
import DeckListItem from './DeckListItem';
import Category from './Category';
import ManaChart from './ManaChart';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { State } from '../../../state/reducers';
import { getDeckCards } from '..';

type DeckListProps = {
  cards: Set<CardsTableType>;
  addToDeckList: (item: CardsTableType) => void;
  deckName: string;
};
export interface ManaDataInterface {
  cmc: string;
  [MTGTypesEnum.CREATURE]: number;
  [MTGTypesEnum.INSTANT]: number;
  [MTGTypesEnum.SORCERY]: number;
  [MTGTypesEnum.ARTIFACT]: number;
  [MTGTypesEnum.ENCHANTMENT]: number;
  [MTGTypesEnum.PLANESWALKER]: number;
  [MTGTypesEnum.LAND]: number;
}

const DeckList = (props: DeckListProps) => {
  const [cards, setCards] = useState<CardsTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(true);
  const [exportJson, setExportJson] = useState<string>('');
  const [manaData, setManaData] = useState<ManaDataInterface[]>([]);
  const [categories, setCategories] = useState<(string | undefined)[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const db = useSelector((state: State) => state.database);

  useEffect(() => {
    async function init() {
      setIsLoading(false);
      let cardArr = await getDeckCards(db, props.deckName);
      setCards(cardArr);
      let manaDataTmp: ManaDataInterface[] = [];
      for (let i = 0; i < 12; i++) {
        manaDataTmp.push({
          cmc: i === 10 ? '10+' : i === 11 ? 'land' : `${i}`,
          [MTGTypesEnum.CREATURE]: 0,
          [MTGTypesEnum.INSTANT]: 0,
          [MTGTypesEnum.SORCERY]: 0,
          [MTGTypesEnum.ARTIFACT]: 0,
          [MTGTypesEnum.ENCHANTMENT]: 0,
          [MTGTypesEnum.PLANESWALKER]: 0,
          [MTGTypesEnum.LAND]: 0,
        });
      }
      for (let i = 0; i < cardArr.length; i++) {
        let card = cardArr[i];
        let pos = card.cmc > 10 ? 10 : card.cmc;
        let curr = card.type_line.toLowerCase();
        if (curr.includes(MTGTypesEnum.ENCHANTMENT)) {
          manaDataTmp[pos][MTGTypesEnum.ENCHANTMENT]++;
        } else if (curr.includes(MTGTypesEnum.CREATURE)) {
          manaDataTmp[pos][MTGTypesEnum.CREATURE]++;
        } else if (curr.includes(MTGTypesEnum.ARTIFACT)) {
          manaDataTmp[pos][MTGTypesEnum.ARTIFACT]++;
        } else if (curr.includes(MTGTypesEnum.INSTANT)) {
          manaDataTmp[pos][MTGTypesEnum.INSTANT]++;
        } else if (curr.includes(MTGTypesEnum.SORCERY)) {
          manaDataTmp[pos][MTGTypesEnum.SORCERY]++;
        } else if (curr.includes(MTGTypesEnum.PLANESWALKER)) {
          manaDataTmp[pos][MTGTypesEnum.PLANESWALKER]++;
        } else if (curr.includes(MTGTypesEnum.LAND)) {
          manaDataTmp[11][MTGTypesEnum.LAND]++;
        }
      }

      let _categories = await (
        await db.decks.where('name').equals(props.deckName).toArray()
      )
        .map((d) => d.category)
        .filter((v, i, s) => s.indexOf(v) === i);

      if (_categories.length === 0) {
        _categories.push('default');
      }

      setCategories(_categories);
      setManaData(manaDataTmp);
      setIsLoading(false);
    }

    init();
  }, [isLoading]);

  return isLoading ? (
    <CircularProgress />
  ) : (
    <div>
      <Grid container alignItems={'flex-start'} spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h4">Cards: {cards.length}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={1} wrap="nowrap" sx={{ overflow: 'auto' }}>
            {categories.map(
              (c) =>
                c && (
                  <Grid item xs={5}>
                    <Category
                      deckName={props.deckName}
                      title={c}
                      refreshParent={() => {
                        setIsLoading(true);
                      }}
                    />
                  </Grid>
                )
            )}
            <Grid item xs={2}>
              <div style={{ width: 200 }}>
                <TextField
                  fullWidth
                  label="add new category"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    if (e.key === 'Enter') {
                      setCategories((oldCategories) => [
                        ...oldCategories,
                        newCategoryName,
                      ]);
                      setNewCategoryName('');
                    }
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <TextField
            disabled
            size="small"
            fullWidth
            label={'Deck Name'}
            value={props.deckName}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {}}
          ></TextField>
        </Grid>

        <Grid item xs={12}>
          <ManaChart data={manaData} />
        </Grid>

        <Grid item xs={12}>
          {isGenerating ? (
            <Button
              onClick={() => {
                let tmp = cards.map((c) => {
                  let tmp = c;
                  tmp.tags.push(props.deckName);
                  tmp.tags = Array.from(new Set(tmp.tags));
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
              download={`${props.deckName}_${Date.now()}.json`}
              onClick={() => setIsGenerating(true)}
            >
              download json
            </Button>
          )}

          <Button
            href={`data:application/octet-stream,${encodeURIComponent(
              Array.from(props.cards)
                .map((c) => `1 ${c.name}`)
                .join('\n')
            )}`}
            download={`MTGDB_dump_${Date.now()}.txt`}
          >
            export just names
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default DeckList;
