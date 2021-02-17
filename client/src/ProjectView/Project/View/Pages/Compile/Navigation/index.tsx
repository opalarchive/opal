import { Divider, Paper, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { FiList } from "react-icons/fi";
import Scrollbar from "react-scrollbars-custom";
import { List } from "../../../../../../../../.shared";
import { SidebarProps } from "../../../../../Template/SidebaredBase";
import ListSelect from "../../../Embedded/ListSelect";
import styles from "./index.css";

interface NavigationPropsBase {
  lists: List[];
  currentList: number;
  setCurrentList: (list: number) => void;
}

type NavigationProps = SidebarProps &
  NavigationPropsBase &
  WithStyles<typeof styles>;

class Navigation extends React.Component<NavigationProps> {
  constructor(props: NavigationProps) {
    super(props);
  }

  render() {
    const { lists, currentList, setCurrentList, width, classes } = this.props;
    return (
      <div className={classes.root} style={{ width: `${width}rem` }}>
        <Scrollbar>
          <div className={classes.wrapper}>
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
