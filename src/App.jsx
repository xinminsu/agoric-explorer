/* eslint-disable react/display-name */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { makeStyles, useTheme } from '@mui/styles';
import AppBar from './components/AppBar';
import NavMenu from './components/NavMenu';
import Contracts from './views/Contracts';
import Transactions from './views/Transactions';
import Ertps from './views/Ertps';

import './App.scss';

const useStyles = makeStyles(theme => ({
  main: {
    boxSizing: 'border-box',
    padding: '32px',
    marginLeft: theme.navMenuWidth,
    position: 'absolute',
    width: `calc(100vw - ${theme.navMenuWidth})`,
    top: theme.appBarHeight,
    [theme.breakpoints.down('md')]: {
      marginLeft: '0',
      width: '100vw',
    },
  },
  navMenu: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

const App = () => {
  const classes = useStyles(useTheme());
  return (
    <span className="App">
      <span className={classes.navMenu}>
        <NavMenu />
      </span>
      <main className={classes.main}>
        <Switch>
          <Route path="/contracts">
            <Contracts />
          </Route>
          <Route path="/ertps">
            <Ertps />
          </Route>
          <Route path="/">
            <Transactions />
          </Route>
        </Switch>
      </main>
      <AppBar />
    </span>
  );
};

export default App;
