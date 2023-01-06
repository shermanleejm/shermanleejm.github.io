import { Card, CardContent, TextField, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';

type Props = {
  prefilled?: {
    name: string;
    datetime: number;
  };
};

const GoalCard = () => {
  const [goalName, setGoalName] = useState('');

  return (
    <Card>
      <CardContent>
        <TextField
          value={goalName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setGoalName(e.target.value)}
        />
        
      </CardContent>
    </Card>
  );
};

export default GoalCard;
