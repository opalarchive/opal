import React from 'react';

import * as ROUTES from '../../Constants/routes';

import { TableContainer, Table, TableHead, TableCell, TableRow, Paper, TableBody, Checkbox, Toolbar, Typography, Tooltip, IconButton, makeStyles, lighten, TableSortLabel } from '@material-ui/core';
import { Filter, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';

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
            Projects
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

const tableStyles = makeStyles((theme) => ({
  
}));

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

    this.camelToTitle = (string) => {
      let result = string.replace(/([A-Z])/g, " $1");
      return result.charAt(0).toUpperCase() + result.slice(1);
    }

    this.formatTime = time => {
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

      if (minutes == 0) {
        if (hours % 12 == 0) {
          return '12:00 ' + (hours == 0 ? 'AM' : 'PM');
        }
        return (hours % 12) + ':00' + (hours < 12 ? 'AM' : 'PM');
      }
      if (hours % 12 == 0) {
        return '12:' + (minutes < 10 ? '0' : '') + minutes + ' ' + (hours < 12 ? 'AM' : 'PM');
      }
      return (hours % 12) + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + (hours < 12 ? 'AM' : 'PM');
    }

    this.getDataPoint = (proj, dataPoint) => {
      switch (dataPoint) {
        case 'name':
          return proj.name;
        case 'owner':
          return proj.owner;
        case 'lastModified':
          return Math.max(...Object.values(proj.editors).map(info => info.lastEdit));
        case 'shareDate':
          return proj.editors[this.props.authUser.displayName].shareDate;
        case 'lastModifiedByMe':
          return proj.editors[this.props.authUser.displayName].lastEdit;
        default:
          return null
      }
    }

    this.formatData = data => {
      if (typeof data === 'number') {
        return this.formatTime(data);
      }
      return data;
    }

    this.onRowClick = (event, projName) => {
      event.preventDefault();

      let selected = this.state.selected;
      selected[projName] = !selected[projName];

      this.setState({ selected });
    }

    this.onAllClick = (event) => {
      if (event.target.checked) {
        let selected = {};
        Object.values(this.props.projects).every(proj => {
          selected[proj.name] = true;
          return true;
        });
        console.log(selected);
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
    const { projects, data, fixed, defaultSort, authUser } = this.props;

    const realSelected = Object.keys(this.state.selected).filter(proj => this.state.selected[proj]);
    const { orderBy, order } = this.state.sort;

    return (
      <Paper>
        <ProjectToolbar selected={realSelected} />
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
                      this.camelToTitle(dataPoint)
                      :
                      <TableSortLabel
                        active={this.state.sort.dataPoint === dataPoint}
                        direction={this.state.sort.dataPoint === dataPoint ? this.state.sort.direction : 'asc'}
                        onClick={(event) => this.onSortClick(event, dataPoint)}
                        disabled={!this.props.fixed}
                      >
                        {this.camelToTitle(dataPoint)}
                      </TableSortLabel>
                    }
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.sortedProjectKeys.map((id, index) => {
                let proj = projects[id];
                const labelId = `project-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => this.onRowClick(event, proj.name)}
                    role="checkbox"
                    aria-checked={!!this.state.selected[proj.name]}
                    selected={!!this.state.selected[proj.name]}
                    key={proj.name}
                    tabIndex={-1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={!!this.state.selected[proj.name]}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    {data.map((dataPoint, index) =>
                      (index == 0 ?
                        <TableCell component="th" scope="row" id={labelId} padding="none" key={`${id}-${dataPoint}`}>
                          <Link to={ROUTES.PROJECT_VIEW.replace(':id', id)}>{this.formatData(this.getDataPoint(proj, dataPoint))}</Link>
                        </TableCell>
                        : <TableCell align="right" key={`${id}-${dataPoint}`}>{this.formatData(this.getDataPoint(proj, dataPoint))}</TableCell>
                      ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
}

export default ProjectTable;