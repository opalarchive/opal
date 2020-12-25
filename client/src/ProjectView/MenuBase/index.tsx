import React from "react";
import Scrollbar from "react-scrollbars-custom";

interface MenuBaseProps {
  width: number;
  right?: boolean;
  background: string;
  Sidebar: React.ComponentType<{ width: number; authUser: firebase.User }>;
  defaultScroll?: number;
  authUser: firebase.User;
  children: JSX.Element | JSX.Element[];
}

const MenuBase: React.FC<MenuBaseProps> = ({
  width,
  right,
  background,
  Sidebar,
  defaultScroll,
  authUser,
  children,
}) => {
  return (
    <>
      <Sidebar width={width} authUser={authUser} />
      <div
        style={{
          position: "relative",
          marginLeft: !!right ? 0 : `${width}rem`,
          marginRight: !!right ? `${width}rem` : 0,
          height: "100%",
          backgroundColor: background,
          display: "flex",
          flexDirection: "column",
        }}
      >
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
    </>
  );
};

export default MenuBase;
