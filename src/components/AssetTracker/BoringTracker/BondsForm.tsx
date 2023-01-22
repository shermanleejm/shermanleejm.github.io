import { Bond, boringAtom } from '@/components/AssetTracker/BoringTracker';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useAtom } from 'jotai';
import { ChangeEvent, useState } from 'react';
import NumberFormat from 'react-number-format';

export const BOND_CRON = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  halfyearly: 'Half-yearly',
  yearly: 'Yearly',
} as const;
export type BondCron = keyof typeof BOND_CRON;

type Props = {
  setShowBondsForm: (_: boolean) => void;
};
export default ({ setShowBondsForm }: Props) => {
  const [boring, setBoring] = useAtom(boringAtom);
  const [bondData, setBondData] = useState({
    amount: null as number | null,
    startDate: dayjs().unix(),
    endDate: dayjs().add(1, 'M').unix() as number | null,
    interestRate: null as number | null,
    cron: 'halfyearly' as BondCron,
  });
  const [isForever, setIsForever] = useState(false);

  function handleSubmit() {
    let tmp = bondData as Bond;
    let _boring = boring;

    if (tmp.amount === null || tmp.interestRate === null) return;

    if (isForever) {
      tmp.endDate = null;
    }
    setBoring({
      ..._boring,
      bonds: [..._boring.bonds, tmp],
    });
    setShowBondsForm(false);
  }

  return (
    <Paper sx={{ p: 2, mb: 1 }} elevation={3}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NumberFormat
            fullWidth
            value={bondData.amount}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setBondData({
                ...bondData,
                amount: Number(e.target.value.replace(/[^0-9.]/g, '')),
              })
            }
            prefix={'$'}
            thousandSeparator
            customInput={TextField}
            label="Amount"
            inputProps={{ inputMode: 'decimal' }}
            isNumericString
          />
        </Grid>
        <Grid item xs={12}>
          <NumberFormat
            fullWidth
            value={bondData.interestRate}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setBondData({
                ...bondData,
                interestRate: Number(e.target.value.replace(/[^0-9.]/g, '')),
              })
            }
            suffix={'%'}
            thousandSeparator
            customInput={TextField}
            label="Interest Rate"
            inputProps={{ inputMode: 'decimal' }}
            isNumericString
          />
        </Grid>
        <Grid item xs={5}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              inputFormat="DD MMM YYYY"
              label="Start Date"
              value={dayjs.unix(bondData.startDate)}
              onChange={(newDate: Dayjs | null) =>
                setBondData({
                  ...bondData,
                  startDate: newDate?.unix() || dayjs().unix(),
                })
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={5}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              disabled={isForever}
              inputFormat="DD MMM YYYY"
              label="End Date"
              value={dayjs.unix(bondData.endDate!)}
              onChange={(newDate: Dayjs | null) =>
                setBondData({
                  ...bondData,
                  endDate: newDate?.unix() || dayjs().unix(),
                })
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={2}>
          <FormControlLabel
            label="4eva?"
            labelPlacement="top"
            control={
              <Checkbox
                checked={isForever}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setIsForever(e.target.checked)
                }
              />
            }
          />
        </Grid>
        <Grid item xs={12}>
          <RadioGroup
            value={bondData.cron}
            onChange={(e) =>
              setBondData({ ...bondData, cron: e.target.value as BondCron })
            }
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            {Object.keys(BOND_CRON).map((bc, index) => (
              <FormControlLabel
                key={index}
                value={bc}
                control={<Radio />}
                label={BOND_CRON[bc as BondCron]}
              />
            ))}
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth onClick={() => handleSubmit()}>
            submit
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
