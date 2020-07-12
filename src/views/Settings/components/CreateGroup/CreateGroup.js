import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField
} from '@material-ui/core';
import SweetAlert from 'react-bootstrap-sweetalert';
import { generateGroupDocument } from '../../../../firebase';
import { AppContext } from '../../../../providers/AppProvider';

const useStyles = makeStyles(() => ({
  root: {}
}));

const CreateGroup = props => {
  const { className, ...rest } = props;
  const app = useContext(AppContext);

  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [values, setValues] = useState({
    name: ''
  });

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleCreateGroup = event => {
    event.preventDefault();
    if (values.name) {
      if (app) {
        generateGroupDocument(app.uid, values.name.replace(/\s/g, ''))
          .then(response => {
            window.location.href = `/sms-group-members?name=${values.name}`;
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  const hideAlert = () => {
    setShow(false);
    setValues({
      ...values,
      name: ''
    });
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
      style={{ marginTop: '5%', marginBottom: '0', marginLeft: 'auto' }}>
      <SweetAlert
        success
        title="Success!"
        show={show}
        onConfirm={hideAlert}
        btnSize="sm">
        Group created successfully.
      </SweetAlert>

      <form
        onSubmit={event => {
          handleCreateGroup(event);
        }}>
        <CardHeader title="Create SMS Group" />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Group Name"
            name="name"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="text"
            value={values.name}
            variant="outlined"
            required
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Button color="primary" type="submit">
            Create
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

CreateGroup.propTypes = {
  className: PropTypes.string
};

export default CreateGroup;
