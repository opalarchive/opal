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
  Button,
  TextField
} from "@material-ui/core";
import { amber } from "@material-ui/core/colors";
import {
  FiList,
  FiChevronDown,
  FiTag
} from "react-icons/fi";
import styles from "./index.css";
import { compose } from "recompose";
import { SidebarProps } from "../../../../Template/SidebaredBase";
import { ProjectPrivate } from "../../../../../../../.shared";
import { changeList, changeTags, newTag } from "../../../../../Firebase";
import Tag from "../../Ornamentation/Tag"
import Scrollbar from "react-scrollbars-custom";

interface SidebarListProps {
  project: ProjectPrivate;
  ind: number;
  uuid: string;
  allTags: Set<string>;
}

type Props = SidebarProps & SidebarListProps & WithStyles<typeof styles> & WithTheme;

interface State {
  changingList: boolean;
  canChangeList: boolean;
  originalListSelection: boolean[];
  listSelection: boolean[];
  changingTags: boolean;
  newTag: string;
  canNewTag: boolean;
  originalClickedTags: object;
  clickedTags: object;
  canChangeTags: boolean;
}

class Sidebar extends React.Component<Props, State> {
  state = {
    changingList: false, //when thing is changing in db
    canChangeList: false, //when original lists is same as selection
    originalListSelection: [] as boolean[], //original boolean array of which lists the problem is in
    listSelection: [] as boolean[],
    changingTags: false, //this will be used for both changeTag and newTag
    newTag: "",
    canNewTag: false, //we don't support empty length, which it is when this state is initialized
    originalClickedTags: {} as { [tag: string]: boolean },
    clickedTags: {} as { [tag: string]: boolean },
    canChangeTags: false,
  }

  constructor(props: Props) {
    super(props);

    this.onChangeListSelection = this.onChangeListSelection.bind(this);
    this.onChangeNewTag = this.onChangeNewTag.bind(this);
    this.onClickTag = this.onClickTag.bind(this);
    this.changeList = this.changeList.bind(this);
    this.changeTags = this.changeTags.bind(this);
    this.newTag = this.newTag.bind(this);
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

    let clickedTags = {} as { [tag: string]: boolean };
    [...this.props.allTags].forEach((tag: string) => {
      clickedTags[tag] = this.props.project.problems[this.props.ind].tags.includes(tag);
    });

    this.setState({ originalListSelection: [...listSelection], listSelection, originalClickedTags: { ...clickedTags }, clickedTags });
  }

  onChangeListSelection(e: React.ChangeEvent<HTMLInputElement>, listInd: number) {
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

  onChangeNewTag(e: React.ChangeEvent<HTMLInputElement>) {
    let canNewTag = true;
    if ([...this.props.allTags].includes(e.target.value) || e.target.value == "") {
      canNewTag = false;
    }
    this.setState({ newTag: e.target.value, canNewTag });
  }

  onClickTag(tagText: string) {
    let clickedTags = this.state.clickedTags;
    clickedTags[tagText] = !clickedTags[tagText];
    let canChangeTags = false;
    for (const tag in this.state.originalClickedTags) {
      if (clickedTags[tag] != this.state.originalClickedTags[tag]) {
        canChangeTags = true;
        break;
      }
    }
    this.setState({ clickedTags, canChangeTags });
  }

  async changeList() {
    this.setState({ changingList: true, originalListSelection: [...this.state.listSelection], canChangeList: false });
    await changeList(this.props.uuid, this.state.listSelection, this.props.ind, this.props.authUser);
    this.setState({ changingList: false });
  }

  async changeTags() {
    this.setState({ changingTags: true, originalClickedTags: { ...this.state.clickedTags }, canChangeTags: false });
    await changeTags(this.props.uuid, this.state.clickedTags, this.props.ind, this.props.authUser);
    this.setState({ changingTags: false });
  }

  async newTag() {
    this.setState({ changingTags: true, canNewTag: false });
    await newTag(this.props.uuid, this.state.newTag, this.props.ind, this.props.authUser);
    this.setState({ changingTags: false });
  }

  render() {
    const { classes, width, authUser, theme, project, ind, uuid, allTags } = this.props;
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
                  <FormControl component="fieldset" className={classes.formControl}>
                    <FormGroup>
                      {project.lists.map((list, listInd) => (
                        <FormControlLabel
                          control={<Checkbox onChange={(e) => this.onChangeListSelection(e, listInd)} name={list.name} />}
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
            <Paper elevation={3} className={classes.paper}>
              <div className={classes.title}>
                Tags
                <FiTag />
                <Divider className={classes.divider} />
              </div>
              <Accordion elevation={0} className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<FiChevronDown />}
                  aria-controls="keyword-filter-content"
                  id="keyword-filter-header"
                >
                  Add/Remove Existing Tags
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <div className={classes.tagContainer}>
                    {[...allTags].map((tag) => (
                      <Tag
                        key={tag}
                        text={tag}
                        clicked={!!this.state.clickedTags[tag]}
                        onClickTag={(tagText: string) =>
                          this.onClickTag(tagText)
                        }
                      />
                    ))}
                  </div>
                  {this.state.changingTags ? (
                    <Button variant="contained" color="primary" disabled>
                      changing...
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" disabled={!this.state.canChangeTags} onClick={() => this.changeTags()}>
                      change
                    </Button>
                  )}
                </AccordionDetails>
              </Accordion>
              <Accordion elevation={0} className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<FiChevronDown />}
                  aria-controls="keyword-filter-content"
                  id="keyword-filter-header"
                >
                  Add New Tag
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <TextField
                    name="newTag"
                    id="newTag"
                    label="New Tag"
                    value={this.state.newTag}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      e.preventDefault();
                      e.stopPropagation();

                      this.onChangeNewTag(e);
                    }}
                  />
                  {this.state.changingTags ? (
                    <Button variant="contained" color="primary" disabled>
                      adding...
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" disabled={!this.state.canNewTag} onClick={() => this.newTag()}>
                      add
                    </Button>
                  )}
                </AccordionDetails>
              </Accordion>
            </Paper>
          </div>
        </Scrollbar>
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
