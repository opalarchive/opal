import React from 'react';
import Scrollbar from 'react-scrollbars-custom';

const MenuBase = (props) => {
  const { width, right, background, Sidebar, defaultScroll, authUser, children } = props;

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
        <Scrollbar
          noScrollX
          scrollTop={defaultScroll}
        >
          <div style={{
            padding: "1rem",
          }}>
            {children}
          </div>
        </Scrollbar>
      </div>
    </>
  )
}

export default MenuBase;
