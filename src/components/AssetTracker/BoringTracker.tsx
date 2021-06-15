import {
  Button,
  makeStyles,
  TextField,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Grid,
  Paper,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles((theme) => {
  return {
    header: { margin: '3% 0 3% 0' },
    root: { margin: '0 4% 10% 4%' },
    apiinput: { width: '60%', margin: '0 0 3% 0' },
    table: { margin: '0 0 3% 0' },
    searchresult: { padding: '4%', marginBottom: '4%' },
  };
});

const BoringTracker = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setAPIKey] = useState() as any;
  const [keyword, setKeyword] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formStuff, setFormStuff] = useState() as any;
  const [formQuantity, setFormQuantity] = useState() as any;
  const [formPrice, setFormPrice] = useState('');
  const [boringData, setBoringData] = useState([]) as any;
  const [errorMessage, setErrorMessage] = useState() as any;
  const [refresh, setRefresh] = useState(false);

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

  useEffect(() => {
    async function getPrice(ticker: string) {
      let result = {};
      await axios
        .get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`
        )
        .then((resp) => {
          result = resp.data['Global Quote'];
        });
      return result;
    }

    async function fetchLocalData() {
      let item = JSON.parse(localStorage.getItem('apikey') || "");
      if (item !== "") {
        setAPIKey(item);
      } else {
        setAPIKey('1111111');
      }
      item = JSON.parse(localStorage.getItem('boring') || "");
      if (item !== "") {
        for (let line of item) {
          let tickerData: any = await getPrice(line.ticker);
          if (tickerData === undefined) {
            setErrorMessage('Alpha Vantage only allows 5 requests every minute.');
            setIsLoading(false);
            return;
          }
          line.high = parseFloat(tickerData['03. high']);
          line.low = parseFloat(tickerData['04. low']);
          line.open = parseFloat(tickerData['02. open']);
          line.pl = parseFloat(
            (((tickerData['02. open'] - line.price) / line.price) * 100).toFixed(2)
          );
        }
        localStorage.setItem('boring', JSON.stringify(shuffle(item)));
        setBoringData(item);
      }

      setErrorMessage(undefined);
      setIsLoading(false);
    }
    console.log('calling useEffect on Boring Tracker');
    fetchLocalData();
  }, [refresh]);

  async function queryTicker(kw: string) {
    await axios
      .get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${kw}&apikey=${apiKey}`
      )
      .then((resp) => {
        setSearchResults(resp.data.bestMatches);
      });
  }

  function calculatePL() {
    let starting = 0;
    let end = 0;
    for (let i = 0; i < boringData.length; i++) {
      let line: any = boringData[i];
      starting += line.quantity * line.price;
      end += line.quantity * line.open;
    }
    return parseFloat((((end - starting) / starting) * 100).toFixed(2));
  }

  return (
    <div className={classes.root}>
      <Typography style={{ color: 'red' }}>
        {errorMessage !== undefined && errorMessage}
      </Typography>

      <Typography variant="h4" className={classes.header}>
        Boring{' '}
        <span style={{ color: calculatePL() > 0 ? 'green' : 'red' }}>
          {calculatePL() > 0 && '+'}
          {calculatePL()}%
        </span>
      </Typography>

      <TextField
        label="Alpha Vantage API key"
        size="small"
        value={apiKey}
        onChange={(e) => setAPIKey(e.target.value)}
        className={classes.apiinput}
      />
      <Button
        onClick={() => {
          localStorage.setItem('apikey', JSON.stringify(apiKey));
        }}
      >
        save api key
      </Button>

      <TextField
        label="Add new boring equity"
        size="small"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className={classes.apiinput}
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

      {showSearchResults && keyword !== '' && (
        <TableContainer className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Correct?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{row['1. symbol']}</TableCell>
                    <TableCell>{row['2. name']}</TableCell>
                    <TableCell>{row['3. type']}</TableCell>
                    <TableCell>{row['4. region']}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setFormStuff({
                            symbol: row['1. symbol'],
                            name: row['2. name'],
                            type: row['3. type'],
                            region: row['4. region'],
                          });
                          setShowForm(true);
                          setShowSearchResults(false);
                        }}
                      >
                        <CheckIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {showForm && (
        <Paper className={classes.searchresult} elevation={3}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              Symbol: {formStuff.symbol}
            </Grid>
            <Grid item xs={8}>
              Name: {formStuff.name}
            </Grid>
            <Grid item xs={4}>
              Type: {formStuff.type}
            </Grid>
            <Grid item xs={8}>
              Region: {formStuff.region}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Quantity"
                type="number"
                // step={0.001}
                value={formQuantity}
                onChange={(e) => {
                  setFormQuantity(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Price"
                type="number"
                // step={0.001}
                value={formPrice}
                onChange={(e) => {
                  setFormPrice(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                onClick={() => {
                  let newData = {
                    ticker: formStuff.symbol,
                    quantity: formQuantity,
                    price: formPrice,
                  };
                  boringData.push(newData);
                  localStorage.setItem('boring', JSON.stringify(shuffle(boringData)));
                  setShowForm(false);
                }}
              >
                submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {!isLoading && (
        <TableContainer className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ticker</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Open</TableCell>
                <TableCell>High</TableCell>
                <TableCell>Low</TableCell>
                <TableCell>P/L (%)</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boringData.map((row: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{row.ticker}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.open}</TableCell>
                    <TableCell>{row.high}</TableCell>
                    <TableCell>{row.low}</TableCell>
                    <TableCell style={{ color: row.pl > 0 ? 'green' : 'red' }}>
                      {row.pl > 0 && '+'}
                      {row.pl}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          boringData.splice(index, 1);
                          localStorage.setItem(
                            'boring',
                            JSON.stringify(shuffle(boringData))
                          );
                          setIsLoading(true);
                        }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Button
        onClick={() => {
          setRefresh(!refresh);
          setBoringData(shuffle(boringData));
        }}
      >
        refresh
      </Button>
    </div>
  );
};

export default BoringTracker;
