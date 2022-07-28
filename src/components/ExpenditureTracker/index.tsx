import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ChangeEvent, useState } from 'react';
import NumberFormat from 'react-number-format';

const ExpenditureTracker = () => {
  enum FormCategories {
    category,
    name,
    amount,
    datetime,
  }

  interface FormType {
    [FormCategories.category]: string;
    [FormCategories.name]: string;
    [FormCategories.amount]: number | null;
    [FormCategories.datetime]: Date;
  }

  const [form, setForm] = useState<FormType>({
    [FormCategories.category]: '',
    [FormCategories.name]: '',
    [FormCategories.amount]: null,
    [FormCategories.datetime]: new Date(),
  });

  function updateForm(type: FormCategories, value: string | number | Date | null) {
    setForm({
      ...form,
      [type]: value,
    });
    console.log(form);
  }

  const categories = [
    { label: 'Food' },
    { label: 'Insurance' },
    { label: 'Tithe' },
    { label: 'Misc' },
  ];

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
            // onChange={(e, val) => updateForm(FormCategories.category, val?.label)}
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
          />
        </Grid>
        <Grid item>
          <NumberFormat
            style={{ width: '60vw' }}
            value={form[FormCategories.amount]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateForm(FormCategories.amount, e.target.value)
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
          <Button variant="contained" sx={{ width: '60vw' }}>
            submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ExpenditureTracker;
