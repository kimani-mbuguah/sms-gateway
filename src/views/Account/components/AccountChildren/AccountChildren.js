import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { TagInput } from 'reactjs-tag-input';
import LoadingOverlay from 'react-loading-overlay';
import { AppContext } from '../../../../providers/AppProvider';
import { generateChildrenDocument } from '../../../../firebase';

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

const AccountChildren = props => {
  const app = useContext(AppContext);
  const { className, staticContext, ...rest } = props;
  const search = props.location.search;
  const params = new URLSearchParams(search);
  const phoneFromUrl = params.get('phone').replace(/^.{1}/g, '+');
  const classes = useStyles();

  const [values, setValues] = useState({
    firstName1: '',
    lastName1: '',
    gender1: '',
    age1: '',
    firstName2: '',
    lastName2: '',
    gender2: '',
    age2: '',
    firstName3: '',
    lastName3: '',
    gender3: '',
    age3: '',
    firstName4: '',
    lastName4: '',
    gender4: '',
    age4: '',
    firstName5: '',
    lastName5: '',
    gender5: '',
    age5: '',
    firstName6: '',
    lastName6: '',
    gender6: '',
    age6: ''
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

  const [isLoading, setIsLoading] = useState(false);

  const handleAddChildren = async (event, values) => {
    event.preventDefault();
    setIsLoading(true);
    if (
      !values.firstName1 ||
      !values.lastName1 ||
      !values.gender1 ||
      !values.age1
    ) {
      setIsLoading(false);
      alert(
        'Please fill data about the first child. At least one child data is required.'
      );
    } else {
      if (phoneFromUrl) {
        generateChildrenDocument(values, phoneFromUrl, app.uid)
          .then(() => {
            setIsLoading(false);
            window.location.href = '/users';
          })
          .catch(error => {
            setIsLoading(false);
            alert(error);
          });
      } else {
        setIsLoading(false);
        alert('Document id missing');
      }
    }
  };

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text="Saving data..."
      className={classes.loading}>
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={12} md={12} xl={8} xs={12}>
            <Card {...rest} className={clsx(classes.root, className)}>
              <form
                autoComplete="on"
                noValidate
                onSubmit={event => {
                  handleAddChildren(event, values);
                }}>
                <CardHeader
                  subheader="Fill in the form below to add children data about this member"
                  title="Children Details."
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child One First name"
                        margin="dense"
                        name="firstName1"
                        onChange={handleChange}
                        value={values.firstName1}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child One Last name"
                        margin="dense"
                        name="lastName1"
                        onChange={handleChange}
                        value={values.lastName1}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child One Age"
                        margin="dense"
                        name="age1"
                        onChange={handleChange}
                        type="number"
                        value={values.age1}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child One Gender"
                        margin="dense"
                        name="gender1"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={values.gender1}
                        variant="outlined">
                        {gender.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Two First name"
                        margin="dense"
                        name="firstName2"
                        onChange={handleChange}
                        value={values.firstName2}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Two Last name"
                        margin="dense"
                        name="lastName2"
                        onChange={handleChange}
                        value={values.lastName2}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Two Age"
                        margin="dense"
                        name="age2"
                        onChange={handleChange}
                        type="number"
                        value={values.age2}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Two Gender"
                        margin="dense"
                        name="gender2"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={values.gender2}
                        variant="outlined">
                        {gender.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Three First name"
                        margin="dense"
                        name="firstName3"
                        onChange={handleChange}
                        value={values.firstName3}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Three Last name"
                        margin="dense"
                        name="lastName3"
                        onChange={handleChange}
                        value={values.lastName3}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Three Age"
                        margin="dense"
                        name="age3"
                        onChange={handleChange}
                        type="number"
                        value={values.age3}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Three Gender"
                        margin="dense"
                        name="gender3"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={values.gender3}
                        variant="outlined">
                        {gender.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Four First name"
                        margin="dense"
                        name="firstName4"
                        onChange={handleChange}
                        value={values.firstName4}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Four Last name"
                        margin="dense"
                        name="lastName4"
                        onChange={handleChange}
                        value={values.lastName4}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Four Age"
                        margin="dense"
                        name="age4"
                        onChange={handleChange}
                        type="number"
                        value={values.age4}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Four Gender"
                        margin="dense"
                        name="gender4"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={values.gender4}
                        variant="outlined">
                        {gender.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Five First name"
                        margin="dense"
                        name="firstName5"
                        onChange={handleChange}
                        value={values.firstName5}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Five Last name"
                        margin="dense"
                        name="lastName5"
                        onChange={handleChange}
                        value={values.lastName5}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Five Age"
                        margin="dense"
                        name="age5"
                        onChange={handleChange}
                        type="number"
                        value={values.age5}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Five Gender"
                        margin="dense"
                        name="gender5"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={values.gender5}
                        variant="outlined">
                        {gender.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Six First name"
                        margin="dense"
                        name="firstName6"
                        onChange={handleChange}
                        value={values.firstName6}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Six Last name"
                        margin="dense"
                        name="lastName6"
                        onChange={handleChange}
                        value={values.lastName6}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Six Age"
                        margin="dense"
                        name="age6"
                        onChange={handleChange}
                        type="number"
                        value={values.age6}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <TextField
                        fullWidth
                        label="Child Six Gender"
                        margin="dense"
                        name="gender6"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={values.gender6}
                        variant="outlined">
                        {gender.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
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
          </Grid>
        </Grid>
      </div>
    </LoadingOverlay>
  );
};

AccountChildren.propTypes = {
  className: PropTypes.string
};

export default AccountChildren;
