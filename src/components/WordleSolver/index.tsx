import { Button, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import WORDS from './words';

const WordleSolver = () => {
  const [_1, set_1] = useState('');
  const [_2, set_2] = useState('');
  const [_3, set_3] = useState('');
  const [_4, set_4] = useState('');
  const [_5, set_5] = useState('');
  const [incorrect_1, setIncorrect_1] = useState('');
  const [incorrect_2, setIncorrect_2] = useState('');
  const [incorrect_3, setIncorrect_3] = useState('');
  const [incorrect_4, setIncorrect_4] = useState('');
  const [incorrect_5, setIncorrect_5] = useState('');
  const [wrongGuesses, setWrongGuesses] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [initial, setInitial] = useState<boolean>(true);
  const [test, setTest] = useState('');
  const [showTest, setShowTest] = useState(false);

  useEffect(() => {
    setWords(WORDS);
    setTest(WORDS[Math.floor(Math.random()) * WORDS.length]);
  }, []);

  function solve() {
    setInitial(false);

    let expression =
      (_1 === '' ? '.' : _1) +
      (_2 === '' ? '.' : _2) +
      (_3 === '' ? '.' : _3) +
      (_4 === '' ? '.' : _4) +
      (_5 === '' ? '.' : _5);

    const regex = new RegExp(expression);
    let tmp = words.filter((w) => regex.test(w));
    for (let c of wrongGuesses) {
      tmp = tmp.filter((w) => !w.includes(c));
    }
    for (let c of incorrect_1) {
      tmp = tmp.filter((w) => w.includes(c) && w[0] !== c);
    }
    for (let c of incorrect_2) {
      tmp = tmp.filter((w) => w.includes(c) && w[1] !== c);
    }
    for (let c of incorrect_3) {
      tmp = tmp.filter((w) => w.includes(c) && w[2] !== c);
    }
    for (let c of incorrect_4) {
      tmp = tmp.filter((w) => w.includes(c) && w[3] !== c);
    }
    for (let c of incorrect_5) {
      tmp = tmp.filter((w) => w.includes(c) && w[4] !== c);
    }

    setWords(tmp);
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
          {!showTest ? (
            <Button
              href="https://www.powerlanguage.co.uk/wordle/"
              target="_blank"
              onClick={() => {
                setShowTest(true);
              }}
            >
              WORDLE
            </Button>
          ) : (
            <>
              <TextField
                style={{ width: '2.5rem' }}
                value={test[0]}
                type={_1 === test[0] ? '' : 'password'}
              />
              <TextField
                style={{ width: '2.5rem' }}
                value={test[1]}
                type={_2 === test[1] ? '' : 'password'}
              />
              <TextField
                style={{ width: '2.5rem' }}
                value={test[2]}
                type={_3 === test[2] ? '' : 'password'}
              />
              <TextField
                style={{ width: '2.5rem' }}
                value={test[3]}
                type={_4 === test[3] ? '' : 'password'}
              />
              <TextField
                style={{ width: '2.5rem' }}
                value={test[4]}
                type={_5 === test[4] ? '' : 'password'}
              />
            </>
          )}
        </Grid>

        <Grid item>
          <Typography>TIP: best starting word is CRANE</Typography>
        </Grid>

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
          <Grid container justifyContent={'center'}>
            <Grid item xs={2}>
              <TextField
                label="incorrect (1)"
                value={incorrect_1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setIncorrect_1(e.target.value.replace(/[^a-z]/, ''));
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="incorrect (2)"
                value={incorrect_2}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setIncorrect_2(e.target.value.replace(/[^a-z]/, ''));
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="incorrect (3)"
                value={incorrect_3}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setIncorrect_3(e.target.value.replace(/[^a-z]/, ''));
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="incorrect (4)"
                value={incorrect_4}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setIncorrect_4(e.target.value.replace(/[^a-z]/, ''));
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="incorrect (5)"
                value={incorrect_5}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setIncorrect_5(e.target.value.replace(/[^a-z]/, ''));
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Button fullWidth onClick={() => solve()}>
            solve me
          </Button>
        </Grid>

        {!initial && (
          <Grid item>
            <Grid container direction={'row'} justifyContent="space-around" spacing={1}>
              {words.map((w) => (
                <Grid item xs={3}>
                  <Typography>{w}</Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default WordleSolver;
