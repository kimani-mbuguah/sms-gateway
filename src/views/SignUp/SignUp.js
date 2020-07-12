import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  FormHelperText,
  Checkbox,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { auth, signInWithGoogle, generateAppDocument } from '../../firebase';

const schema = {
  senderID: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  lastName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
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
  },
  policy: {
    presence: { allowEmpty: false, message: 'is required' },
    checked: true
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
    marginTop: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignUp = props => {
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleBack = () => {
    history.goBack();
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleSignUp = async (
    event,
    senderID,
    userName,
    apiKey,
    email,
    password
  ) => {
    event.preventDefault();

    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      formState.values.senderID
        ? await generateAppDocument(user, senderID, userName, apiKey).then(
            success => {
              history.push('/');
            }
          )
        : console.log('cannot submit empty form');
    } catch (error) {
      console.log(error);
      //setError('Error Signing up with email and password');
    }
  };

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.content} item lg={12} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={event => {
                  handleSignUp(
                    event,
                    formState.values.senderID,
                    formState.values.userName,
                    formState.values.apiKey,
                    formState.values.email,
                    formState.values.password
                  );
                }}>
                <Typography className={classes.title} variant="h2">
                  Create New SMS Application
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Use your email to create new a new app
                </Typography>
                <TextField
                  className={classes.textField}
                  error={hasError('senderID')}
                  fullWidth
                  helperText={
                    hasError('senderID') ? formState.errors.senderID[0] : null
                  }
                  label="Sender ID"
                  name="senderID"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.senderID || ''}
                  variant="outlined"
                  autoComplete={false}
                />

                <TextField
                  className={classes.textField}
                  error={hasError('userName')}
                  fullWidth
                  helperText={
                    hasError('userName') ? formState.errors.userName[0] : null
                  }
                  label="App User Name"
                  name="userName"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.userName || ''}
                  variant="outlined"
                  autoComplete={false}
                />

                <TextField
                  className={classes.textField}
                  error={hasError('apiKey')}
                  fullWidth
                  helperText={
                    hasError('apiKey') ? formState.errors.apiKey[0] : null
                  }
                  label="App API Key"
                  name="apiKey"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.apiKey || ''}
                  variant="outlined"
                  autoComplete={false}
                />

                <TextField
                  className={classes.textField}
                  error={hasError('email')}
                  fullWidth
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  label="Email address"
                  name="email"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.email || ''}
                  variant="outlined"
                  autoComplete={false}
                />
                <TextField
                  className={classes.textField}
                  error={hasError('password')}
                  fullWidth
                  helperText={
                    hasError('password') ? formState.errors.password[0] : null
                  }
                  label="Password"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={formState.values.password || ''}
                  variant="outlined"
                  autoComplete={false}
                />

                <Button
                  className={classes.signUpButton}
                  color="primary"
                  disabled={false}
                  //disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained">
                  Sign up now
                </Button>
                <Typography color="textSecondary" variant="body1">
                  Have an account?{' '}
                  <Link component={RouterLink} to="/sign-in" variant="h6">
                    Sign in
                  </Link>
                </Typography>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
