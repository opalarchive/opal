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
  TableSortLabel,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { getDataPoint } from "./constants";
import ProjectToolbar from "./projecttoolbar";
import ProjectRow from "./projectrow";
import Modal from "./modal";
import { starProject, tryProjectActionProtected } from "../../../Firebase";
import { camelToTitle } from "../../../Constants";
import { FiArrowDown } from "react-icons/fi";
import {
  Client,
  projectAction,
  isProjectActionProtected,
  isProjectActionTrivial,
} from "../../../../../.shared";
import {
  ProjectDataPoint,
  ProjectViewSort,
  ProjectViewType,
  Result,
} from "../../../Constants/types";
import styles from "./index.css";

interface Selected {
  [uuid: string]: boolean;
}

interface ProjectTableProps extends WithStyles<typeof styles> {
  projects: Client.Publico;
  data: ProjectDataPoint[];
  fixed: boolean;
  defaultSort: ProjectViewSort;
  authUser: firebase.User;
  name: ProjectViewType;
  refreshProjects: () => Promise<void>;
}

interface ProjectTableState {
  selected: Selected;
  sort: ProjectViewSort;
  modal: {
    show: boolean;
    type: projectAction;
    input: string;
    activeProject: string;
  };
}

class ProjectTable extends React.Component<
  ProjectTableProps,
  ProjectTableState
> {
  state = {
    selected: {} as Selected,
    sort: {
      dataPoint: "name",
      direction: "asc",
    } as ProjectViewSort,
    modal: {
      show: false,
      type: "SHARE" as projectAction,
      input: "",
      activeProject: "",
    },
  };

  constructor(props: ProjectTableProps) {
    super(props);

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
    });
  }

  onRowClick(event: React.MouseEvent<HTMLTableRowElement>, uuid: string) {
    event.preventDefault();

    let selected = this.state.selected;
    selected[uuid] = !selected[uuid];

    this.setState({ selected });
  }

  onAllClick(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      let selected = {} as Selected;
      Object.keys(this.props.projects).forEach((uuid) => {
        selected[uuid] = true;
      });
      this.setState({ selected });
    } else {
      this.setState({ selected: {} as Selected });
    }
  }

  sortProjectKeys(sort: ProjectViewSort, projectKeys: string[]) {
    type anchoredData = {
      data: string | number;
      key: string;
    };

    let stabilized: anchoredData[] = projectKeys.map((key) => ({
      data: getDataPoint(
        this.props.projects[key],
        sort.dataPoint,
        this.props.authUser.displayName!
      ),
      key,
    }));

    // cant just subtract because strings :(
    const comp = (a: string | number, b: string | number) => {
      if (typeof a === "string") a = a.toLowerCase();
      if (typeof b === "string") b = b.toLowerCase();

      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };

    stabilized.sort((a, b) => {
      let difference =
        comp(a.data, b.data) === 0 ? comp(a.key, b.key) : comp(a.data, b.data);
      return difference * (sort.direction === "asc" ? 1 : -1);
    });

    return stabilized.map((arr) => arr.key);
  }

  onSortClick(
    event: React.MouseEvent<HTMLButtonElement>,
    dataPoint: ProjectDataPoint
  ) {
    let sort: ProjectViewSort = { dataPoint: dataPoint, direction: "asc" };
    if (dataPoint === this.state.sort.dataPoint) {
      sort = {
        dataPoint,
        direction: this.state.sort.direction === "asc" ? "desc" : "asc",
      };
    }
    this.setState({
      sort,
    });
  }

  showModal(type: projectAction, activeProject: string) {
    this.setState({ modal: { show: true, type, input: "", activeProject } });
  }

  updateModalInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    this.setState({
      modal: { ...this.state.modal, input: event.target.value },
    });
  }

  closeModal(event?: React.MouseEvent<HTMLButtonElement>) {
    if (!!event) event.preventDefault();

    this.setState({
      modal: { ...this.state.modal, show: !this.state.modal.show },
    });
  }

  async modalSuccess(event?: React.MouseEvent<HTMLButtonElement>) {
    if (!!event) event.preventDefault();

    let attempt: Result<string> = { success: false, value: "" };

    if (isProjectActionProtected(this.state.modal.type)) {
      attempt = await tryProjectActionProtected(
        this.state.modal.activeProject,
        this.props.authUser,
        this.state.modal.type,
        this.state.modal.input
      );
    } else if (isProjectActionTrivial(this.state.modal.type)) {
      // currently this is the only trivial action, but this may change
      // TODO: generalize this
      attempt = await starProject(
        this.state.modal.activeProject,
        this.props.authUser
      );
    } else {
      console.log("Undefined");
    }

    if (attempt.success) {
      this.closeModal();
      this.props.refreshProjects();
    } else {
      // maybe display error
    }
  }

  render() {
    const { projects, data, name, classes } = this.props;

    const realSelected = Object.keys(this.state.selected).filter(
      (proj) => this.state.selected[proj]
    );

    // console.log("------");
    // console.log(projects);

    const sortedProjectKeys = this.sortProjectKeys(
      this.props.defaultSort,
      Object.keys(this.props.projects)
    );

    return (
      <div className={classes.root}>
        <Paper elevation={2}>
          <Modal
            show={this.state.modal.show}
            type={this.state.modal.type}
            closeModal={this.closeModal}
            input={this.state.modal.input}
            inputChange={this.updateModalInput}
            modalSuccess={this.modalSuccess}
          />
          <ProjectToolbar
            selected={realSelected}
            name={camelToTitle(name)}
            showModal={(type: projectAction) =>
              this.setState({
                modal: {
                  show: !this.state.modal.show,
                  type,
                  input: "",
                  activeProject: "",
                },
              })
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
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => this.onSortClick(event, dataPoint)}
                          IconComponent={FiArrowDown}
                        >
                          {camelToTitle(dataPoint)}
                        </TableSortLabel>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedProjectKeys.map((uuid, index) => (
                  <ProjectRow
                    uuid={uuid}
                    index={index}
                    data={data}
                    proj={projects[uuid]}
                    selected={!!this.state.selected[uuid]}
                    onRowClick={this.onRowClick}
                    username={this.props.authUser.displayName!}
                    showModal={this.showModal}
                    name={name}
                    key={`project-row-${uuid}`}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(ProjectTable);
