import { Grid, Radio, RadioGroup, Typography, FormControlLabel } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

const Countdown = (props) => {
  const timings = {
    lse_close: Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      15,
      30,
      0
    ),
    lse_open: Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      7,
      0,
      0
    ),
    nyse_open: Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      13,
      30,
      0
    ),
    nyse_close: Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      20,
      0,
      0
    ),
  };

  function timeleft(endDate) {
    endDate = new Date(endDate);
    let difference = endDate - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }
  const [radioSelect, setRadioSelect] = useState('lse_open');
  const [remainingTime, setRemainingTime] = useState(timeleft(timings[radioSelect]));

  useEffect(() => {
    setTimeout(() => {
      setRemainingTime(timeleft(timings[radioSelect]));
    }, 1000);
  });

  function displayTimer() {
    if (Object.keys(remainingTime).length === 0) {
      return <Typography>The market is {radioSelect.split('_')[1]}.</Typography>;
    } else {
      return (
        <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
          <Grid item>
            <Typography>{remainingTime.hours}H</Typography>
          </Grid>
          <Grid item>
            <Typography>{remainingTime.minutes}M</Typography>
          </Grid>
          <Grid item>
            <Typography>{remainingTime.seconds}S</Typography>
          </Grid>
        </Grid>
      );
    }
  }

  return (
    <div style={{ textAlign: 'center', margin: "2% 0" }}>
      <RadioGroup
        value={radioSelect}
        onChange={(event) => setRadioSelect(event.target.value)}
        defaultValue="lse_open"
      >
        <Grid container direction="row" justify="center">
          {[
            { value: 'lse_open', name: 'LSE Opening' },
            { value: 'lse_close', name: 'LSE Closing' },
            { value: 'nyse_open', name: 'NYSE Opening' },
            { value: 'nyse_close', name: 'NYSE Closing' },
          ].map((row) => {
            return (
              <Grid item xs={6} sm={3}>
                <FormControlLabel
                  value={row.value}
                  label={row.name}
                  control={<Radio />}
                />
              </Grid>
            );
          })}
        </Grid>
      </RadioGroup>

      <div style={{ margin: 'auto' }}>{displayTimer()}</div>
    </div>
  );
};

export default Countdown;
