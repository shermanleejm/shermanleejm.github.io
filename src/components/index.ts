import React from 'react';
import AssetTracker from './AssetTracker';
import ContactMe from './ContactMe';
import Home from './Home';
import MTGDB from './MTGDB/';
import Terminal from './Terminal';
import WordleSolver from './WordleSolver';
import Tracetogether from './Tracetogether';
import SelfDrivingCar from './SelfDrivingCar';
import ExpenditureTracker from './ExpenditureTracker';
import CSSPlayground from './CSSPlayground';
import Pokemon from './Pokemon';

import terminal from '../assets/terminal.png';
import tracker from '../assets/tracker.jpg';
import contactMe from '../assets/contactMe.png';
import mtg from '../assets/mtg.png';
import wordle from '../assets/wordle.jpg';
import money from '../assets/money.jpg';
import car from '../assets/car.jpg';
import css from '../assets/css.jpg';
import pokemon from '../assets/pokemon.png';

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
    description: 'To help me track my spending lol im broke',
    shortname: 'TRACK $$$',
  },
  {
    name: 'CSS Playground',
    component: CSSPlayground,
    link: '/css',
    img: css,
    description: 'For me to play around with cool css',
    shortname: 'CSS Stuff',
  },
  {
    name: 'MTG Database',
    component: MTGDB,
    link: '/mtgdb',
    img: mtg,
    description:
      'Complete front-end application. OCR enabled collection tracker for Magic The Gathering Commander deck building. Using IndexedDB as a local storage.',
    shortname: 'MTGDB',
  },
  {
    name: 'Pokemon',
    component: Pokemon,
    link: '/pokemon',
    img: pokemon,
    description: 'small tools for me to play pokemon like a boss',
    shortname: 'pokemon gotta catch em all',
  },
  {
    name: 'Asset Tracker',
    component: AssetTracker,
    link: '/assettracker',
    img: tracker,
    description: 'DOGE COIN TO THE MOOOOOOOOOON!¡!¡!¡!¡!',
    shortname: 'STONKS GO MOON',
  },
  {
    name: 'Wordle Solver',
    component: WordleSolver,
    link: '/wordle-solver',
    img: wordle,
    description:
      'Wordle solver. Just key in your guesses and it will search for you. Saves you some time lmao.',
    shortname: 'SOLVE WORDLE',
  },
  {
    name: 'Contact Me',
    component: ContactMe,
    link: '/contactme',
    img: contactMe,
    description: "Hijacked google forms' exposed api for a contact me page.",
    shortname: 'WHY DO YOU WANT TO SAVE THIS',
  },
  {
    name: 'Terminal',
    component: Terminal,
    link: '/terminal',
    img: terminal,
    description: 'This is a pseudo terminal that tells jokes.',
    shortname: 'THIS IS SHIT',
  },
  {
    name: 'Spoof Tracetogether',
    component: Tracetogether,
    link: '/tracetogether',
    description: '',
    disabled: true,
    shortname: 'HOW ARE YOU EVEN HERE',
  },
  // {
  //   name: '[WIP] Self Driving',
  //   component: SelfDrivingCar,
  //   link: '/car',
  //   img: car,
  //   description:
  //     'Trying to implement a self driving car using basic genetic machine learning lol. Pure JS (no libraries)',
  //   shortname: 'IM NOT READY YET'
  // },
];

export function shortname(location: string) {
  return Pages.find((page) => page.link === location)?.shortname || "Sherman's Portfolio";
}

export function changeManifest(currentLocation: any) {
  let manifest = {
    short_name: shortname(currentLocation.pathname),
    name: 'shermanleejm',
    icons: [
      {
        src: 'favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon',
      },
      {
        src: 'logo192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: 'logo512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    start_url: currentLocation.pathname,
    display: 'standalone',
    theme_color: '#000000',
    background_color: '#ffffff',
  };
  const stringManifest = JSON.stringify(manifest);
  const blob = new Blob([stringManifest], { type: 'application/json' });
  const manifestURL = URL.createObjectURL(blob);
  document.querySelector('#manifest')?.setAttribute('href', manifestURL);
}
