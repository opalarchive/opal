import React from 'react';

import * as ROUTES from '../../Constants/routes';

import { TableContainer, Table, TableHead, TableCell, TableRow, Paper, TableBody, Checkbox, Toolbar, Typography, Tooltip, IconButton, makeStyles, lighten, TableSortLabel, darken } from '@material-ui/core';
import { Filter, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';

const camelToTitle = (string) => {
  let result = string.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

const formatTime = time => {
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let date = new Date(time);
  let now = new Date();

  if (now.getTime() > date.getTime() + 86400000) {
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }
  if (now.getTime() < date.getTime()) {
    return 'Hello time traveler! ^-^';
  }

  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes === 0) {
    if (hours % 12 === 0) {
      return '12:00 ' + (hours === 0 ? 'AM' : 'PM');
    }
    return (hours % 12) + ':00' + (hours < 12 ? 'AM' : 'PM');
  }
  if (hours % 12 === 0) {
    return '12:' + (minutes < 10 ? '0' : '') + minutes + ' ' + (hours < 12 ? 'AM' : 'PM');
  }
  return (hours % 12) + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + (hours < 12 ? 'AM' : 'PM');
}

const getDataPoint = (proj, dataPoint, username) => {
  switch (dataPoint) {
    case 'name':
      return proj.name;
    case 'owner':
      return proj.owner;
    case 'lastModified':
      return Math.max(...Object.values(proj.editors).map(info => info.lastEdit));
    case 'shareDate':
      return proj.editors[username].shareDate;
    case 'lastModifiedByMe':
      return proj.editors[username].lastEdit;
    default:
      return null
  }
}

const formatData = data => {
  if (typeof data === 'number') {
    return formatTime(data);
  }
  return data;
}

const toolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

const ProjectToolbar = (props) => {
  const { selected } = props;
  const numSelected = selected.length;
  const styles = toolbarStyles();

  return (
    <Toolbar className={`${styles.root} ${numSelected > 0 ? styles.highlight : ""}`}>
      {numSelected > 0 ? (
        <Typography className={styles.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
          <Typography className={styles.title} variant="h6" id="tableTitle" component="div">
            {props.name}
          </Typography>
        )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <Trash2 />
          </IconButton>
        </Tooltip>
      ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
              <Filter />
            </IconButton>
          </Tooltip>
        )}
    </Toolbar>
  );
}

const rowStyles = makeStyles((theme) => ({
  link: {
    color: "black",
    textDecoration: "none",
    '&:hover': {
      color: darken(theme.palette.secondary.dark, 0.1)
    }
  }
}));

const ProjectRow = (props) => {
  const styles = rowStyles();
  const { id, index, data, proj, selected, onRowClick, username } = props;
  
  const labelId = `project-table-checkbox-${index}`;

  return (
    <TableRow
      hover
      onClick={(event) => onRowClick(event, id)}
      role="checkbox"
      aria-checked={selected}
      selected={selected}
      key={id}
      tabIndex={-1}
    >
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          inputProps={{ 'aria-labelledby': labelId }}
        />
      </TableCell>
      {data.map((dataPoint, index) =>
        (index === 0 ?
          <TableCell component="th" scope="row" id={labelId} padding="none" key={`${id}-${dataPoint}`}>
            <Link className={styles.link} to={ROUTES.PROJECT_VIEW.replace(':id', id)}>{formatData(getDataPoint(proj, dataPoint, username))}</Link>
          </TableCell>
          : <TableCell align="right" key={`${id}-${dataPoint}`}>{formatData(getDataPoint(proj, dataPoint, username))}</TableCell>
        ))}
    </TableRow>
  );
}


class ProjectTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {},
      sortedProjectKeys: [],
      sort: {
        dataPoint: 'name',
        direction: 'asc'
      }
    };

    this.onRowClick = (event, projID) => {
      event.preventDefault();

      let selected = this.state.selected;
      selected[projID] = !selected[projID];

      this.setState({ selected });
    }

    this.onAllClick = (event) => {
      if (event.target.checked) {
        let selected = {};
        Object.keys(this.props.projects).forEach(id => { selected[id] = true; });
        this.setState({ selected });
      } else {
        this.setState({ selected: {} });
      }
    }

    this.sortProjectKeys = (sort, sortedProjectKeys) => {
      let stabilized = sortedProjectKeys.map(key => [this.getDataPoint(this.props.projects[key], sort.dataPoint), key]);

      const comp = (a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      }

      stabilized.sort((a, b) => {
        let difference = (comp(a[0], b[0]) === 0) ? comp(a[1], b[1]) : comp(a[0], b[0]);
        return difference * (sort.direction === 'asc' ? 1 : -1);
      });

      return stabilized.map(arr => arr[1]);
    }

    this.onSortClick = (event, dataPoint) => {
      let sort = { dataPoint: dataPoint, direction: 'asc' };
      if (dataPoint === this.state.sort.dataPoint) {
        sort = { dataPoint, direction: (this.state.sort.direction === 'asc') ? 'desc' : 'asc' };
      }
      this.setState({ sort, sortedProjectKeys: this.sortProjectKeys(sort, this.state.sortedProjectKeys) });
    }
  }

  componentDidMount() {
    this.setState({ sort: this.props.defaultSort, sortedProjectKeys: Object.keys(this.props.projects) });
  }

  render() {
    const { projects, data, name } = this.props;

    const realSelected = Object.keys(this.state.selected).filter(proj => this.state.selected[proj]);

    return (
      <Paper elevation={3}>
        <ProjectToolbar selected={realSelected} name={camelToTitle(name)} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={realSelected.length > 0 && realSelected.length < Object.values(projects).length}
                    checked={Object.values(projects).length > 0 && realSelected.length === Object.values(projects).length}
                    onChange={this.onAllClick}
                    inputProps={{ 'aria-label': 'select all projects' }}
                  />
                </TableCell>
                {data.map((dataPoint, index) =>
                  <TableCell
                    component="th"
                    scope="col"
                    padding={index === 0 ? "none" : "default"}
                    align={index === 0 ? "left" : "right"}
                    key={dataPoint}
                  >
                    {this.props.fixed ?
                      camelToTitle(dataPoint)
                      :
                      <TableSortLabel
                        active={this.state.sort.dataPoint === dataPoint}
                        direction={this.state.sort.dataPoint === dataPoint ? this.state.sort.direction : 'asc'}
                        onClick={(event) => this.onSortClick(event, dataPoint)}
                      >
                        {camelToTitle(dataPoint)}
                      </TableSortLabel>
                    }
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.sortedProjectKeys.map((id, index) =>
                <ProjectRow id={id} index={index} data={data} proj={projects[id]} selected={!!this.state.selected[id]} onRowClick={this.onRowClick} username={this.props.authUser.displayName} />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
}

export default ProjectTable;