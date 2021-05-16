import React from 'react';
import { HashRouter, Switch, Route, Link } from 'react-router-dom';
import { ContactMe, AboutMe, SideBar, Pages } from './components';

const App = () => {
  return (
    <div>
      <HashRouter basename={'/'}>
        <SideBar />
        <Switch>
          {Pages.map((page) => {
            return <Route exact path={page.link} component={page.component} />;
          })}
        </Switch>
      </HashRouter>
    </div>
  );
};

export default App;
