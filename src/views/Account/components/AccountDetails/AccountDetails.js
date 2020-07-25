import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { TagInput } from 'reactjs-tag-input';
import LoadingOverlay from 'react-loading-overlay';
import { AppContext } from '../../../../providers/AppProvider';
import { generateUserDocument, storage } from '../../../../firebase';

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const AccountDetails = props => {
  const app = useContext(AppContext);
  const { className, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    age: '',
    residence: '',
    children: '',
    childAge: '',
    career: '',
    bornAgain: '',
    baptised: '',
    ministry: '',
    lifeGroup: '',
    plugin: ''
  });

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const gender = [
    {
      value: '',
      label: ''
    },
    {
      value: 'male',
      label: 'Male'
    },
    {
      value: 'female',
      label: 'Female'
    }
  ];

  const bornAgain = [
    {
      value: '',
      label: ''
    },
    {
      value: 'yes',
      label: 'Yes'
    },
    {
      value: 'no',
      label: 'No'
    }
  ];

  const children = [
    {
      value: '',
      label: ''
    },
    {
      value: 'yes',
      label: 'Yes'
    },
    {
      value: 'no',
      label: 'No'
    }
  ];

  const plugin = [
    {
      value: '',
      label: ''
    },
    {
      value: 'yes',
      label: 'Yes'
    },
    {
      value: 'no',
      label: 'No'
    }
  ];

  const baptised = [
    {
      value: '',
      label: ''
    },
    {
      value: 'yes',
      label: 'Yes'
    },
    {
      value: 'no',
      label: 'No'
    }
  ];

  const age = [
    {
      value: '',
      label: ''
    },
    {
      value: '0-18',
      label: '0-18'
    },
    {
      value: '18-30',
      label: '18-30'
    },
    {
      value: '30-40',
      label: '30-40'
    },
    {
      value: '40-50',
      label: '40-50'
    },
    {
      value: '50-60',
      label: '50-60'
    },
    {
      value: '60-70',
      label: '60-70'
    },
    {
      value: '70-80',
      label: '70-80'
    },
    {
      value: '80-90',
      label: '80-90'
    },
    {
      value: '90-100',
      label: '90-100'
    },
    {
      value: '100-110',
      label: '100-110'
    }
  ];

  const lifeGroups = [
    {
      value: '',
      label: ''
    },
    {
      value: 'municipality',
      label: 'Municipality'
    },
    {
      value: 'kimuri',
      label: 'Kimuri'
    },
    {
      value: 'karia',
      label: 'Karia'
    },
    {
      value: 'embu',
      label: 'Embu'
    },
    {
      value: 'kanyotu',
      label: 'Kanyotu'
    },
    {
      value: 'site',
      label: 'Site'
    },
    {
      value: 'kimandi',
      label: 'Kimandi'
    },
    {
      value: 'miringa-iri',
      label: 'Miringa - Iri'
    },
    {
      value: 'huduma-centre',
      label: 'Huduma Center'
    },
    {
      value: 'stadium',
      label: 'Stadium'
    },
    {
      value: 'kaitheri',
      label: 'Kaitheri'
    },
    {
      value: 'town',
      label: 'Town'
    },
    {
      value: 'pop-in',
      label: 'Pop In'
    },
    {
      value: 'kutus',
      label: 'Kutus'
    }
  ];

  const ministry = [
    {
      value: '',
      label: ''
    },
    {
      value: 'men',
      label: 'Men'
    },
    {
      value: 'women',
      label: 'Women'
    },
    {
      value: 'youth',
      label: 'Youth'
    },
    {
      value: 'teen',
      label: 'Teen'
    },
    {
      value: 'preteen',
      label: 'Preteen'
    },
    {
      value: 'children-eagles',
      label: 'Children - Eagles'
    },
    {
      value: 'children-angels',
      label: 'Children - Angels'
    },
    {
      value: 'children-joyous',
      label: 'Children - Joyous'
    },
    {
      value: 'children-glorius',
      label: 'Children - Glorius'
    }
  ];
  const [isLoading, setIsLoading] = useState(false);
  const allInputs = { imgUrl: '' };
  const [imageAsFile, setImageAsFile] = useState('');
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  const handleImageAsFile = e => {
    const image = e.target.files[0];
    setImageAsFile(imageFile => image);
  };

  const handleAddMember = async (event, values) => {
    event.preventDefault();
    setIsLoading(true);
    if (imageAsFile === '') {
      setIsLoading(false);
      alert('Please select a profile picture for this member');
    } else if (
      !values.firstName ||
      !values.lastName ||
      !values.email ||
      !values.phone ||
      !values.gender ||
      !values.age ||
      !values.residence ||
      !values.children ||
      !values.career ||
      !values.bornAgain ||
      !values.baptised ||
      !values.ministry ||
      !values.lifeGroup ||
      !values.plugin
    ) {
      setIsLoading(false);
      alert(
        'One or more required field is invalid empty. Confirm that the form is complete before submitting.'
      );
    } else if (
      values.phone.length < 10 ||
      values.phone.length > 10 ||
      values.phone.charAt(0) != '0'
    ) {
      setIsLoading(false);
      alert(
        'Invalid phone number. A phone Kenyan phone number must start with 0 and be 10 characters in length'
      );
    } else {
      const uploadTask = storage
        .ref(`/images/${imageAsFile.name}`)
        .put(imageAsFile);

      //initiates the firebase side uploading
      uploadTask.on(
        'state_changed',
        snapShot => {
          //takes a snap shot of the process as it is happening
          console.log(snapShot);
        },
        err => {
          //catches the errors
          console.log(err);
        },
        () => {
          // gets the functions from storage refences the image storage in firebase by the children
          // gets the download url then sets the image from firebase as the value for the imgUrl key:
          storage
            .ref('images')
            .child(imageAsFile.name)
            .getDownloadURL()
            .then(fireBaseUrl => {
              generateUserDocument(values, fireBaseUrl, app.uid)
                .then(() => {
                  setIsLoading(false);
                  if (values.children === 'yes') {
                    window.location.href = `/users/register/add-children?phone=${values.phone.replace(
                      /^.{1}/g,
                      '+254'
                    )}`;
                  } else {
                    window.location.href = '/users';
                  }
                })
                .catch(error => {
                  alert(error);
                });
            });
        }
      );
    }
  };

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text="Saving data..."
      className={classes.loading}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <form
          autoComplete="on"
          noValidate
          onSubmit={event => {
            handleAddMember(event, values);
          }}>
          <CardHeader
            subheader="Fill in the form below to create a member profile. All fields are required."
            title="Member Profile"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="First name"
                  margin="dense"
                  name="firstName"
                  onChange={handleChange}
                  required
                  value={values.firstName}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Last name"
                  margin="dense"
                  name="lastName"
                  onChange={handleChange}
                  required
                  value={values.lastName}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  margin="dense"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  margin="dense"
                  name="phone"
                  required
                  onChange={handleChange}
                  type="number"
                  value={values.phone}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Select Gender"
                  margin="dense"
                  name="gender"
                  onChange={handleChange}
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={values.gender}
                  variant="outlined">
                  {gender.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Select Age Bracket"
                  margin="dense"
                  name="age"
                  onChange={handleChange}
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={values.age}
                  variant="outlined">
                  {age.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Career"
                  margin="dense"
                  name="career"
                  onChange={handleChange}
                  required
                  value={values.career}
                  variant="outlined"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Select Born Again Status"
                  margin="dense"
                  name="bornAgain"
                  onChange={handleChange}
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={values.bornAgain}
                  variant="outlined">
                  {bornAgain.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Select Baptism Status"
                  margin="dense"
                  name="baptised"
                  onChange={handleChange}
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={values.baptised}
                  variant="outlined">
                  {baptised.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Select Ministry"
                  margin="dense"
                  name="ministry"
                  onChange={handleChange}
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={values.ministry}
                  variant="outlined">
                  {ministry.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Select Life Group"
                  margin="dense"
                  name="lifeGroup"
                  onChange={handleChange}
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={values.lifeGroup}
                  variant="outlined">
                  {lifeGroups.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Residence"
                  margin="dense"
                  name="residence"
                  onChange={handleChange}
                  required
                  value={values.residence}
                  variant="outlined"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Select Plug-In Status"
                  margin="dense"
                  name="plugin"
                  onChange={handleChange}
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={values.plugin}
                  variant="outlined">
                  {plugin.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Select Parental Status"
                  margin="dense"
                  name="children"
                  onChange={handleChange}
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={values.children}
                  variant="outlined">
                  {children.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item md={6} xs={12}>
                <input type="file" required onChange={handleImageAsFile} />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button color="primary" variant="contained" type="submit">
              Save details
            </Button>
          </CardActions>
        </form>
      </Card>
    </LoadingOverlay>
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
