import React from "react";

import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  Paper,
  TableBody,
  Checkbox,
  TableSortLabel
} from "@material-ui/core";
import { camelToTitle, getDataPoint } from "./constants.js";
import ProjectToolbar from "./projecttoolbar";
import ProjectRow from "./projectrow";
import Modal from "./modal";
import {
  deleteProject,
  deleteForeverProject,
  shareProject,
  changeName,
  restoreProject,
  starProject
} from "../../../Firebase";

class ProjectTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {},
      sortedProjectKeys: [],
      sort: {
        dataPoint: "name",
        direction: "asc"
      },
      modal: {
        show: false,
        type: "share",
        input: "",
        activeProject: ""
      }
    };

    this.onRowClick = this.onRowClick.bind(this);
    this.onAllClick = this.onAllClick.bind(this);
    this.sortProjectKeys = this.sortProjectKeys.bind(this);
    this.onSortClick = this.onSortClick.bind(this);
    this.showModal = this.showModal.bind(this);
    this.updateModalInput = this.updateModalInput.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.modalSuccess = this.modalSuccess.bind(this);
  }

  componentDidMount() {
    this.setState({
      sort: this.props.defaultSort,
      sortedProjectKeys: Object.keys(this.props.projects)
    });
  }

  onRowClick(event, projID) {
    event.preventDefault();

    let selected = this.state.selected;
    selected[projID] = !selected[projID];

    this.setState({ selected });
  }

  onAllClick(event) {
    if (event.target.checked) {
      let selected = {};
      Object.keys(this.props.projects).forEach((id) => {
        selected[id] = true;
      });
      this.setState({ selected });
    } else {
      this.setState({ selected: {} });
    }
  }

  sortProjectKeys(sort, sortedProjectKeys) {
    let stabilized = sortedProjectKeys.map((key) => [
      getDataPoint(this.props.projects[key], sort.dataPoint),
      key
    ]);

    const comp = (a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };

    stabilized.sort((a, b) => {
      let difference =
        comp(a[0], b[0]) === 0 ? comp(a[1], b[1]) : comp(a[0], b[0]);
      return difference * (sort.direction === "asc" ? 1 : -1);
    });

    return stabilized.map((arr) => arr[1]);
  }

  onSortClick(event, dataPoint) {
    let sort = { dataPoint: dataPoint, direction: "asc" };
    if (dataPoint === this.state.sort.dataPoint) {
      sort = {
        dataPoint,
        direction: this.state.sort.direction === "asc" ? "desc" : "asc"
      };
    }
    this.setState({
      sort,
      sortedProjectKeys: this.sortProjectKeys(
        sort,
        this.state.sortedProjectKeys
      )
    });
  }

  showModal(event, type, activeProject) {
    event.stopPropagation();

    this.setState({ modal: { show: true, type, input: "", activeProject } });
  }

  updateModalInput(event) {
    event.preventDefault();

    this.setState({
      modal: { ...this.state.modal, input: event.target.value }
    });
  }

  closeModal(event) {
    event.preventDefault();

    this.setState({
      modal: { ...this.state.modal, show: !this.state.modal.show }
    });
  }

  async modalSuccess(event) {
    event.preventDefault();

    switch (this.state.modal.type) {
      case "delete":
        const tryToDelete = await deleteProject(
          this.state.modal.activeProject,
          this.props.authUser.uid
        );
        break;
      case "delete-forever":
        const tryToDeleteForever = await deleteForeverProject(
          this.state.modal.activeProject,
          this.props.authUser.uid
        );
        break;
      case "share":
        const tryToShare = await shareProject(
          this.state.modal.input,
          this.state.modal.activeProject,
          this.props.authUser.uid
        );
        break;
      case "change-name":
        const tryToChange = await changeName(
          this.state.modal.input,
          this.state.modal.activeProject,
          this.props.authUser.uid
        );
        break;
      case "restore":
        const tryToRestore = await restoreProject(
          this.state.modal.activeProject,
          this.props.authUser.uid
        );
        break;
      case "star":
        const tryToStar = await starProject(this.state.modal.activeProject, this.props.authUser.uid);
        break;
      default:
        console.log("Undefined");
    }

    this.closeModal({preventDefault: () => {}});
    this.props.refreshProjects();
  }

  render() {
    const { projects, data, name } = this.props;

    const realSelected = Object.keys(this.state.selected).filter(
      (proj) => this.state.selected[proj]
    );

    return (
      <Paper elevation={3}>
        <Modal
          show={this.state.modal.show}
          type={this.state.modal.type}
          onClose={this.closeModal}
          input={this.state.modal.input}
          inputChange={this.updateModalInput}
          modalSuccess={this.modalSuccess}
        />
        <ProjectToolbar
          selected={realSelected}
          name={camelToTitle(name)}
          showModal={(type) =>
            this.setState({ modal: { show: !this.state.modal.show, type } })
          }
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      realSelected.length > 0 &&
                      realSelected.length < Object.values(projects).length
                    }
                    checked={
                      Object.values(projects).length > 0 &&
                      realSelected.length === Object.values(projects).length
                    }
                    onChange={this.onAllClick}
                    inputProps={{ "aria-label": "select all projects" }}
                  />
                </TableCell>
                {data.map((dataPoint, index) => (
                  <TableCell
                    component="th"
                    scope="col"
                    padding={index === 0 ? "none" : "default"}
                    align={index === 0 ? "left" : "right"}
                    key={dataPoint}
                  >
                    {this.props.fixed ? (
                      camelToTitle(dataPoint)
                    ) : (
                      <TableSortLabel
                        active={this.state.sort.dataPoint === dataPoint}
                        direction={
                          this.state.sort.dataPoint === dataPoint
                            ? this.state.sort.direction
                            : "asc"
                        }
                        onClick={(event) => this.onSortClick(event, dataPoint)}
                      >
                        {camelToTitle(dataPoint)}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.sortedProjectKeys.map((id, index) => (
                <ProjectRow
                  id={id}
                  index={index}
                  data={data}
                  proj={projects[id]}
                  selected={!!this.state.selected[id]}
                  onRowClick={this.onRowClick}
                  username={this.props.authUser.displayName}
                  showModal={this.showModal}
                  name={name}
                  key={`project-row-${id}`}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
}

export default ProjectTable;
