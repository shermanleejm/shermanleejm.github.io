import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Pages } from './components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Button,
  ThemeProvider,
  CssBaseline,
  Grid,
  CircularProgress,
} from '@mui/material';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import React from 'react';
import { atomWithStorage } from 'jotai/utils';
import { useAtom } from 'jotai';
import 'handsontable/dist/handsontable.full.min.css';

export const darkModeAtom = atomWithStorage('dark-mode', true);

export default function App() {
  const [darkMode, toggleDarkMode] = useAtom(darkModeAtom);
  const currentLocation = useLocation();

  return (
    <div>
      <ThemeProvider
        theme={responsiveFontSizes(
          createTheme({
            palette: {
              mode: darkMode ? 'dark' : 'light',
            },
          })
        )}
      >
        <CssBaseline />
        {!currentLocation.pathname.includes('tracetogether') && (
          <Grid container direction="row" justifyContent="space-between">
            <Grid item>
              {currentLocation.pathname !== '/' ? (
                <Button component={Link} to="/">
                  <ArrowBackIcon /> Home
                </Button>
              ) : (
                <div></div>
              )}
            </Grid>
            <Grid item>
              <Button onClick={() => toggleDarkMode(!darkMode)}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </Button>
            </Grid>
          </Grid>
        )}
        <Routes>
          {Pages.map((page, index) => {
            return (
              <Route
                key={index}
                path={page.link}
                element={
                  <React.Suspense fallback={<CircularProgress />}>
                    <page.component />
                  </React.Suspense>
                }
              />
            );
          })}
        </Routes>
      </ThemeProvider>
    </div>
  );
}
