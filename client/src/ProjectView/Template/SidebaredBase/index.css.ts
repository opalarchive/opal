import { createStyles } from "@material-ui/core";

const styles = createStyles({
  sidebar: {
    display: "inline-block",
    position: "absolute",
    height: "100%",
  },
  sidebarWrapper: {
    display: "inline-block",
  },
  inner: {
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
});

export default styles;
