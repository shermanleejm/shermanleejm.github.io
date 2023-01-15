import { DEFAULT_STATE_KEYS } from '@/components/ExpenditureTracker/Goals/GoalCard';
import { GoalsTableType } from '@/database';
import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

type Props = {
  which: DEFAULT_STATE_KEYS;
  goal: 0 | GoalsTableType | undefined;
  goalDates: { startDate: number; endDate: number };
  setGoalDates: (lol: any) => void;
  isForever: boolean;
};

export default function ({ which, goal, goalDates, setGoalDates, isForever }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        disabled={goal !== undefined || (which === 'endDate' && isForever)}
        inputFormat="DD/MM/YYYY"
        label={which === 'startDate' ? 'Start Date' : 'End Date'}
        value={dayjs.unix(goalDates[which])}
        views={['day', 'month', 'year']}
        onChange={(newDate: Dayjs | null) =>
          setGoalDates(
            which === 'startDate'
              ? {
                  ...goalDates,
                  startDate: newDate?.unix() || 0,
                }
              : {
                  ...goalDates,
                  endDate: newDate?.unix() || 0,
                }
          )
        }
        renderInput={(params) => <TextField fullWidth {...params} />}
      />
    </LocalizationProvider>
  );
}
