import React from 'react';
import AssetTracker from './AssetTracker';
import ContactMe from './ContactMe';
import Home from './Home';
import MTGDB from './MTGDB/';
import Terminal from './Terminal';
import WordleSolver from './WordleSolver';
import Tracetogether from './Tracetogether';
import SelfDrivingCar from './SelfDrivingCar';

import terminal from '../assets/terminal.png';
import tracker from '../assets/tracker.jpg';
import contactMe from '../assets/contactMe.png';
import mtg from '../assets/mtg.png';
import wordle from '../assets/wordle.jpg';
import money from '../assets/money.jpg';
import car from '../assets/car.jpg';
import ExpenditureTracker from './ExpenditureTracker';

export type PageType = {
  name: string;
  component: React.FC;
  link: string;
  img?: string;
  description: string;
  disabled?: boolean;
  shortname: string;
};

export const Pages: PageType[] = [
  {
    name: 'Home',
    component: Home,
    link: '/',
    img: '',
    description: 'This is just the home page. Nothing to see here',
    shortname: 'SHERMAN ROX',
  },
  {
    name: 'Expenditure Tracker',
    component: ExpenditureTracker,
    link: '/expenditure_tracker',
    img: money,
    description:
      'To help me track my spending lol im broke',
    shortname: 'TRACK $$$',
  },
  {
    name: 'MTG Database',
    component: MTGDB,
    link: '/mtgdb',
    img: mtg,
    description:
      'Complete front-end application. OCR enabled collection tracker for Magic The Gathering Commander deck building. Using IndexedDB as a local storage.',
    shortname: 'MTGDB'
  },
  {
    name: 'Asset Tracker',
    component: AssetTracker,
    link: '/assettracker',
    img: tracker,
    description: 'DOGE COIN TO THE MOOOOOOOOOON!¡!¡!¡!¡!',
    shortname: 'STONKS GO MOON'
  },
  {
    name: 'Wordle Solver',
    component: WordleSolver,
    link: '/wordle-solver',
    img: wordle,
    description:
      'Wordle solver. Just key in your guesses and it will search for you. Saves you some time lmao.',
    shortname: 'SOLVE WORDLE'
  },
  {
    name: 'Contact Me',
    component: ContactMe,
    link: '/contactme',
    img: contactMe,
    description: "Hijacked google forms' exposed api for a contact me page.",
    shortname: 'WHY DO YOU WANT TO SAVE THIS'
  },
  {
    name: 'Terminal',
    component: Terminal,
    link: '/terminal',
    img: terminal,
    description: 'This is a pseudo terminal that tells jokes.',
    shortname: 'THIS IS SHIT'
  },
  {
    name: 'Spoof Tracetogether',
    component: Tracetogether,
    link: '/tracetogether',
    description: '',
    disabled: true,
    shortname: 'HOW ARE YOU EVEN HERE'
  },
  {
    name: '[WIP] Self Driving',
    component: SelfDrivingCar,
    link: '/car',
    img: car,
    description:
      'Trying to implement a self driving car using basic genetic machine learning lol. Pure JS (no libraries)',
    shortname: 'IM NOT READY YET'
  },
];

export function shortname(location: string) {
  let page = Pages.find((page) => page.link === location);
  return page ? page.shortname : "Sherman's Portfolio";
}