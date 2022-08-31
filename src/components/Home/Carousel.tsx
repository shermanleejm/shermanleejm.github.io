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
    <Card elevation={3}>
      <CardMedia
        component="img"
        image={img}
        sx={{ height: "auto", maxWidth: '200' }}
      />
      <CardContent>
        <Typography variant="h5">{name}</Typography>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={link}>
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
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={1}
    >
      {Pages.map((p) => {
        if (p.disabled) {
          return;
        }
        return (
          p.link !== "/" && (
            <Grid item xs={12} md={4}>
              <CarouselCard {...p} />
            </Grid>
          )
        );
      })}
    </Grid>
  );
};

export default Carousel;
