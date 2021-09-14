import React from 'react';
import ContactMe from './ContactMe';
import AboutMe from './AboutMe';
import SideBar from './SideBar';
import AssetTracker from './AssetTracker/AssetTracker';
import CallIcon from '@material-ui/icons/Call';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Terminal from './Terminal';
import CodeIcon from '@material-ui/icons/Code';

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
  {
    name: 'Terminal',
    link: '/terminal',
    component: Terminal,
    icon: <CodeIcon />,
  },
  {
    link: '/linkedin',
    href: 'https://www.linkedin.com/in/shrmnl/',
  },
  {
    link: '/github',
    href: 'https://github.com/shermanleejm',
  },
];

export { ContactMe, AboutMe, SideBar, Pages, AssetTracker };
