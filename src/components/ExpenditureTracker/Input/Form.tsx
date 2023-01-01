import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { ChangeEvent, useState } from 'react';
import NumberFormat from 'react-number-format';
import { Add, Remove, Clear, HourglassEmpty, Paid } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { State } from '@/state/reducers';
import { ExpenditureTableType, FormCategories, TransactionTypes } from '@/database';
import { ToasterSeverityEnum } from '@/components/MTGDB';
import dayjs, { Dayjs } from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { uniq } from 'lodash';

type FormProps = {
  toaster: (m: string, e: ToasterSeverityEnum) => void;
};

const emptyForm = {
  [FormCategories.category]: '',
  [FormCategories.name]: '',
  [FormCategories.amount]: '',
  [FormCategories.datetime]: dayjs().unix(),
  [FormCategories.transactionType]: TransactionTypes.CREDIT,
};

const RECURRENCE_TYPES = {
  weekly: 'weekly',
  monthly: 'monthly',
  yearly: 'yearly',
} as const;
export type RecurrenceTypes = keyof typeof RECURRENCE_TYPES;

export default ({ toaster }: FormProps) => {
  const db = useSelector((state: State) => state.database);

  const existingCategories = useLiveQuery(async () => {
    // TODO: sort by popularity
    const categories = (await db.expenditure.toArray()).map(
      (val) => val[FormCategories.category]
    );

    const recurringCategories = (await db.recurring.toArray()).map((re) => re.name);

    return [...uniq(categories), ...uniq(recurringCategories)];
  });
  const [form, setForm] = useState<ExpenditureTableType>(emptyForm);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [chosenRecurrence, setChosenRecurrence] = useState<RecurrenceTypes>('monthly');

  function updateForm(type: FormCategories, value: any) {
    setForm({
      ...form,
      [type]: value,
    });
  }

  async function handleSubmit(type: TransactionTypes) {
    let isFilled = !Object.values(form).some(
      (x) => x === '' || x === null || x === undefined
    );
    if (!isFilled) {
      toaster('Please fill in all fields first.', ToasterSeverityEnum.ERROR);
      return;
    }

    if (type === TransactionTypes.RECURRING) {
      if (showRecurringModal === false) {
        setShowRecurringModal(true);
        return;
      }

      let inputDate = dayjs.unix(form.datetime);
      let cron: string;
      switch (chosenRecurrence) {
        case 'weekly':
          cron = `${chosenRecurrence} ${inputDate.day()}`;
          break;

        case 'monthly':
          cron = `${chosenRecurrence} ${inputDate.date()}`;
          break;

        case 'yearly':
          cron = `${chosenRecurrence} ${inputDate.format('DD-MM')}`;
          break;

        default:
          cron = `${chosenRecurrence} ${inputDate.day()}`;
          break;
      }
      db.recurring
        .add({
          name: form.name,
          amount: form.amount as number,
          cron: cron,
          start: form.datetime,
          category: form.category,
        })
        .then(() => {
          toaster('Recorded!', ToasterSeverityEnum.SUCCESS);
          setForm({ ...emptyForm, [FormCategories.datetime]: dayjs().unix() });
        });
      return;
    }

    await db.expenditure
      .add({ ...form, [FormCategories.transactionType]: type })
      .then(() => {
        toaster('Recorded!', ToasterSeverityEnum.SUCCESS);
        setForm({ ...emptyForm, [FormCategories.datetime]: dayjs().unix() });
      });
  }

  type TxnButtonsType = {
    endIcon: JSX.Element;
    type: TransactionTypes;
    color: 'success' | 'error' | 'warning' | 'info';
  };
  const TxnButtons: TxnButtonsType[] = [
    {
      endIcon: <Paid />,
      type: TransactionTypes.SALARY,
      color: 'info',
    },
    {
      endIcon: <Add />,
      type: TransactionTypes.DEBIT,
      color: 'success',
    },
    {
      endIcon: <HourglassEmpty />,
      type: TransactionTypes.RECURRING,
      color: 'warning',
    },
    {
      endIcon: <Remove />,
      type: TransactionTypes.CREDIT,
      color: 'error',
    },
  ];

  const boxStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const RecurringModal: React.FC = () => {
    const stndrd = (_n: string) => {
      let n = parseInt(_n);
      if (n === 1) return 'st';
      if (n === 2) return 'nd';
      if (n === 3) return 'rd';
      return 'th';
    };
    return (
      <Modal open={showRecurringModal} onClose={() => setShowRecurringModal(false)}>
        <Box sx={boxStyle}>
          <FormControl>
            <FormLabel>Type of reccurence</FormLabel>
            <RadioGroup
              value={chosenRecurrence}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setChosenRecurrence(event.target.value as RecurrenceTypes)
              }
            >
              <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
              <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
              <FormControlLabel value="yearly" control={<Radio />} label="Yearly" />
            </RadioGroup>
          </FormControl>

          <Typography>
            This will recur {chosenRecurrence}
            {chosenRecurrence === 'yearly'
              ? ` on ${dayjs.unix(form.datetime).format('D MMMM')}`
              : chosenRecurrence === 'monthly'
              ? ` on the ${dayjs.unix(form.datetime).format('D')}${stndrd(
                  dayjs.unix(form.datetime).format('D')
                )} day`
              : ` every ${dayjs.unix(form.datetime).format('dddd')}`}
          </Typography>

          <Button
            onClick={() => {
              handleSubmit(TransactionTypes.RECURRING);
              setShowRecurringModal(false);
            }}
          >
            confirm
          </Button>
        </Box>
      </Modal>
    );
  };

  return (
    <div>
      <Grid
        container
        justifyContent={'center'}
        alignItems={'center'}
        direction={'column'}
        spacing={2}
      >
        <Grid item>
          <Autocomplete
            clearOnEscape
            freeSolo
            autoSelect
            autoComplete
            options={existingCategories || []}
            sx={{ width: '80vw' }}
            value={form[FormCategories.category]}
            onChange={(e, val) => updateForm(FormCategories.category, val)}
            renderInput={(params) => <TextField {...params} label="Categories" />}
          />
        </Grid>
        <Grid item>
          <TextField
            autoCapitalize={'none'}
            label={'Name'}
            sx={{ width: '80vw' }}
            value={form[FormCategories.name]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateForm(FormCategories.name, e.target.value)
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {form.name !== '' && (
                    <IconButton
                      size="small"
                      onClick={() => updateForm(FormCategories.name, '')}
                    >
                      <Clear />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <NumberFormat
            style={{ width: '80vw' }}
            value={form[FormCategories.amount]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateForm(
                FormCategories.amount,
                Number(e.target.value.replace(/[^0-9.]/g, ''))
              )
            }
            prefix={'$'}
            thousandSeparator
            customInput={TextField}
            label="Amount"
            inputProps={{ inputMode: 'decimal' }}
          />
        </Grid>
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              inputFormat="DD MMM YYYY"
              label="Date"
              value={dayjs.unix(form[FormCategories.datetime])}
              onChange={(newDate: Dayjs | null) =>
                updateForm(
                  FormCategories.datetime,
                  newDate === null ? null : newDate.unix()
                )
              }
              renderInput={(params) => <TextField sx={{ width: '80vw' }} {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item>
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            {TxnButtons.map((btn) => (
              <Grid item xs={6}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    variant="contained"
                    color={btn.color}
                    endIcon={btn.endIcon}
                    size={'small'}
                    onClick={() => handleSubmit(btn.type)}
                  >
                    {btn.type}
                  </Button>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <RecurringModal />
    </div>
  );
};
