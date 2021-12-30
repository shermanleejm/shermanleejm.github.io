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

function App() {
  const { toggleDarkMode } = bindActionCreators(DarkModeActionCreators, useDispatch());
  const darkMode = useSelector((state: State) => state.darkMode);

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
        <Grid container direction="row" justifyContent="space-between">
          <Grid item>
            {useLocation().pathname !== '/' ? (
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
