import { Button, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { atomWithStorage } from 'jotai/utils';
import { atom, useAtom } from 'jotai';
import BoringForm from '@/components/AssetTracker/BoringTracker/Form';
import BoringTable from '@/components/AssetTracker/BoringTracker/Table';
import SearchResults from '@/components/AssetTracker/BoringTracker/SearchResults';
import { calculatePortfolioValue } from '@/components/AssetTracker/BoringTracker/hooks';
import BondsForm, { BondCron } from '@/components/AssetTracker/BoringTracker/BondsForm';

export type Bond = {
  amount: number;
  startDate: number;
  endDate: number | null;
  interestRate: number;
  cron: BondCron;
};
export type Equity = {
  ticker: string;
  quantity: string;
  price: string;
  high?: number;
  low?: number;
  open?: number;
  pl?: number;
};
export const apiKeyAtom = atomWithStorage('apiKey', '111111111');
export const boringAtom = atomWithStorage('boring', {
  bonds: [] as Bond[],
  equities: [] as Equity[],
});
export const refreshAtom = atom(false);
export const keywordAtom = atom('');

export default () => {
  const [apiKey, setAPIKey] = useAtom(apiKeyAtom);
  const [boring, setBoring] = useAtom(boringAtom);
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const [refresh, setRefresh] = useAtom(refreshAtom);

  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showBondsForm, setShowBondsForm] = useState(true);
  const [formStuff, setFormStuff] = useState() as any;
  const [formValue, setFormValue] = useState({ price: '', quantity: '' });
  const [errorMessage, setErrorMessage] = useState() as any;

  function shuffle(array: any[]) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  async function queryTicker(kw: string) {
    await axios
      .get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${kw}&apikey=${apiKey}`
      )
      .then((resp) => {
        setSearchResults(resp.data.bestMatches);
      });
  }

  function handleSearch() {
    if (keyword === 'bonds') {
      setShowBondsForm(true);
      return;
    }
    queryTicker(keyword);
    setShowSearchResults(true);
  }

  return (
    <div style={{ margin: '0 4% 10% 4%' }}>
      <Grid
        container
        direction={'row'}
        justifyContent={'flex-start'}
        alignItems={'flex-start'}
        spacing={2}
      >
        <Grid item xs={12}>
          <Typography style={{ color: 'red' }}>
            {errorMessage !== undefined && errorMessage}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" style={{ margin: '3% 0 3% 0' }}>
            Boring{' '}
            <span style={{ color: calculatePortfolioValue() >= 0 ? 'green' : 'red' }}>
              {calculatePortfolioValue() > 0 && '+'}
              {calculatePortfolioValue()}%
            </span>
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <TextField
            label="Alpha Vantage API key"
            size="small"
            value={apiKey}
            onChange={(e) => setAPIKey(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={10}>
          <TextField
            fullWidth
            label="Add new boring"
            size="small"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            inputProps={{ autoCapitalize: 'none', autoCorrect: 'off' }}
          />
          <Typography variant="subtitle2">For bonds type "bonds"</Typography>
        </Grid>
        <Grid item xs={2}>
          <Button disabled={!keyword} onClick={() => handleSearch()}>
            search
          </Button>
        </Grid>
      </Grid>

      {showSearchResults && !['', 'bonds'].includes(keyword) && (
        <SearchResults
          {...{ setShowForm, setShowSearchResults, setFormStuff, searchResults }}
        />
      )}

      {showForm && (
        <BoringForm {...{ formStuff, formValue, setFormValue, setShowForm }} />
      )}

      {showBondsForm && <BondsForm {...{ setShowBondsForm }} />}

      <BoringTable {...{ setErrorMessage }} />

      <Button
        onClick={() => {
          setRefresh(!refresh);
        }}
      >
        refresh
      </Button>
    </div>
  );
};
