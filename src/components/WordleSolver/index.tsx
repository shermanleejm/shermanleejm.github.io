import { Grid, TextField } from '@mui/material';
import { useState } from 'react';
import WORDS from './words';

const WordleSolver = () => {
  const [currentGuesses, setCurrentGuesses] = useState<string[]>(['', '', '', '', '']);
  return (
    <div>
      <Grid container>
        <Grid item>
          <TextField style={{ width: '10%' }}></TextField>
          <TextField style={{ width: '10%' }}></TextField>
          <TextField style={{ width: '10%' }}></TextField>
          <TextField style={{ width: '10%' }}></TextField>
          <TextField style={{ width: '10%' }}></TextField>
        </Grid>
      </Grid>
    </div>
  );
};

export default WordleSolver;
