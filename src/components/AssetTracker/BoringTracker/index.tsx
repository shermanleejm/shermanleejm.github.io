import { Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { atomWithStorage } from 'jotai/utils';
import { atom, useAtom } from 'jotai';
import BoringForm from '@/components/AssetTracker/BoringTracker/Form';
import BoringTable from '@/components/AssetTracker/BoringTracker/Table';
import SearchResults from '@/components/AssetTracker/BoringTracker/SearchResults';
import { calculatePortfolioValue } from '@/components/AssetTracker/BoringTracker/hooks';

export interface Boring {
  ticker: string;
  quantity: string;
  price: string;
  high?: number;
  low?: number;
  open?: number;
  pl?: number;
}
export const apiKeyAtom = atomWithStorage('apiKey', '111111111');
export const boringAtom = atomWithStorage('boring', [] as Boring[]);
export const refreshAtom = atom(false);

export default () => {
  const [apiKey, setAPIKey] = useAtom(apiKeyAtom);
  const [boring, setBoring] = useAtom(boringAtom);

  const [keyword, setKeyword] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formStuff, setFormStuff] = useState() as any;
  const [formValue, setFormValue] = useState({ price: '', quantity: '' });
  const [errorMessage, setErrorMessage] = useState() as any;
  const [refresh, setRefresh] = useAtom(refreshAtom);

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

  return (
    <div style={{ margin: '0 4% 10% 4%' }}>
      <Typography style={{ color: 'red' }}>
        {errorMessage !== undefined && errorMessage}
      </Typography>

      <Typography variant="h4" style={{ margin: '3% 0 3% 0' }}>
        Boring{' '}
        <span style={{ color: calculatePortfolioValue() >= 0 ? 'green' : 'red' }}>
          {calculatePortfolioValue() > 0 && '+'}
          {calculatePortfolioValue()}%
        </span>
      </Typography>

      <TextField
        label="Alpha Vantage API key"
        size="small"
        value={apiKey}
        onChange={(e) => setAPIKey(e.target.value)}
        style={{ width: '60%', margin: '0 0 3% 0' }}
      />

      <TextField
        label="Add new boring equity"
        size="small"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ width: '60%', margin: '0 0 3% 0' }}
      />
      <Button
        disabled={!keyword}
        onClick={() => {
          queryTicker(keyword);
          setShowSearchResults(true);
        }}
      >
        search
      </Button>

      {showSearchResults && keyword !== '' && keyword !== 'bonds' && (
        <SearchResults
          {...{ setShowForm, setShowSearchResults, setFormStuff, searchResults }}
        />
      )}

      {showForm && keyword === 'bonds' && (
        <BoringForm {...{ formStuff, formValue, setFormValue, setShowForm }} />
      )}

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
