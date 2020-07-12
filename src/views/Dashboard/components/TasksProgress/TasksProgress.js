import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';

import { countGroups } from '../../../../firebase';
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
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  progress: {
    marginTop: theme.spacing(3)
  }
}));

const TasksProgress = props => {
  const app = useContext(AppContext);
  const { className, ...rest } = props;
  const [groupsCount, setGroupsCount] = useState();

  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      const response = await countGroups(app.uid);
      setGroupsCount(response);
    }

    if (app) {
      fetchData();
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
              TOTAL GROUPS
            </Typography>
            <Typography variant="h3">{groupsCount}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TasksProgress.propTypes = {
  className: PropTypes.string
};

export default TasksProgress;
