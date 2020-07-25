import React, { Component } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Paper,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Profile from "./components/Profile";
import ContactMe from "./components/ContactMe";

import ApplicationBar from "./components/ApplicationBar";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoaded: false, displayPage: "home" };
  }

  pages = {
    home: <Profile />,
    contactMe: <ContactMe />,
  };

  //callback function
  changeDisplayPage = (pageName) => {
    this.setState({
      displayPage: pageName,
    });
  };

  render() {
    return (
      <div style={{ flexGrow: 1 }}>
        <ApplicationBar
          changeDisplayPage={this.changeDisplayPage}
          currentPage={this.state.displayPage}
        />
        <div>
          <Typography variant="h6">
            {this.pages[this.state.displayPage]}
          </Typography>
        </div>
      </div>
    );
  }
}

export default Homepage;
