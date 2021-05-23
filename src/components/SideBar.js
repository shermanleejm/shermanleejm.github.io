import {
  ListItem,
  List,
  SwipeableDrawer,
  IconButton,
  ListItemText,
  ListItemIcon,
  Switch,
  makeStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pages } from './index';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  };
});

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    localStorage.getItem('homepage');
  }, [reload]);

  return (
    <div className={classes.root}>
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
      <span>
        set as homepage{' '}
        <Switch
          checked={
            localStorage.getItem('homepage') === window.location.href.split('#')[1]
          }
          onChange={() => {
            if (localStorage.getItem('homepage') === window.location.href.split('#')[1]) {
              localStorage.setItem('homepage', '');
            } else {
              localStorage.setItem('homepage', window.location.href.split('#')[1]);
            }
            setReload(!reload);
          }}
        />
      </span>
    </div>
  );
};

export default SideBar;
