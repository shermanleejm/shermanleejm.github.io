import React, { Component } from "react";
import {
  Paper,
  TextField,
  Grid,
  Typography,
  Button,
  Link,
  makeStyles,
} from "@material-ui/core";

class ContactMe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSubmitted: false,
      name: "",
      email: "",
      contactNumber: "",
      message: "",
    };
  }

  handleSubmit() {
    fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLSeRk58rRnbE1XDd_6RZ6i9RIPTDPZT9YgsQ_4B7-Ff0mqQE3w/formResponse?usp=pp_url&entry.963742205=" +
        this.state.name +
        "&entry.1053435119=" +
        this.state.email +
        "&entry.1110637641=" +
        this.state.contactNumber +
        "&entry.63678808=" +
        this.state.message
    );
    this.setState({
      formSubmitted: true,
    });
  }

  render() {
    if (this.state.formSubmitted) {
      return (
        <div style={{ width: "80vw", padding: 20, margin: "auto", height:"100vh" }}>
          <Typography variant="h4">
            Thank you for your submission I will get back to you as soon as
            possible!
          </Typography>
        </div>
      );
    } else {
      return (
        <div style={{ height: '100vh', width: '90vw', padding: 20, margin: 'auto' }}>
          <form
            name="gform"
            id="gform"
            encType="text/plain"
            action="https://docs.google.com/forms/d/e/1FAIpQLSeRk58rRnbE1XDd_6RZ6i9RIPTDPZT9YgsQ_4B7-Ff0mqQE3w/formResponse?"
            target="hidden_iframe"
            onSubmit="submitted=true;"
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
                    this.setState({ name: event.target.value });
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
                    this.setState({ email: event.target.value });
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
                    this.setState({ contactNumber: event.target.value });
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
                    this.setState({ message: event.target.value });
                  }}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item>
                <input
                  id="popUp"
                  type="submit"
                  value="submit"
                  onClick={() => this.handleSubmit()}
                  style={{
                    border: 'none',
                    backgroundColor: '#ffffff',
                    fontSize: '15px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                />
              </Grid>
            </Grid>
          </form>
          {/* <Button
            onClick={() => {
              console.log(this.state);
            }}
          >
            Check values
          </Button> */}
          <iframe
            name="hidden_iframe"
            id="hidden_iframe"
            style={{ display: 'none' }}
            onLoad="if(submitted) {}"
          ></iframe>
        </div>
      );
    }
  }
}

export default ContactMe;
// https://docs.google.com/forms/d/e/1FAIpQLSeRk58rRnbE1XDd_6RZ6i9RIPTDPZT9YgsQ_4B7-Ff0mqQE3w/viewform?usp=pp_url&entry.963742205=Sherman&entry.1053435119=leesherman@live.com.sg&entry.1110637641=86601996&entry.63678808=you+rock!
// https://docs.google.com/forms/d/e/1FAIpQLSeRk58rRnbE1XDd_6RZ6i9RIPTDPZT9YgsQ_4B7-Ff0mqQE3w/formResponse?usp=pp_url&entry.963742205=Name&entry.1053435119=Email&entry.1110637641=Mobile+Number&entry.63678808=Question
