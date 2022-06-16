import { Link, Grid, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import otter from './otter.gif';
import logo from './mt carmel.png';
import moment from 'moment';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

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

          <Paper
            style={{
              backgroundColor: 'white',
              color: 'black',
              width: '198px',
              marginTop: '-20px',
            }}
          >
            <Grid
              container
              alignItems={'center'}
              justifyContent={'center'}
              direction="column"
              spacing={1}
            >
              <Grid item>
                <div
                  style={{
                    backgroundColor: '#a9dbc0',
                    padding: '10px',
                    borderRadius: '4px 4px 0px 0px',
                  }}
                >
                  <Typography>
                    <MeetingRoomIcon /> Gala
                    <span style={{ fontWeight: 'bold' }}>Night Check-in</span>
                  </Typography>
                </div>
              </Grid>
              <Grid item>{boldText(moment().format('DD MMM, h:mmA'))}</Grid>
              <Grid item>{boldText('GALA NIGHT')}</Grid>
              <Grid
                item
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <Box
                  component="img"
                  src={logo}
                  sx={{
                    width: '50%',
                    height: 'auto',
                    margin: 'auto',
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Typography style={{ color: 'white', paddingTop: '10px' }} variant="body2">
            <Link>
              <StarBorderIcon />
              Save this memory
            </Link>{' '}
            to Favourites
          </Typography>
        </Grid>
      </div>
    </div>
  );
};

export default Tracetogether;
