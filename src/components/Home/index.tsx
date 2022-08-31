import { Grid } from "@mui/material";
import Carousel from "./Carousel";
import Intro from "./Intro";

const Home = () => {
  return (
    <div style={{ padding: 40 }}>
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Intro />
        </Grid>

        <Grid item>
          <Carousel />
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
