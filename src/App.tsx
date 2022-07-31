import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Pages } from './components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, ThemeProvider, CssBaseline, Grid } from '@mui/material';
import { bindActionCreators } from 'redux';
import { DarkModeActionCreators } from './state/action-creators';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { State } from './state/reducers';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useEffect } from 'react';

function App() {
  const { toggleDarkMode } = bindActionCreators(DarkModeActionCreators, useDispatch());
  const darkMode = useSelector((state: State) => state.darkMode);
  const currentLocation = useLocation();

  function shortname(location: string) {
    return Pages.map((page) => {
      if (page.link === location) {
        return page.shortname;
      }
      return "Sherman's Portfolio";
    });
  }

  useEffect(() => {
    function changeManifest() {
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

    changeManifest();
  }, [currentLocation]);

  return (
    <div className="App">
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
              <Button onClick={() => toggleDarkMode()}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </Button>
            </Grid>
          </Grid>
        )}
        <Routes>
          {Pages.map((page) => {
            return <Route path={page.link} element={<page.component />} />;
          })}
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
