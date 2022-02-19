import { Button, Grid, TextField, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
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
  const [showTest, setShowTest] = useState(false);

  const START_DATE = Date.parse('09 Feb 2022 00:00:00');

  const test =
    WORDS[
      (Math.floor((Date.now() - START_DATE) / (1000 * 60 * 60 * 24)) + 237) % WORDS.length
    ];

  function solve() {
    setInitial(false);

    let wrongs = '';
    let incorrects = [incorrect_1, incorrect_2, incorrect_3, incorrect_4, incorrect_5];
    let incorrects_setters = [
      setIncorrect_1,
      setIncorrect_2,
      setIncorrect_3,
      setIncorrect_4,
      setIncorrect_5,
    ];
    let guess_setters = [set_1, set_2, set_3, set_4, set_5];
    let current = [_1, _2, _3, _4, _5];
    let expression = '';

    for (let i = 0; i < current.length; i++) {
      let c = current[i];
      if (!test.includes(c)) {
        wrongs += c;
        expression += '.';
      } else if (test[i] !== c) {
        incorrects[i] += c;
        expression += '.';
      } else {
        expression += c;
      }

      if (c === test[i]) {
        guess_setters[i](c);
      } else {
        guess_setters[i]('');
      }
    }

    const regex = new RegExp(expression);
    let tmp = WORDS.filter((w) => regex.test(w));
    for (let c of wrongGuesses + wrongs) {
      tmp = tmp.filter((w) => !w.includes(c));
    }
    setWrongGuesses(wrongGuesses + wrongs);
    for (let i = 0; i < incorrects.length; i++) {
      let inc = incorrects[i];
      for (let c of inc) {
        tmp = tmp.filter((w) => w.includes(c) && w[i] !== c);
      }
      incorrects_setters[i](inc);
    }

    setWords(tmp);
  }

  const ref1 = React.useRef<HTMLInputElement>();
  const ref2 = React.useRef<HTMLInputElement>();
  const ref3 = React.useRef<HTMLInputElement>();
  const ref4 = React.useRef<HTMLInputElement>();

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
              set_1(
                e.target.value
                  .replace(/[^a-zA-Z]/, '')
                  .substring(0, 1)
                  .toLowerCase()
              );
              ref1.current?.focus();
            }}
          />
          <TextField
            style={{ width: '2.5rem' }}
            value={_2}
            inputRef={ref1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              set_2(
                e.target.value
                  .replace(/[^a-zA-Z]/, '')
                  .substring(0, 1)
                  .toLowerCase()
              );
              ref2.current?.focus();
            }}
          />
          <TextField
            style={{ width: '2.5rem' }}
            value={_3}
            inputRef={ref2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              set_3(
                e.target.value
                  .replace(/[^a-zA-Z]/, '')
                  .substring(0, 1)
                  .toLowerCase()
              );
              ref3.current?.focus();
            }}
          />
          <TextField
            style={{ width: '2.5rem' }}
            value={_4}
            inputRef={ref3}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              set_4(
                e.target.value
                  .replace(/[^a-zA-Z]/, '')
                  .substring(0, 1)
                  .toLowerCase()
              );
              ref4.current?.focus();
            }}
          />
          <TextField
            style={{ width: '2.5rem' }}
            value={_5}
            inputRef={ref4}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              set_5(
                e.target.value
                  .replace(/[^a-zA-Z]/, '')
                  .substring(0, 1)
                  .toLowerCase()
              );
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
