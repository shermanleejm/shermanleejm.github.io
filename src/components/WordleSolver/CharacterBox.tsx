import { TextField } from '@mui/material';
import { useState } from 'react';

const CharacterBox = () => {
  const [char, setChar] = useState('');
  return (
    <TextField
      style={{ width: '2.5rem' }}
      value={char}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setChar(e.target.value.replace(/[^a-z\S]/, '').replace(/\B[a-z\S]/, ''))
      }
    />
  );
};

export default CharacterBox;
