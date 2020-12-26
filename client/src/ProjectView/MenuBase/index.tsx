import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import Scrollbar from "react-scrollbars-custom";
import generateStyles from "./index.css";

const blankStyles = generateStyles(0, false, "white", false);

interface MenuBaseProps {
  width: number;
  right?: boolean;
  background: string;
  totalScroll?: boolean;
  Sidebar: React.ComponentType<{ width: number; authUser: firebase.User }>;
  defaultScroll?: number;
  authUser: firebase.User;
  children: JSX.Element | JSX.Element[];
}

const MenuBaseBase: React.FC<
  MenuBaseProps & WithStyles<typeof blankStyles>
> = ({
  width,
  right,
  background,
  totalScroll,
  Sidebar,
  defaultScroll,
  authUser,
  children,
  classes,
}) => {
  return (
    <div className={classes.root}>
      <Sidebar width={width} authUser={authUser} />
      <div className={classes.inner}>
        <Scrollbar noScrollX scrollTop={defaultScroll}>
          <div
            style={{
              padding: "1rem",
            }}
          >
            {children}
          </div>
        </Scrollbar>
      </div>
    </div>
  );
};

const MenuBase: React.FC<MenuBaseProps> = (props) => {
  const MenuBaseStyled = withStyles(
    generateStyles(
      props.width,
      !!props.right,
      props.background,
      !!props.totalScroll
    )
  )(MenuBaseBase);

  return <MenuBaseStyled {...props} />;
};

export default MenuBase;
