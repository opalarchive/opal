import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    wrapper: {
      display: "inline-block",
      position: "absolute",
      right: 0,
      borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
      height: "100%",
      padding: theme.spacing(2),
    },
    root: {},
  });

export default styles;
