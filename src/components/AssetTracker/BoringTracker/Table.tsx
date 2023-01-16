import {
  apiKeyAtom,
  Equity,
  boringAtom,
  refreshAtom,
} from '@/components/AssetTracker/BoringTracker';
import { Delete } from '@mui/icons-material';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

type Props = {
  setErrorMessage: (_: string | undefined) => void;
};

export default ({ setErrorMessage }: Props) => {
  const [boring, setBoring] = useAtom(boringAtom);
  const [refresh, setRefresh] = useAtom(refreshAtom);
  const [apiKey] = useAtom(apiKeyAtom);

  useEffect(() => {
    async function getPrice(ticker: string) {
      return await axios
        .get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`
        )
        .then((resp) => resp.data['Global Quote']);
    }

    async function fetchLocalData() {
      if (boring.equities.length > 0) {
        let updatedBoring = [] as Equity[];
        for (let line of boring.equities) {
          let tickerData: any = await getPrice(line.ticker);
          if (tickerData === undefined) {
            setErrorMessage('Alpha Vantage only allows 5 requests every minute.');
            return;
          } else {
            line.high = parseFloat(tickerData['03. high']);
            line.low = parseFloat(tickerData['04. low']);
            line.open = parseFloat(tickerData['02. open']);
            line.pl = parseFloat(
              (
                ((tickerData['02. open'] - parseFloat(line.price)) /
                  parseFloat(line.price)) *
                100
              ).toFixed(2)
            );
          }
          updatedBoring.push(line);
        }
        setBoring({
          ...boring,
          equities: updatedBoring,
        });
        setErrorMessage(undefined);
      }
    }

    fetchLocalData();
  }, [refresh, boring]);

  return boring.equities.length === 0 ? (
    <></>
  ) : (
    <TableContainer style={{ margin: '0 0 3% 0' }}>
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
          {boring.equities.map((row: any, index: number) => {
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
                      let tmp = boring.equities;
                      tmp.splice(index, 1);
                      setBoring({
                        ...boring,
                        equities: tmp,
                      });
                      setRefresh(!refresh);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
