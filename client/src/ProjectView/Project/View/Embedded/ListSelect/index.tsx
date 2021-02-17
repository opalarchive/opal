import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import styles from "./index.css";
import { FiChevronDown } from "react-icons/fi";

interface ListSelectProps extends WithStyles<typeof styles> {
  listMenuAnchorEl: HTMLElement | null;
  currentList: number;
  listNames: string[];
  setCurrentList: (ind: number) => void;
  openListMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  closeListMenu: () => void;
}

class ListSelect extends React.PureComponent<ListSelectProps> {
  render() {
    const {
      listMenuAnchorEl,
      currentList,
      listNames,
      setCurrentList,
      openListMenu,
      closeListMenu,
      classes,
    } = this.props;
    // we just need to match the mui styles
    return (
      <>
        <div
          style={{
            display: "flex",
            padding: "0px 16px",
            minHeight: "48px",
          }}
        >
          <div style={{ margin: "12px 0" }}>
            <span className={classes.valueDescriptor}>Current:</span>
            {currentList < 0 ? "All Problems" : listNames[currentList]}
          </div>
          <IconButton
            color="inherit"
            onClick={openListMenu}
            aria-controls="list-select-menu"
            aria-haspopup="true"
            edge="end"
          >
            <FiChevronDown />
          </IconButton>
        </div>
        <Menu
          id="list-select-menu"
          anchorEl={listMenuAnchorEl}
          keepMounted
          open={!!listMenuAnchorEl}
          onClose={closeListMenu}
          elevation={3}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={(_) => {
              setCurrentList(-1);
              closeListMenu();
            }}
            className={currentList === -1 ? classes.currentList : undefined}
          >
            All Problems
          </MenuItem>
          {listNames.map((listName, ind) => (
            <MenuItem
              key={`list-${ind}`}
              onClick={(_) => {
                setCurrentList(ind);
                closeListMenu();
              }}
              className={currentList === ind ? classes.currentList : undefined}
            >
              {listName}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }
}

export default withStyles(styles)(ListSelect);
