import { createStyles, Theme } from "@material-ui/core";

const styles = (width: number) => (theme: Theme) =>
  createStyles({
    root: {
      display: "inline-block",
      position: "absolute",
      right: 0,
      width: `${width}rem`,
      height: "100%",
    },
  });

export default styles;
