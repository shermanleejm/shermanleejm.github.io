import {
  ListItem,
  List,
  SwipeableDrawer,
  IconButton,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pages } from './index';
import MenuIcon from '@material-ui/icons/Menu';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <IconButton onClick={() => setIsOpen(true)}>
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => {
          setIsOpen(true);
        }}
      >
        <List>
          {Pages.map((page) => {
            return (
              <ListItem
                button
                key={page.name}
                component={Link}
                to={page.link}
                onClick={() => setIsOpen(false)}
              >
                <ListItemIcon children={page.icon} />
                <ListItemText primary={page.name} />
              </ListItem>
            );
          })}
        </List>
      </SwipeableDrawer>
    </div>
  );
};

export default SideBar;
