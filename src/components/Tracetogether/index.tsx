import { Divider, Grid, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import otter from './otter.gif';
import moment from 'moment';

const Tracetogether = () => {
  const boldText = (text: string) => {
    return (
      <Typography>
        <Box sx={{ fontWeight: 'bold' }}>{text}</Box>
      </Typography>
    );
  };

  return (
    <div style={{ height: '100%' }}>
      <div
        style={{
          top: '50%',
          left: '50%',
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#106e5d',
          color: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          borderRadius: '10px',
          width: '300px',
          height: '500px',
        }}
      >
        <Grid
          container
          alignItems={'center'}
          justifyContent={'center'}
          direction="column"
        >
          <Box
            component="img"
            src={otter}
            alt="otter"
            sx={{
              width: '60%',
              height: 'auto',
            }}
          />
          {/* <Divider style={{ color: 'white', width: '100%', paddingTop: '-20%' }} /> */}
          {/* <hr style={{ color: 'white', width: '100%', marginTop: '-20%' }} /> */}

          <Paper style={{ backgroundColor: 'white', color: 'black' }}>
            <Grid
              container
              alignItems={'center'}
              justifyContent={'center'}
              direction="column"
              spacing={1}
              padding={1}
            >
              <Grid item>{boldText('GalaNight Check-in')}</Grid>
              <Grid item>{boldText(moment().format('DD MMM, hh.mmA'))}</Grid>
              <Grid item>{boldText('GALA NIGHT')}</Grid>
            </Grid>
          </Paper>
        </Grid>
      </div>
    </div>
  );
};

export default Tracetogether;
