import { Grid, TextField } from '@mui/material';
import { useState } from 'react';
import WORDS from './words';

const WordleSolver = () => {
  const [currentGuesses, setCurrentGuesses] = useState<{ [key: string]: string }>({
    '1': 'a',
    '2': 's',
    '3': 'd',
    '4': 'f',
    '5': 'g',
  });
  const [firstChar, setFirstChar] = useState('');

  const Guesses = () => {
    return (
      <div style={{ textAlign: 'center' }}>
        {Object.keys(currentGuesses).map((val) => (
          <TextField
            style={{ width: '2.5rem' }}
            value={currentGuesses[val]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              let newGuesses = currentGuesses;
              newGuesses[val] = e.target.value.substring(0, 1);
              console.log(newGuesses);
              setCurrentGuesses(newGuesses);
            }}
          ></TextField>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Grid container alignItems={'center'} justifyContent={'center'}>
        <Grid item>
          <Guesses />
        </Grid>
      </Grid>
    </div>
  );
};

export default WordleSolver;
