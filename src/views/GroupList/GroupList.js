import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { GroupsToolbar, GroupsTable } from './components';

import { getGroupDocuments } from '../../firebase';
import { AppContext } from '../../providers/AppProvider';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const GroupList = () => {
  const app = useContext(AppContext);
  const classes = useStyles();

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (app) {
      getGroupDocuments(app.uid)
        .then(data => {
          setGroups(data.groupsArr);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  return groups ? (
    <div className={classes.root}>
      <GroupsToolbar app={app} />
      <div className={classes.content}>
        {groups ? <GroupsTable groups={groups} /> : <div>No groups yet</div>}
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default GroupList;
