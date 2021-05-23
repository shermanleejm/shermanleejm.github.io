import React from 'react';
import ContactMe from './ContactMe';
import AboutMe from './AboutMe';
import SideBar from './SideBar';
import AssetTracker from './AssetTracker/AssetTracker';
import CallIcon from '@material-ui/icons/Call';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const Pages = [
  {
    name: 'About Me',
    link: '/about-me',
    component: AboutMe,
    icon: <AccountCircleIcon />,
  },
  { name: 'Contact Me', link: '/contact-me', component: ContactMe, icon: <CallIcon /> },
  {
    name: 'Asset Tracker',
    link: '/tracker',
    component: AssetTracker,
    icon: <TrendingUpIcon />,
  },
];

export { ContactMe, AboutMe, SideBar, Pages, AssetTracker };
