import React from "react";

import {
  Paper,
  withStyles,
  WithStyles,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
} from "@material-ui/core";
import { FiList, FiChevronDown } from "react-icons/fi";
import styles from "./index.css";
import { SidebarProps } from "../../../../../Template/SidebaredBase";
import { ProjectPrivate, projectRole, ProjectRole, Server } from "../../../../../../../../.shared";
import { changeList } from "../../../../../../Firebase";
import Scrollbar from "react-scrollbars-custom";
import { ClientProblem } from "../../../../../../Constants/types";

interface SidebarListProps extends ClientProblem {
  project: ProjectPrivate;
  allTags: Set<string>;
  myRole: projectRole;
  authUser: firebase.User;
}

type ActionProps = SidebarProps & SidebarListProps & WithStyles<typeof styles>;

interface ActionState {
  changingList: boolean;
  canChangeList: boolean;
  originalListSelection: boolean[];
  listSelection: boolean[];
}

class Action extends React.Component<ActionProps, ActionState> {
  shouldComponentUpdate(nextProps: ActionProps, nextState: ActionState) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    );
  }

  state = {
    changingList: false, //when thing is changing in db
    canChangeList: false, //when original lists is same as selection
    originalListSelection: [] as boolean[], //original boolean array of which lists the problem is in
    listSelection: [] as boolean[],
  };

  constructor(props: ActionProps) {
    super(props);

    this.onChangeListSelection = this.onChangeListSelection.bind(this);
    this.changeList = this.changeList.bind(this);
  }

  componentDidMount() {
    let listSelection = [];
    const lists = this.props.project.lists;
    for (let i = 0; i < this.props.project.lists.length; i++) {
      if (lists[i].problems.includes(this.props.ind)) {
        listSelection.push(true);
      } else {
        listSelection.push(false);
      }
    }

    this.setState({
      originalListSelection: [...listSelection],
      listSelection,
    });
  }

  onChangeListSelection(
    e: React.ChangeEvent<HTMLInputElement>,
    listInd: number
  ) {
    const listSelection = [...this.state.listSelection];
    listSelection[listInd] = !listSelection[listInd];
    let canChangeList = false;
    for (let i = 0; i < listSelection.length; i++) {
      if (listSelection[i] !== this.state.originalListSelection[i]) {
        canChangeList = true;
        break;
      }
    }
    this.setState({ listSelection, canChangeList });
  }

  async changeList() {
    this.setState({
      changingList: true,
      originalListSelection: [...this.state.listSelection],
      canChangeList: false,
    });
    await changeList(
      this.props.uuid,
      this.state.listSelection,
      this.props.ind,
      this.props.authUser
    );
    this.setState({ changingList: false });
  }

  render() {
    const { classes, width, project, myRole, authUser, author } = this.props;
    const canEdit: boolean =
      ProjectRole[myRole] == 0 ||
      ProjectRole[myRole] == 1 ||
      authUser.displayName === author;
    return (
      <div className={classes.root} style={{ width: `${width}rem` }}>
        <Scrollbar>
          <div className={classes.wrapper}>
            <Paper elevation={3} className={classes.paper}>
              <div className={classes.title}>
                Lists
                <FiList
                  style={{
                    position: "relative",
                    top: "0.3rem",
                    marginLeft: "0.4rem",
                  }}
                />
                <Divider className={classes.divider} />
              </div>
              <Accordion elevation={0} className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<FiChevronDown />}
                  aria-controls="keyword-filter-content"
                  id="keyword-filter-header"
                >
                  Change Lists
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <FormControl component="fieldset">
                    <FormGroup>
                      {project.lists.map((list, listInd) => (
                        <FormControlLabel
                          key={`list-${listInd}`}
                          control={
                            <Checkbox
                              onChange={(e) =>
                                this.onChangeListSelection(e, listInd)
                              }
                              checked={!!this.state.listSelection[listInd]}
                              name={list.name}
                              disabled={!canEdit}
                            />
                          }
                          label={list.name}
                        />
                      ))}
                    </FormGroup>
                    {this.state.changingList ? (
                      <Button variant="contained" color="primary" disabled>
                        changing...
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={!this.state.canChangeList}
                        onClick={() => this.changeList()}
                      >
                        change
                      </Button>
                    )}
                  </FormControl>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </div>
        </Scrollbar>
      </div>
    );
  }
}

export default withStyles(styles)(Action);
