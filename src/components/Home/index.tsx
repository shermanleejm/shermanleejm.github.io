import { Grid } from '@mui/material';
import Carousel from './Carousel';
import Intro from './Intro';

const Home = () => {
  return (
    <Grid container direction="column" spacing={4} style={{ padding: '40px' }}>
      <Grid item>
        <Intro />
      </Grid>

      <Grid item>
        <Carousel />
      </Grid>
    </Grid>
  );
};

export default Home;
