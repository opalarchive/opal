import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    dot: {
      display: "inline-block",
      flexShrink: 0,
      position: "relative",
      height: "0.625em",
      width: "0.625em",
      borderRadius: "50%",
      backgroundColor: theme.palette.secondary.main,
    },
  });
export default styles;
