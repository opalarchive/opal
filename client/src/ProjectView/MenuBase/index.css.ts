import { createStyles } from "@material-ui/core";

const styles = createStyles({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  centered: {
    margin: "0 auto",
    position: "relative",
  },
  sidebar: {
    display: "inline-block",
    position: "absolute",
    height: "100%",
  },
  inner: {
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
});

export default styles;
