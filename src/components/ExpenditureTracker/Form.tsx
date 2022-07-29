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

type FormProps = {
  toaster: (m: string, e: ToasterSeverityEnum) => void;
};

const Form = ({ toaster }: FormProps) => {
  const db = useSelector((state: State) => state.database);

  const [form, setForm] = useState<ExpenditureTableType>({
    [FormCategories.category]: '',
    [FormCategories.name]: '',
    [FormCategories.amount]: '',
    [FormCategories.datetime]: new Date(),
    [FormCategories.isCredit]: true,
  });

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
    db.expenditure.add(form);
    toaster('Recorded!', ToasterSeverityEnum.SUCCESS);
    setForm({
      [FormCategories.category]: '',
      [FormCategories.name]: '',
      [FormCategories.amount]: '',
      [FormCategories.datetime]: new Date(),
      [FormCategories.isCredit]: true,
    });
  }

  const categories = ['Food', 'Insurance', 'Tithe', 'Misc'];

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
            options={categories}
            sx={{ width: '60vw' }}
            value={form[FormCategories.category]}
            onChange={(e, val) => updateForm(FormCategories.category, val)}
            renderInput={(params) => <TextField {...params} label="Categories" />}
          />
        </Grid>
        <Grid item>
          <TextField
            label={'Name'}
            sx={{ width: '60vw' }}
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
            style={{ width: '60vw' }}
            value={form[FormCategories.amount]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateForm(FormCategories.amount, e.target.value.replace(/[^0-9.]/g, ''))
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
              value={form[FormCategories.datetime]}
              onChange={(newDate: Date | null) =>
                updateForm(FormCategories.datetime, newDate)
              }
              renderInput={(params) => <TextField sx={{ width: '60vw' }} {...params} />}
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
            credit
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ width: '27.5vw' }}
            endIcon={<RemoveIcon />}
            onClick={() => handleSubmit(false)}
          >
            debit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Form;
