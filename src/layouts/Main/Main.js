import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';

import LoadingOverlay from 'react-loading-overlay';

import { Sidebar, Topbar, Footer } from './components';
import Spinner from '../../components/Spinner/Spinner';
import { AppContext } from '../../providers/AppProvider';
import { auth } from '../../firebase';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  }
}));

const Main = props => {
  const app = useContext(AppContext);

  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  useEffect(() => {
    if (app) {
      if (!app.senderID) {
        console.log('not authenticated');
        window.location.href = '/sign-in';
      }
    }
  }, []);

  return app ? (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}>
      {app.active
        ? console.log(`${Date.now()} Happy Hacking!`)
        : auth.signOut().then(() => {
            window.location.href = '/sign-in';
          })}
      <Topbar onSidebarOpen={handleSidebarOpen} app={app} />
      <Sidebar
        app={app}
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        {children}
        <Footer />
      </main>
    </div>
  ) : (
    <main className={classes.content}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
        <h1>
          {' '}
          <Spinner />{' '}
        </h1>
      </div>
    </main>
  );
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
