import React from "react";

import {
  Paper,
  withStyles,
  WithStyles,
  withTheme,
  WithTheme,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Button
} from "@material-ui/core";
import { amber } from "@material-ui/core/colors";
import {
  FiList,
  FiChevronDown
} from "react-icons/fi";
import styles from "./index.css";
import { compose } from "recompose";
import { SidebarProps } from "../../../../Template/SidebaredBase";
import { ProjectPrivate } from "../../../../../../../.shared";
import { changeList } from "../../../../../Firebase";

interface SidebarListProps {
  project: ProjectPrivate;
  ind: number;
  uuid: string;
}

type Props = SidebarProps & SidebarListProps & WithStyles<typeof styles> & WithTheme;

interface State {
  changingList: boolean;
  canChangeList: boolean;
  originalListSelection: boolean[];
  listSelection: boolean[];
}

class Sidebar extends React.Component<Props, State> {
  state = {
    changingList: false, //when thing is changing in db
    canChangeList: false, //when original lists is same as selection
    originalListSelection: [false], //original boolean array of which lists the problem is in
    listSelection: [false], //otherwise i get screamed at in onChange
  }

  constructor(props: Props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.changeList = this.changeList.bind(this);
  }

  componentDidMount() {
    let listSelection = [];
    const lists = this.props.project.lists;
    for (let i=0; i<this.props.project.lists.length; i++) {
      if (lists[i].problems.includes(this.props.ind)) {
        listSelection.push(true);
      } else {
        listSelection.push(false);
      }
    }
    this.setState({ originalListSelection: [...listSelection], listSelection });
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>, listInd: number) {
    const listSelection = this.state.listSelection;
    listSelection[listInd] = !listSelection[listInd];
    let canChangeList = false;
    for (let i=0; i<listSelection.length; i++) {
      if (listSelection[i] != this.state.originalListSelection[i]) {
        canChangeList = true;
        break;
      }
    }
    this.setState({ listSelection, canChangeList });
  }

  async changeList() {
    this.setState({ changingList: true, originalListSelection: [...this.state.listSelection] });
    await changeList(this.props.uuid, this.state.listSelection, this.props.ind, this.props.authUser);
    this.setState({ changingList: false });
  }

  render() {
    const { classes, width, authUser, theme, project, ind, uuid } = this.props;
    return (
      <div className={classes.root} style={{ width: `${width}rem` }}>
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
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormGroup>
                    {project.lists.map((list, listInd) => (
                      <FormControlLabel
                        control={<Checkbox onChange={(e) => this.onChange(e, listInd)} name={list.name} />}
                        label={list.name}
                        checked={this.state.listSelection[listInd]}
                      />
                    ))}
                  </FormGroup>
                  {this.state.changingList ? (
                    <Button variant="contained" color="primary" disabled>
                      changing...
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" disabled={!this.state.canChangeList} onClick={() => this.changeList()}>
                      change
                    </Button>
                  )}
                </FormControl>
              </AccordionDetails>
            </Accordion>          
          </Paper>
        </div>
      </div>
    );
  }
}

export default compose<
  SidebarProps & SidebarListProps & WithStyles<typeof styles> & WithTheme,
  SidebarProps
>(
  withStyles(styles),
  withTheme
)(Sidebar);
