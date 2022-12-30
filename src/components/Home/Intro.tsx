import { Grid, SvgIconTypeMap, Typography, Button, Link, Box } from '@mui/material';
import resume from '../../assets/Resume.pdf';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface IconButtonType {
  link: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
}

const IconButtons: IconButtonType[] = [
  { link: 'https://www.linkedin.com/in/shrmnl/', icon: LinkedInIcon },
  { link: 'https://github.com/shermanleejm', icon: GitHubIcon },
  { link: resume, icon: MenuBookIcon },
];

const Intro = () => {
  return (
    <Box sx={{ m: 2 }}>
      <Grid container direction="column" rowSpacing={4}>
        <Grid item>
          <Typography variant="h2">Welcome to my portfolio.</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h4">
            I am Sherman, a software engineer based in{' '}
            <Link
              href="https://www.google.com/maps/place/Guangzhou,+Guangdong+Province,+China/"
              target="_blank"
              rel="noreferrer"
            >
              Singapore.
            </Link>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h4">Take a look at my projects.</Typography>
        </Grid>
        <Grid item justifyContent={'center'}>
          <Grid container direction="row" justifyContent={'center'} spacing={5}>
            {IconButtons.map((ib) => {
              return (
                <Grid item>
                  <Button href={ib.link} target="_blank" rel="noopener" size="large">
                    <ib.icon style={{ transform: 'scale(2.0)' }} />
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Intro;
