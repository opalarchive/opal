import React from 'react';

import * as ROUTES from '../../Constants/routes';

import { TableContainer, Table, TableHead, TableCell, TableRow, Paper, TableBody, Checkbox, Toolbar, Typography, Tooltip, IconButton, makeStyles, lighten } from '@material-ui/core';
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


class ProjectTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {}
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
        return '12:' + (minutes < 10 ? '0' : '') + minutes + (hours < 12 ? 'AM' : 'PM');
      }
      return (hours % 12) + ':' + (minutes < 10 ? '0' : '') + minutes + (hours < 12 ? 'AM' : 'PM');
    }

    this.getDataPoint = (proj, dataPoint) => {
      switch (dataPoint) {
        case 'name':
          return proj.name;
        case 'owner':
          return proj.owner;
        case 'lastModified':
          return this.formatTime(Math.max(...Object.values(proj.editors).map(info => info.lastEdit)));
        case 'shareDate':
          return this.formatTime(proj.editors[this.props.authUser.displayName].shareDate);
        case 'lastModifiedByMe':
          return this.formatTime(proj.editors[this.props.authUser.displayName].lastEdit);
        default:
          return null
      }
    }

    this.onRowClick = (event, projName) => {
      event.preventDefault();

      let selected = this.state.selected;
      selected[projName] = !selected[projName];

      this.setState({ selected });
    }
  }

  render() {
    const { projects, data, fixed, defaultSort, authUser } = this.props;

    return (
      <Paper>
        <ProjectToolbar selected={Object.keys(this.state.selected).filter(proj => this.state.selected[proj])} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={false}
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
                    {this.camelToTitle(dataPoint)}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(projects).map((id, index) => {
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
                          <Link to={ROUTES.PROJECT_VIEW.replace(':id', id)}>{this.getDataPoint(proj, dataPoint)}</Link>
                        </TableCell>
                        : <TableCell align="right" key={`${id}-${dataPoint}`}>{this.getDataPoint(proj, dataPoint)}</TableCell>
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