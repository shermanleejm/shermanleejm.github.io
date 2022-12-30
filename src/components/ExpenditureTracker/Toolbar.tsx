import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Grid, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { getDateNumbers, monthOffsetAtom } from './Input';

export default function Toolbar() {
  const { minDate, totalMonths } = getDateNumbers();

  const [monthOffset, setMonthOffset] = useAtom(monthOffsetAtom);

  return (
    <Grid
      container
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      style={{ width: '80vw' }}
    >
      <Grid item>
        <IconButton
          onClick={() => setMonthOffset(Math.min(totalMonths - 1 ?? 0, monthOffset + 1))}
        >
          <ArrowBack />
        </IconButton>
      </Grid>
      <Grid item>
        <Typography>
          {dayjs
            .unix(minDate ?? dayjs().unix())
            .subtract(monthOffset, 'month')
            .format('MMM YYYY')}
        </Typography>
      </Grid>
      <Grid item>
        <IconButton onClick={() => setMonthOffset(Math.max(0, monthOffset - 1))}>
          <ArrowForward />
        </IconButton>
      </Grid>
    </Grid>
  );
}
