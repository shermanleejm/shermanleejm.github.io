import React, { Component } from "react";
import { Paper, Card, Typography, Link } from "@material-ui/core";
import Pdf from "./Resume.pdf";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Paper color="secondary" elevation={0}>
          <Typography variant="h1">
            Hi. My name is Sherman.<br></br>
          </Typography>
          <Typography variant="h2">Welcome to my developer profile.</Typography>
          <br></br>
          <Typography variant="p">
            This site is still under maintenance, here is my updated <Link href={Pdf} target="_blank">resume</Link> in
            the meantime. 
          </Typography>
          
        </Paper>
      </div>
    );
  }
}

export default Profile;
