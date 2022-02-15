import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Pages, PageType } from "..";

const CarouselCard = ({ img, link, name, description }: PageType) => {
  return (
    <Card sx={{ maxWidth: 560 }} elevation={3}>
      <CardMedia component='img' image={img} />
      <CardContent>
        <Typography variant='h5'>{name}</Typography>
        <Typography variant='body2'>{description}</Typography>
      </CardContent>
      <CardActions>
        <Button size='small' component={Link} to={link}>
          bring me there
        </Button>
      </CardActions>
    </Card>
  );
};

const Carousel = () => {
  return (
    <Grid
      container
      direction='row'
      justifyContent='center'
      alignItems='center'
      spacing={1}
      style={{ margin: "auto" }}
    >
      {Pages.map((p, i) => {
        return (
          p.link !== "/" && (
            <Grid item md={4} key={i}>
              <CarouselCard {...p} />
            </Grid>
          )
        );
      })}
    </Grid>
  );
};

export default Carousel;
