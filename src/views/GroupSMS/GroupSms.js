import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';

import SelectSearch from 'react-select-search';
import SweetAlert from 'react-bootstrap-sweetalert';

import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  Typography
} from '@material-ui/core';

import LoadingOverlay from 'react-loading-overlay';

import {
  getUserDocuments,
  sendGroupSMS,
  getGroupDocuments
} from '../../firebase';
import { AppContext } from '../../providers/AppProvider';

import './style.css';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  loading: {
    marginTop: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 0,
    width: '100%'
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  }
}));

const GroupSms = props => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const [cost, setCost] = useState('');
  const app = useContext(AppContext);
  const classes = useStyles();
  const [users, setUsers] = useState();
  const [groups, setGroups] = useState();
  const [isLoading, setIsLoading] = useState(false);
  let newUsersObj = [];
  let newGroupsArr = [];

  useEffect(() => {
    if (app) {
      getUserDocuments(app.uid)
        .then(async data => {
          const usersArray = data.usersArr;

          for (let i = 0; i < usersArray.length; i++) {
            newUsersObj.push({
              name: data.usersArr[i].name + ` (${data.usersArr[i].name}) `,
              value: data.usersArr[i].name
            });
          }

          setUsers(newUsersObj);
        })
        .catch(error => {
          console.log(error);
        });

      getGroupDocuments(app.uid)
        .then(data => {
          const groupsArray = data.groupsArr;

          for (let i = 0; i < groupsArray.length; i++) {
            newGroupsArr.push({
              name: groupsArray[i].name,
              value: groupsArray[i].name
            });
          }

          setGroups(newGroupsArr);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  const handleChange = event => {
    event.preventDefault();
    setMessage(event.target.value);
  };

  const handleSelectChange = name => {
    setName(name);
  };

  const handleSendGroupSMS = event => {
    event.preventDefault();
    setIsLoading(true);
    if (name && message) {
      sendGroupSMS(
        name,
        message,
        app.uid,
        app.senderID,
        app.userName,
        app.apiKey
      )
        .then(response => {
          setCost(`KES ${0.8 * response.SMSMessageData.Recipients.length}`);
          setShow(true);
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          console.log(error);
        });
    }
  };

  const hideAlert = () => {
    setShow(false);
    setName('');
    setMessage('');
  };

  return (
    <div className={classes.root}>
      <SweetAlert
        success
        title="Success!"
        show={show}
        onConfirm={hideAlert}
        btnSize="sm">
        SMS has bee sent successfully to {name}. Cost : {cost}
      </SweetAlert>
      <Grid className={classes.grid} container>
        {app ? (
          <LoadingOverlay
            active={isLoading}
            spinner
            text="Sending..."
            className={classes.loading}>
            <form
              className="sms-form"
              onSubmit={event => {
                handleSendGroupSMS(event);
              }}>
              <Typography className={classes.title} variant="h2">
                Send SMS To A Group of Users
              </Typography>

              {groups ? (
                <SelectSearch
                  style={{ width: '100%', height: '30px' }}
                  label="Select Group"
                  search
                  options={groups}
                  onChange={name => {
                    handleSelectChange(name);
                  }}
                  value={name}
                  required
                  name="name"
                  placeholder="Select Group"
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '5%'
                  }}>
                  Loading...
                </div>
              )}

              <TextField
                multiline
                rows={3}
                rowsMax={4}
                className={classes.textField}
                fullWidth
                required
                label="Compose Message"
                name="message"
                onChange={handleChange}
                type="message"
                value={message || ''}
                variant="outlined"
              />
              <Button
                className={classes.signInButton}
                color="primary"
                disabled={false}
                fullWidth
                size="large"
                type="submit"
                variant="contained">
                Send SMS
              </Button>
            </form>
          </LoadingOverlay>
        ) : (
          <div>Loading users...</div>
        )}
      </Grid>
    </div>
  );
};

GroupSms.propTypes = {
  history: PropTypes.object
};

export default withRouter(GroupSms);
