import { Grid, makeStyles, Typography, Button, Link as MUILink } from '@material-ui/core';
import React from 'react';
import pp from '../img/pp.png';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import Pdf from '../img/Resume.pdf';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => {
  return {
    header: { textAlign: 'center', marginBottom: theme.spacing(4) },
    item: {
      width: '100%',
      textAlign: 'center',
      borderRadius: '5px',
      marginTop: '10px',
    },
    image: {
      width: window.innerWidth < 600 ? '90%' : '60%',
      height: 'auto',
    },
    imagecontainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: theme.spacing(3),
    },
    icons: { transform: 'scale(2)' },
    maintext: { width: '90%', margin: '5% auto 0 auto', textAlign: 'center' },
    root: { marginBottom: '20%', width: '100vw' },
  };
});

const AboutMe = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h3" className={classes.header}>
        Welcome to my developer profile.
      </Typography>
      <div className={classes.imagecontainer}>
        <img src={pp} className={classes.image} />
      </div>
      <div className={classes.imagecontainer}>
        <Button href="https://github.com/shermanleejm" target="_blank" rel="noopener">
          <GitHubIcon className={classes.icons} />
        </Button>
        <Button href="https://www.linkedin.com/in/shrmnl/" target="_blank" rel="noopener">
          <LinkedInIcon className={classes.icons} />
        </Button>
        <Button href={Pdf} target="_blank" rel="noopener">
          <MenuBookIcon className={classes.icons} />
        </Button>
      </div>
      <div className={classes.maintext}>
        <Typography>
          I make stuff. I have an asset tracker that you can play with{' '}
          <Link to="/tracker" component={MUILink}>
            here
          </Link>
          .
        </Typography>
      </div>
    </div>
  );
};

export default AboutMe;
