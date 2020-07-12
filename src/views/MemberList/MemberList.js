import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { MembersToolbar, MembersTable } from './components';

import { getGroupDocument } from '../../firebase';
import { AppContext } from '../../providers/AppProvider';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const MemberList = props => {
  const app = useContext(AppContext);
  const classes = useStyles();
  const search = props.location.search;
  const params = new URLSearchParams(search);
  const nameFromURL = params.get('name');

  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (app) {
      getGroupDocument(app.uid, nameFromURL)
        .then(data => {
          setMembers(data.membersArr);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  return members ? (
    <div className={classes.root}>
      <MembersToolbar members={members} app={app} nameFromURL={nameFromURL} />
      <div className={classes.content}>
        {members ? (
          <MembersTable members={members} />
        ) : (
          <div>No groups yet</div>
        )}
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default MemberList;
