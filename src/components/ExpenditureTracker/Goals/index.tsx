import GoalCard from '@/components/ExpenditureTracker/Goals/GoalCard';
import { State } from '@/state/reducers';
import { Grid } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSelector } from 'react-redux';

export default () => {
  const db = useSelector((state: State) => state.database);
  const goals = useLiveQuery(() => db.goals.toArray());

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <GoalCard />
      </Grid>

      {goals?.map((g) => (
        <Grid item>
          <GoalCard existingIndex={g.id!} />
        </Grid>
      ))}
    </Grid>
  );
};
