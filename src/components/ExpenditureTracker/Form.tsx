import {
  Autocomplete,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ChangeEvent, useState } from 'react';
import NumberFormat from 'react-number-format';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearIcon from '@mui/icons-material/Clear';
import { useSelector } from 'react-redux';
import { State } from '../../state/reducers';
import { ExpenditureTableType, FormCategories } from '../../database';
import { ToasterSeverityEnum } from '../MTGDB';
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
  [FormCategories.isCredit]: true,
};

const Form = ({ toaster }: FormProps) => {
  const db = useSelector((state: State) => state.database);

  const existingCategories = useLiveQuery(async () => {
    const categories = await (
      await db.expenditure.toArray()
    ).map((val) => val[FormCategories.category]);

    return [...new Set(categories)];
  });
  const [form, setForm] = useState<ExpenditureTableType>(emptyForm);

  function updateForm(type: FormCategories, value: any) {
    setForm({
      ...form,
      [type]: value,
    });
  }

  function handleSubmit(type: boolean) {
    let isFilled = !Object.values(form).some(
      (x) => x === '' || x === null || x === undefined
    );
    if (!isFilled) {
      toaster('Please fill in all fields first.', ToasterSeverityEnum.ERROR);
      return;
    }

    db.expenditure.add({ ...form, [FormCategories.isCredit]: type }).then(() => {
      toaster('Recorded!', ToasterSeverityEnum.SUCCESS);
      setForm({ ...emptyForm, [FormCategories.datetime]: dayjs().unix() });
    });
  }

  return (
    <div style={{ paddingTop: '20px' }}>
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
            label={'Name'}
            sx={{ width: '80vw' }}
            value={form[FormCategories.name]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateForm(FormCategories.name, e.target.value)
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => updateForm(FormCategories.name, '')}>
                    <ClearIcon />
                  </IconButton>
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
            <DateTimePicker
              label="Date and Time"
              value={dayjs.unix(form[FormCategories.datetime])}
              onChange={(newDate: Dayjs | null) =>
                updateForm(FormCategories.datetime, newDate === null ? null : newDate.unix())
              }
              renderInput={(params) => <TextField sx={{ width: '80vw' }} {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            sx={{ width: '27.5vw', marginRight: '5vw' }}
            endIcon={<AddIcon />}
            onClick={() => handleSubmit(true)}
          >
            debit
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ width: '27.5vw' }}
            endIcon={<RemoveIcon />}
            onClick={() => handleSubmit(false)}
          >
            credit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Form;
