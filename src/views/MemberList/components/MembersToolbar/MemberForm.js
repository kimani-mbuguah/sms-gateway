import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { makeStyles } from '@material-ui/styles';

import SelectSearch from 'react-select-search';
import SweetAlert from 'react-bootstrap-sweetalert';

import validate from 'validate.js';

import {
  generateMemberEntry,
  getUserDocuments,
  addAllMembersToGroup
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

export default function MemberForm(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { app } = props;
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [phone, setPhone] = useState('');
  let newUsersObj = [];
  const { nameFromURL } = props;

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddMember = async (event, phone) => {
    event.preventDefault();

    phone
      ? await generateMemberEntry(app.uid, nameFromURL, phone).then(success => {
          console.log(success);
          handleClose();
          window.location.href = `/sms-group-members?name=${nameFromURL}`;
        })
      : console.log('cannot submit empty form');
  };

  const handleAddAll = async () => {
    await addAllMembersToGroup(nameFromURL, app.uid).then(success => {
      if (success === 'success') {
        handleClose();
      } else {
        handleClose();
        window.location.href = `/sms-group-members?name=${nameFromURL}`;
      }
    });
  };

  const handleSelectChange = phone => {
    setPhone(phone);
  };

  const hideAlert = () => {
    setShow(false);
  };

  return (
    <div>
      <SweetAlert
        success
        title="Success!"
        show={show}
        onConfirm={hideAlert}
        btnSize="sm">
        Users added to the group
      </SweetAlert>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Member
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {' '}
          Select/Search a user's name and click add to add them to this group.
        </DialogTitle>

        <form
          onSubmit={event => {
            handleAddMember(event, phone);
          }}>
          <DialogContent>
            <DialogContentText>
              Click ADD ALL to add all users to this group
            </DialogContentText>
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
              <div style={{ marginTop: '10px' }}>Loading groups..</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button color="inherit" onClick={handleAddAll}>
              ADD ALL
            </Button>
            <Button type="submit" color="secondary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
