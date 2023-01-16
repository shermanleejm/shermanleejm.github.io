import { boringAtom } from '@/components/AssetTracker/BoringTracker';
import { Button, Grid, Paper, TextField } from '@mui/material';
import { useAtom } from 'jotai';

type Props = {
  formStuff: {
    symbol: string;
    name: string;
    type: string;
    region: string;
  };
  formValue: { price: string; quantity: string };
  setFormValue: (_: { price: string; quantity: string }) => void;
  setShowForm: (_: boolean) => void;
};

export default ({ formStuff, formValue, setFormValue, setShowForm }: Props) => {
  const [boring, setBoring] = useAtom(boringAtom);

  return (
    <Paper style={{ padding: '4%', marginBottom: '4%' }} elevation={3}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          Symbol: {formStuff.symbol}
        </Grid>
        <Grid item xs={8}>
          Name: {formStuff.name}
        </Grid>
        <Grid item xs={4}>
          Type: {formStuff.type}
        </Grid>
        <Grid item xs={8}>
          Region: {formStuff.region}
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Quantity"
            type="number"
            value={formValue.quantity}
            onChange={(e) => {
              setFormValue({
                ...formValue,
                quantity: e.target.value,
              });
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Price"
            type="number"
            value={formValue.price}
            onChange={(e) => {
              setFormValue({
                ...formValue,
                price: e.target.value,
              });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            onClick={() => {
              setBoring({
                ...boring,
                equities: [
                  ...boring.equities,
                  {
                    ticker: formStuff.symbol,
                    quantity: formValue.quantity,
                    price: formValue.price,
                  },
                ],
              });

              setShowForm(false);
            }}
          >
            submit
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
