import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { makeStyles } from '@material-ui/styles';

import validate from 'validate.js';

import {
  auth,
  signInWithGoogle,
  generateUserDocument
} from '../../../../firebase';

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  phone: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
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

export default function UserForm(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { app } = props;

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

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddUser = async (event, name, phone) => {
    event.preventDefault();

    console.log(name, phone);
    formState.values.name && formState.values.phone
      ? await generateUserDocument(app.uid, name, phone).then(success => {
          console.log(success);
          handleClose();
          window.location.href = '/users';
        })
      : console.log('cannot submit empty form');
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add User
      </Button>
      <Dialog
        open={open}
        onClose={handleAddUser}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {' '}
          Add a user's name and phone number in the form below
        </DialogTitle>

        <form
          onSubmit={event => {
            handleAddUser(event, formState.values.name, formState.values.phone);
          }}>
          <DialogContent>
            <DialogContentText>All the fields are required</DialogContentText>
            <TextField
              className={classes.textField}
              error={hasError('name')}
              fullWidth
              helperText={hasError('name') ? formState.errors.name[0] : null}
              label="Name of User"
              name="name"
              onChange={handleChange}
              type="text"
              value={formState.values.name || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('phone')}
              fullWidth
              helperText={hasError('phone') ? formState.errors.phone[0] : null}
              label="User's Phone Number"
              name="phone"
              onChange={handleChange}
              type="text"
              value={formState.values.phone || ''}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
