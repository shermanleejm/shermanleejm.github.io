import { getDateNumbers } from '@/components/ExpenditureTracker/Input';
import { calculateRecurring } from '@/components/ExpenditureTracker/Input/BigNumbers';
import { toasterAtom } from '@/components/ExpenditureTracker/Toaster';
import { GoalsTableType, positiveTypes, TransactionTypes } from '@/database';
import { State } from '@/state/reducers';
import { DeleteForever } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAtom } from 'jotai';
import React, { ChangeEvent, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';

type Props = {
  existingIndex?: number;
};
const DEFAULT_STATE = {
  startDate: dayjs().add(-1, 'day').unix(),
  endDate: dayjs().unix(),
} as const;
type DEFAULT_STATE_KEYS = keyof typeof DEFAULT_STATE;

const GoalCard = ({ existingIndex }: Props) => {
  const db = useSelector((state: State) => state.database);
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalDates, setGoalDates] = useState<{ startDate: number; endDate: number }>(
    DEFAULT_STATE
  );
  const [, setToaster] = useAtom(toasterAtom);
  const { startDate, endDate } = getDateNumbers();

  const goal =
    existingIndex && useLiveQuery(() => db.goals.where({ id: existingIndex }).first());

  const savings = useLiveQuery(async () => {
    const firstPaycheck =
      (
        await db.expenditure
          .where({
            txn_type: TransactionTypes.SALARY,
          })
          .first()
      )?.datetime || 0;

    const allRecurring = calculateRecurring(
      await db.recurring.where('start').belowOrEqual(dayjs().unix()).toArray(),
      firstPaycheck,
      endDate
    ).reduce((acc, v) => acc + (v.amount as number), 0);

    let total = (await db.expenditure.toArray()).reduce(
      (total, { amount, txn_type }) =>
        total +
        ([TransactionTypes.CREDIT, TransactionTypes.RECURRING].includes(txn_type)
          ? Number(amount) * -1
          : Number(amount)),
      0
    );

    return total - allRecurring;
  });

  function recordNewGoal() {
    db.goals
      .add({
        name: goalName,
        startDate: goalDates.startDate,
        endDate: goalDates.endDate,
        amount: parseFloat(goalAmount),
      })
      .then(() => {
        setGoalName('');
        setGoalAmount('');
        setGoalDates(DEFAULT_STATE);
        setToaster({
          show: true,
          message: `New goal: ${goalName} from ${dayjs
            .unix(goalDates.startDate)
            .format('DD MMM YYYY')} to ${dayjs
            .unix(goalDates.endDate)
            .format('DD MMM YYYY')}`,
          severity: 'info',
        });
      });
  }

  function deleteGoal() {
    db.goals.delete(existingIndex!).then(() => {
      setToaster({
        show: true,
        message: `Removed ${(goal as GoalsTableType).name}. Are you a quiter?`,
        severity: 'warning',
      });
    });
  }

  const CustomDatePicker: React.FC<{ which: DEFAULT_STATE_KEYS }> = ({ which }) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          disabled={goal !== undefined}
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
  };

  function onTrackStatus(): string {
    let good = '🎉 Whoohoo! you are on track to achieving this 🎉';
    let bad = 'You need to buck up 😥';
    if (!savings || (existingIndex === undefined && goalAmount === '')) return '';
    if (goal) {
      savings > goal.amount ? good : bad;
    }
    return savings > parseFloat(goalAmount) ? good : bad;
  }

  return (
    <Card sx={{ width: '90vw' }}>
      <CardContent>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Goal Name"
              fullWidth
              value={goal ? goal.name : goalName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setGoalName(e.target.value)}
              disabled={goal !== undefined}
            />
          </Grid>

          <Grid item xs={12}>
            <NumberFormat
              value={goal ? goal.amount : goalAmount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setGoalAmount(e.target.value.replace(/[^0-9.]/g, ''))
              }
              prefix={'$'}
              thousandSeparator
              customInput={TextField}
              label="Amount"
              fullWidth
              disabled={goal !== undefined}
              inputProps={{ inputMode: 'decimal' }}
            />
          </Grid>

          <Grid item xs={6}>
            <CustomDatePicker which="startDate" />
          </Grid>

          <Grid item xs={6}>
            <CustomDatePicker which="endDate" />
          </Grid>

          {existingIndex && (
            <>
              <Grid item xs={6}>
                num of months
              </Grid>
              <Grid item xs={6}>
                monthly amount
              </Grid>
            </>
          )}

          <Grid item>{onTrackStatus()}</Grid>
        </Grid>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button size="small" onClick={() => recordNewGoal()}>
          submit
        </Button>

        {existingIndex && (
          <IconButton sx={{ color: 'red' }} onClick={() => deleteGoal()}>
            <DeleteForever />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default GoalCard;
