import {
  Autocomplete,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ChangeEvent, useState } from 'react';
import NumberFormat from 'react-number-format';
import { Add, Remove, Clear, HourglassEmpty, Paid } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { State } from '@/state/reducers';
import { ExpenditureTableType, FormCategories, TransactionTypes } from '@/database';
import { ToasterSeverityEnum } from '@/components/MTGDB';
import dayjs, { Dayjs } from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';

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

const Form = ({ toaster }: FormProps) => {
  const db = useSelector((state: State) => state.database);

  const existingCategories = useLiveQuery(async () => {
    const categories = (await db.expenditure.toArray()).map(
      (val) => val[FormCategories.category]
    );

    return [...new Set(categories)];
  });
  const [form, setForm] = useState<ExpenditureTableType>(emptyForm);
  const [isRecurring, setIsRecurring] = useState(false);

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
    </div>
  );
};

export default Form;
