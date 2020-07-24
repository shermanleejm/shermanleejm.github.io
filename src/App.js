import React, { Component } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import ApplicationBar from "./components/ApplicationBar";

class Homepage extends Component {
  state = { isLoaded: false };

  render() {
    return (
      <div style={{ flexGrow: 1 }}>
        <ApplicationBar />
      </div>
    );
  }
}

export default Homepage;
