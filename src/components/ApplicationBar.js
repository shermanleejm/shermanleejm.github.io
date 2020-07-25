import React, { Component } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import CodeIcon from "@material-ui/icons/Code";

class ApplicationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerOpen: false,
    };
  }

  toggleDrawer() {
    var oldState = this.state;
    this.setState({
      isDrawerOpen: !oldState.isDrawerOpen,
    });
  }

  menuItems = {
    home: { icon: <PersonIcon />, displayName: "Profile" },
    contactMe: { icon: <PhoneIcon />, displayName: "Contact Me" },
  };

  displayList() {
    var result = [];
    Object.keys(this.menuItems).map((key) => {
      return (
        <ListItem>
          <ListItemIcon></ListItemIcon>
          <ListItemText primary={this.menuItems[key]["icon"]} />
        </ListItem>
      );
    });
    return result;
  }

  render() {
    return (
      <div>
        <Grid container style={{ padding: 10 }}>
          <Grid item></Grid>
          <CodeIcon />
          <Typography style={{ flexGrow: 1 }} />
          <Button
            disableElevation
            disableFocusRipple
            disableRipple
            onclick={() => this.toggleDrawer()}
          >
            <MenuIcon />
          </Button>
        </Grid>
      </div>
    );
  }
}

export default ApplicationBar;
