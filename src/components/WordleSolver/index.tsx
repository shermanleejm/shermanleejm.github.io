import { Button, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import WORDS from './words';

const WordleSolver = () => {
  const [_1, set_1] = useState('');
  const [_2, set_2] = useState('');
  const [_3, set_3] = useState('');
  const [_4, set_4] = useState('');
  const [_5, set_5] = useState('');
  const [wrongGuesses, setWrongGuesses] = useState('');
  const [incorrect, setIncorrect] = useState('');
  const [possible, setPossible] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    setWords(WORDS);
  }, []);

  function solve() {
    words.filter(w => _1 !== "")
  }

  return (
    <div
      style={{
        margin: 'auto',
        textAlign: 'center',
      }}
    >
      <Grid container alignItems={'center'} justifyContent={'center'} spacing={2}>
        <Grid item xs={12}>
          <TextField
            style={{ width: '2.5rem' }}
            value={_1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              set_1(e.target.value.replace(/[^a-z]/, '').substring(0, 1));
            }}
          />
          <TextField
            style={{ width: '2.5rem' }}
            value={_2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              set_2(e.target.value.replace(/[^a-z]/, '').substring(0, 1));
            }}
          />
          <TextField
            style={{ width: '2.5rem' }}
            value={_3}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              set_3(e.target.value.replace(/[^a-z]/, '').substring(0, 1));
            }}
          />
          <TextField
            style={{ width: '2.5rem' }}
            value={_4}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              set_4(e.target.value.replace(/[^a-z]/, '').substring(0, 1));
            }}
          />
          <TextField
            style={{ width: '2.5rem' }}
            value={_5}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              set_5(e.target.value.replace(/[^a-z]/, '').substring(0, 1));
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="wrong guesses"
            value={wrongGuesses}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWrongGuesses(
                Array.from(new Set(e.target.value.replace(/[^a-z]/, '').split(''))).join(
                  ''
                )
              )
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="incorrect placement"
            value={incorrect}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIncorrect(
                Array.from(new Set(e.target.value.replace(/[^a-z]/, '').split(''))).join(
                  ''
                )
              )
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Button fullWidth onClick={() => solve()}>
            solve me
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default WordleSolver;
