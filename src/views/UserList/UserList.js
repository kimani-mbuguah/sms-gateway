import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable } from './components';

import { getUserDocuments } from '../../firebase';
import { AppContext } from '../../providers/AppProvider';

import mockData from './data';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const UserList = () => {
  const app = useContext(AppContext);
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (app) {
      getUserDocuments(app.uid)
        .then(data => {
          setUsers(data.usersArr);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  return users ? (
    <div className={classes.root}>
      <UsersToolbar app={app} />
      <div className={classes.content}>
        {users ? <UsersTable users={users} /> : <div>No users yet</div>}
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default UserList;
