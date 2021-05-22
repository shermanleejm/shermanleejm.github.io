import { makeStyles } from '@material-ui/core';
import React from 'react';
import BoringTracker from './BoringTracker';
import CryptoTracker from './CryptoTracker';
import Countdown from './Countdown';

const useStyles = makeStyles((theme) => {
  return {
    root: { margin: '0 0% 0 0%' },
  };
});

const AssetTracker = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CryptoTracker />
      <Countdown />
      <BoringTracker />
    </div>
  );
};

export default AssetTracker;
