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

import { getUserDocuments, sendSingleSMS } from '../../firebase';
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
  loading: {
    marginTop: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 0,
    width: '100%'
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

const UniUserSms = props => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const [cost, setCost] = useState('');
  const app = useContext(AppContext);
  const classes = useStyles();
  const [users, setUsers] = useState();
  const [isLoading, setIsLoading] = useState(false);
  let newUsersObj = [];

  useEffect(() => {
    if (app) {
      getUserDocuments(app.uid)
        .then(async data => {
          const usersArray = data.usersArr;

          for (let i = 0; i < usersArray.length; i++) {
            newUsersObj.push({
              name: data.usersArr[i].name + ` (${data.usersArr[i].phone}) `,
              value: data.usersArr[i].phone
            });
          }

          setUsers(newUsersObj);
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

  const handleSelectChange = phone => {
    setPhone(phone);
  };

  const handleSendSMS = event => {
    event.preventDefault();

    setIsLoading(true);
    if (phone && message) {
      sendSingleSMS(phone, message, app.senderID, app.userName, app.apiKey)
        .then(response => {
          setCost(response.SMSMessageData.Recipients[0].cost);
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
    setPhone('');
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
        SMS has bee sent successfully to {phone}. Cost : {cost}
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
                handleSendSMS(event);
              }}>
              <Typography className={classes.title} variant="h2">
                Send SMS To A Single User
              </Typography>
              {users ? (
                <SelectSearch
                  style={{ width: '100%', height: '30px' }}
                  label="Select User"
                  search
                  options={users}
                  onChange={phone => {
                    handleSelectChange(phone);
                  }}
                  value={phone}
                  required
                  name="phone"
                  placeholder="Select User"
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

UniUserSms.propTypes = {
  history: PropTypes.object
};

export default withRouter(UniUserSms);
