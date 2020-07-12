import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import MoneyIcon from '@material-ui/icons/Money';

import { AppContext } from '../../../../providers/AppProvider';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.error.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.error.dark
  },
  differenceValue: {
    color: theme.palette.error.dark,
    marginRight: theme.spacing(1)
  }
}));

const Budget = props => {
  const app = useContext(AppContext);
  const { className, ...rest } = props;
  const [balance, setBalance] = useState('0');

  const classes = useStyles();

  useEffect(() => {
    if (app) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
      headers.append('Access-Control-Allow-Credentials', 'true');
      headers.append('apiKey', app.apiKey);

      headers.append('GET', 'POST', 'OPTIONS');

      const proxyurl = 'https://cors-anywhere.herokuapp.com/';
      const url = `https://api.africastalking.com/version1/user?username=${app.userName}`;
      fetch(proxyurl + url, {
        method: 'GET',
        headers: headers
      })
        .then(response => response.text())
        .then(contents => {
          const userData = JSON.parse(contents);

          setBalance(userData.UserData.balance);
        })
        .catch(error => console.log(error));
    }
  }, []);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2">
              App Balance
            </Typography>
            <Typography variant="h3">{balance}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <MoneyIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

Budget.propTypes = {
  className: PropTypes.string
};

export default Budget;
