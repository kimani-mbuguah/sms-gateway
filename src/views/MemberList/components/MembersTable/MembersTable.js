import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

import { getInitials } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const MembersTable = props => {
  const { className, members, ...rest } = props;

  const classes = useStyles();

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = event => {
    const { members } = props;

    let selectedMembers;

    if (event.target.checked) {
      selectedMembers = members.map(member => member.name);
    } else {
      selectedMembers = [];
    }

    setSelectedMembers(selectedMembers);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedMembers.indexOf(id);
    let newSelectedGroups = [];

    if (selectedIndex === -1) {
      newSelectedGroups = newSelectedGroups.concat(selectedMembers, id);
    } else if (selectedIndex === 0) {
      newSelectedGroups = newSelectedGroups.concat(selectedMembers.slice(1));
    } else if (selectedIndex === selectedMembers.length - 1) {
      newSelectedGroups = newSelectedGroups.concat(
        selectedMembers.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedGroups = newSelectedGroups.concat(
        selectedMembers.slice(0, selectedIndex),
        selectedMembers.slice(selectedIndex + 1)
      );
    }

    setSelectedMembers(newSelectedGroups);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedMembers.length === members.length}
                      color="primary"
                      indeterminate={
                        selectedMembers.length > 0 &&
                        selectedMembers.length < members.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.slice(0, rowsPerPage).map(member => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={member.phone}
                    selected={selectedMembers.indexOf(member.phone) !== -1}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedMembers.indexOf(member.phone) !== -1}
                        color="primary"
                        onChange={event => handleSelectOne(event, member.phone)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Avatar className={classes.avatar}>
                          {getInitials(member.phone)}
                        </Avatar>
                        <Typography variant="body1">{member.phone}</Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={members.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

MembersTable.propTypes = {
  className: PropTypes.string,
  members: PropTypes.array.isRequired
};

export default MembersTable;
