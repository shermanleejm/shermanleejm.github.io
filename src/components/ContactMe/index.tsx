import { useState } from 'react';
import { TextField, Grid, Typography, Link, Button } from '@mui/material';

const ContactMe = () => {
  const [state, setState] = useState({
    formSubmitted: false,
    name: '',
    email: '',
    contactNumber: '',
    message: '',
  });

  function handleSubmit() {
    fetch(
      'https://docs.google.com/forms/d/e/1FAIpQLSeRk58rRnbE1XDd_6RZ6i9RIPTDPZT9YgsQ_4B7-Ff0mqQE3w/formResponse?usp=pp_url&entry.963742205=' +
        state.name +
        '&entry.1053435119=' +
        state.email +
        '&entry.1110637641=' +
        state.contactNumber +
        '&entry.63678808=' +
        state.message
    );
    setState({
      ...state,
      formSubmitted: true,
    });
  }

  return (
    <div>
      {state.formSubmitted ? (
        <div style={{ width: '80vw', padding: 20, margin: 'auto', height: '100vh' }}>
          <Typography variant="h4">
            Thank you for your submission I will get back to you as soon as possible!
          </Typography>
        </div>
      ) : (
        <div style={{ height: '100vh', width: '90vw', padding: 20, margin: 'auto' }}>
          <form
            name="gform"
            id="gform"
            encType="text/plain"
            action="https://docs.google.com/forms/d/e/1FAIpQLSeRk58rRnbE1XDd_6RZ6i9RIPTDPZT9YgsQ_4B7-Ff0mqQE3w/formResponse?"
            target="hidden_iframe"
            onSubmit={function () {
              'submitted=true;';
            }}
          >
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography variant="h5">
                  You may contact me at +65 86601996 and at{' '}
                  <Link href="mailto:leesherman@live.com.sg" color="secondary">
                    leesherman@live.com.sg
                  </Link>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  Alternatively, you may fill in the form below and I shall get back to
                  you as soon as possible.
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  color="secondary"
                  type="text"
                  name="entry.963742205"
                  id="entry.963742205"
                  label="Name"
                  onChange={(event) => {
                    setState({ ...state, name: event.target.value });
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  color="secondary"
                  type="text"
                  name="entry.1053435119"
                  id="entry.1053435119"
                  label="Email"
                  onChange={(event) => {
                    setState({ ...state, email: event.target.value });
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  color="secondary"
                  type="text"
                  name="entry.1110637641"
                  id="entry.1110637641"
                  label="Contact Number"
                  onChange={(event) => {
                    setState({ ...state, contactNumber: event.target.value });
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  color="secondary"
                  type="text"
                  name="entry.63678808"
                  id="entry.63678808"
                  label="Message"
                  onChange={(event) => {
                    setState({ ...state, message: event.target.value });
                  }}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item>
                <Button onClick={() => handleSubmit()}>submit</Button>
              </Grid>
            </Grid>
          </form>
          <iframe
            title="contact-me-page"
            name="hidden_iframe"
            id="hidden_iframe"
            style={{ display: 'none' }}
            onLoad={function () {
              'if (submitted) {}';
            }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ContactMe;
