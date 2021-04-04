import {
  Button,
  Divider,
  Paper,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { FiList, FiPlus } from "react-icons/fi";
import Scrollbar from "react-scrollbars-custom";
import { List } from "../../../../../../../../.shared/src";
import { SidebarProps } from "../../../../../Template/SidebaredBase";
import ListSelect from "../../../Embedded/ListSelect";

import * as ROUTES from "../../../../../../Constants/routes";

import styles from "./index.css";

interface NavigationPropsBase {
  uuid: string;
  lists: List[];
  currentList: number;
  setCurrentList: (list: number) => void;
}

type NavigationProps = SidebarProps &
  NavigationPropsBase &
  WithStyles<typeof styles>;

class Navigation extends React.Component<NavigationProps> {
  render() {
    const {
      lists,
      currentList,
      setCurrentList,
      width,
      uuid,
      classes,
    } = this.props;
    return (
      <div className={classes.root} style={{ width: `${width}rem` }}>
        <Scrollbar>
          <div className={classes.wrapper}>
            <div className={classes.buttonWrapper}>
              <div className={classes.buttonContainer}>
                <Button
                  variant="contained"
                  color="secondary"
                  href={ROUTES.PROJECT_NEW_LIST.replace(":uuid", uuid)}
                >
                  <FiPlus />
                  &nbsp;New List
                </Button>
              </div>
            </div>

            <Paper elevation={3} className={classes.paper}>
              <div className={classes.title}>
                List
                <FiList
                  style={{
                    position: "relative",
                    top: "0.25rem",
                    marginLeft: "0.4rem",
                  }}
                />
                <Divider className={classes.divider} />
              </div>
              <ListSelect
                currentList={currentList}
                listNames={lists.map((list) => list.name)}
                setCurrentList={setCurrentList}
              />
            </Paper>
          </div>
        </Scrollbar>
      </div>
    );
  }
}

export default withStyles(styles)(Navigation);
