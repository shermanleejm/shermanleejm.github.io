import {
  TextField,
  Typography,
  Button,
  IconButton,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CryptoTracker = () => {
  const [, setCurrencies] = useState([]) as any;
  const [cryptoCurrencies, setCryptoCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectCurrency] = useState('SGD');
  const [cryptoData, setCryptoData] = useState([]) as any;
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [formCrypto, setFormCrypto] = useState() as any;
  const [formValue, setFormValue] = useState() as any;
  const [formPrincipal, setFormPrincipal] = useState() as any;
  const [editValuesIndex, setEditValuesIndex] = useState({
    crypto: -1,
    quantity: -1,
    principal: -1,
  });
  useEffect(() => {
    // get current sell price
    async function getCurrentPrice(crypto: string, fiat: string) {
      let result = 0;
      await axios
        .get(`https://api.coinbase.com/v2/prices/${crypto}-${fiat}/sell`)
        .then((resp) => {
          result = parseFloat(resp.data.data.amount);
        });
      return result;
    }
    // get currencies
    async function fetchCurrency() {
      let result = [] as any;
      await axios.get('https://api.coinbase.com/v2/currencies').then((resp) => {
        let tempcurrencies = [];
        for (let c of resp.data.data) {
          tempcurrencies.push(c.id);
        }
        result = tempcurrencies;
        setCurrencies(tempcurrencies);
      });
      return result;
    }
    async function fetchCryptoCurrency(fiatCurrencies: string[]) {
      let result = [] as any;
      await axios
        .get('https://api.coinbase.com/v2/exchange-rates?currency=BTC')
        .then((resp) => {
          Object.keys(resp.data.data.rates).map((item) => {
            if (!fiatCurrencies.includes(item)) {
              result.push(item);
            }
            return '';
          });
          setCryptoCurrencies(result);
        });
    }
    // get stored values
    async function fetchStoredValues() {
      let x = await fetchCurrency();
      fetchCryptoCurrency(x);
      let temp = JSON.parse(localStorage.getItem('crypto') || '');
      if (temp !== '') {
        for (let line of temp) {
          let currPrice = await getCurrentPrice(line.name, selectCurrency);
          line.pl = parseFloat(
            (((currPrice * line.value - line.principal) / line.principal) * 100).toFixed(
              2
            )
          );
          line.currentPrice = currPrice;
        }
      } else {
        temp = [];
      }
      setCryptoData(temp);
      localStorage.setItem('crypto', JSON.stringify(temp));
      setIsLoading(false);
    }
    setTimeout(() => {
      fetchStoredValues();
    }, 60000);
    fetchStoredValues();
  }, [isLoading, selectCurrency]);

  function calculateNetProfit(): number {
    let total = 0;
    let pl = 0;
    for (let line of cryptoData) {
      pl += (line.principal * line.pl) / 100;
      total += line.principal;
    }
    return parseFloat(((pl / total) * 100).toFixed(2));
  }

  function displayPrincipal(principal: any) {
    principal = principal.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return principal;
  }

  const EditValuesButtons: React.FC<{}> = () => {
    return (
      <div style={{ display: 'inline-block', textAlign: 'center' }}>
        <IconButton
          onClick={() => {
            setEditValuesIndex({
              crypto: -1,
              quantity: -1,
              principal: -1,
            });
            localStorage.setItem('crypto', JSON.stringify(cryptoData));
            setIsLoading(true);
          }}
        >
          <CheckCircleIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setEditValuesIndex({
              crypto: -1,
              quantity: -1,
              principal: -1,
            });
          }}
        >
          <CancelIcon />
        </IconButton>
      </div>
    );
  };
  return (
    <div style={{ margin: '0 4% 0 4%' }}>
      <Typography variant="h4" style={{ margin: '0 0 1% 0' }}>
        Crypto {'  '}
        <span style={{ color: calculateNetProfit() > 0 ? 'green' : 'red' }}>
          {calculateNetProfit() > 0 ? '+' : ''}
          {calculateNetProfit()}%
        </span>
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography>Currency (Current Price)</Typography>
              </TableCell>
              <TableCell colSpan={editValuesIndex.quantity !== -1 ? 3 : 1}>
                <Typography>Quantity</Typography>
              </TableCell>
              <TableCell colSpan={editValuesIndex.principal !== -1 ? 3 : 1}>
                <Typography>Principal</Typography>
              </TableCell>
              <TableCell>
                <Typography>Current</Typography>
              </TableCell>
              <TableCell>
                <Typography>Profit/Loss (%)</Typography>
              </TableCell>
              <TableCell>
                <Typography>Delete</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              cryptoData.map((crypto: any, index: any) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      {`${crypto.name} (${selectCurrency}${displayPrincipal(
                        crypto.currentPrice
                      )})`}
                    </TableCell>
                    <TableCell colSpan={editValuesIndex.quantity !== -1 ? 3 : 1}>
                      {editValuesIndex.quantity === index ? (
                        <div style={{ width: '30vw' }}>
                          <NumberFormat
                            customInput={TextField}
                            value={crypto.value}
                            onValueChange={(values) => {
                              let { floatValue } = values;
                              let temp = cryptoData;
                              temp[index].value = floatValue;
                              setCryptoData(temp);
                            }}
                          />
                          <EditValuesButtons />
                        </div>
                      ) : (
                        <Typography
                          onClick={() => {
                            setFormValue(crypto.value);
                            setEditValuesIndex({
                              crypto: -1,
                              quantity: index,
                              principal: -1,
                            });
                          }}
                        >
                          {crypto.value}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell colSpan={editValuesIndex.principal !== -1 ? 3 : 1}>
                      {editValuesIndex.principal === index ? (
                        <div style={{ width: '30vw' }}>
                          <NumberFormat
                            customInput={TextField}
                            prefix={selectCurrency}
                            value={crypto.principal}
                            onValueChange={(values) => {
                              let { floatValue } = values;
                              let temp = cryptoData;
                              temp[index].principal = floatValue;
                              setCryptoData(temp);
                            }}
                          />

                          <span style={{ display: 'inline-block', textAlign: 'center' }}>
                            <IconButton
                              onClick={() => {
                                setEditValuesIndex({
                                  crypto: -1,
                                  quantity: -1,
                                  principal: -1,
                                });
                                localStorage.setItem(
                                  'crypto',
                                  JSON.stringify(cryptoData)
                                );
                                setIsLoading(true);
                              }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setEditValuesIndex({
                                  crypto: -1,
                                  quantity: -1,
                                  principal: -1,
                                });
                              }}
                            >
                              <CancelIcon />
                            </IconButton>
                          </span>
                        </div>
                      ) : (
                        <Typography
                          onClick={() => {
                            setEditValuesIndex({
                              crypto: -1,
                              principal: index,
                              quantity: -1,
                            });
                            setFormPrincipal(crypto.principal);
                          }}
                        >
                          {selectCurrency}
                          {displayPrincipal(crypto.principal)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {selectCurrency}
                        {(
                          parseFloat(crypto.currentPrice) * parseFloat(crypto.value)
                        ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell style={{ color: crypto.pl > 0 ? 'green' : 'red' }}>
                      <Typography>
                        {crypto.pl > 0 && '+'}
                        {crypto.pl || ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          cryptoData.splice(index, 1);
                          localStorage.setItem('crypto', JSON.stringify(cryptoData));
                          setIsLoading(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            {showAddEntry && (
              <TableRow>
                <TableCell style={{ paddingRight: '5%' }}>
                  <Autocomplete
                    style={{ padding: '3% 0 3% 0' }}
                    options={cryptoCurrencies}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Crypto"
                        size="small"
                      />
                    )}
                    onChange={(e, value) => setFormCrypto(value)}
                  />
                </TableCell>
                <TableCell>
                  <NumberFormat
                    style={{ width: '25vw' }}
                    customInput={TextField}
                    value={formValue}
                    onValueChange={(values) => {
                      let { floatValue } = values;
                      setFormValue(floatValue || '');
                    }}
                  />
                </TableCell>
                <TableCell>
                  <NumberFormat
                    style={{ width: '25vw' }}
                    customInput={TextField}
                    prefix={selectCurrency}
                    value={formPrincipal}
                    onValueChange={(values) => {
                      let { floatValue } = values;
                      setFormPrincipal(floatValue);
                    }}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {showAddEntry ? (
        <div>
          <Button
            onClick={() => {
              if (
                formCrypto !== undefined &&
                formPrincipal !== undefined &&
                formValue !== undefined
              ) {
                cryptoData.push({
                  name: formCrypto,
                  value: formValue,
                  principal: formPrincipal,
                });
                localStorage.setItem('crypto', JSON.stringify(cryptoData));
                setIsLoading(true);
              }
              setShowAddEntry(false);
            }}
          >
            submit
          </Button>
          <Button
            onClick={() => {
              setShowAddEntry(false);
            }}
          >
            cancel
          </Button>
        </div>
      ) : (
        <Button onClick={() => setShowAddEntry(true)}>+ add item</Button>
      )}
      <Button onClick={() => setIsLoading(true)}>Refresh</Button>
      <hr />
    </div>
  );
};
export default CryptoTracker;
