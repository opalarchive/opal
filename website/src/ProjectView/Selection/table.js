import { TableContainer, Table, TableHead, TableCell, TableRow, Paper, TableBody } from '@material-ui/core';
import React from 'react';

class ProjectTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
        return 'Hello time traveler!';
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


    const getDataPoint = (proj, dataPoint) => {
      switch (dataPoint) {
        case 'name':
          return proj.name;
        case 'owner':
          return proj.owner;
        case 'lastModified':
          return formatTime(Math.max(...Object.values(proj.editors).map(info => info.lastEdit)));
        case 'shareDate':
          return formatTime(proj.editors[this.props.authUser.uid].shareDate);
        case 'lastModifiedByMe':
          return formatTime(proj.editors[this.props.authUser.uid].lastEdit);
        default:
          return null
      }
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {this.props.data.map((dataPoint, index) => (
                <TableCell component="th" scope="col" align={index == 0 ? "left" : "right"}>{camelToTitle(dataPoint)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(this.props.projects).map(id => {
              let proj = this.props.projects[id];
              console.log(proj);

              return (
                <TableRow key={proj.name}>
                  {this.props.data.map((dataPoint, index) => {
                    if (index == 0) {
                      return <TableCell component="th" scope="row">{getDataPoint(proj, dataPoint)}</TableCell>;
                    }
                    return <TableCell align="right">{getDataPoint(proj, dataPoint)}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

    );
  }
}

export default ProjectTable;