import { Box, Grid } from '@mui/material';
import Carousel from './Carousel';
import Intro from './Intro';

export default () => {
  return (
    <Box sx={{ p: 1 }}>
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Intro />
        </Grid>

        <Grid item>
          <Carousel />
        </Grid>
      </Grid>
    </Box>
  );
};
