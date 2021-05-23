import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { SideBar, Pages } from './components';

const App = () => {
  return (
    <div>
      <HashRouter basename={'/'}>
        <SideBar />
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return localStorage.getItem('homepage') === null ||
                localStorage.getItem('homepage') === '' ? (
                <Redirect to="/about-me" />
              ) : (
                <Redirect to={localStorage.getItem('homepage')} />
              );
            }}
          />
          {Pages.map((page) => {
            return <Route exact path={page.link} component={page.component} />;
          })}
        </Switch>
      </HashRouter>
    </div>
  );
};

export default App;
