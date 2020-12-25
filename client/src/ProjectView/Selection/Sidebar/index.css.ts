import { createStyles, Theme } from "@material-ui/core";

const styles = (width: number) => (theme: Theme) =>
  createStyles({
    root: {
      display: "inline-block",
      position: "absolute",
      width: `${width}rem`,
      height: "100%",
    },
    buttonWrapper: {
      paddingBottom: theme.spacing(2),
    },
    button: {
      width: "100%",
      textAlign: "center",
    },
    item: {
      display: "block",
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    },
    itemIcon: {
      minWidth: 0,
    },
    itemText: {
      display: "inline-block",
      margin: `0 0 0 ${theme.spacing(2)}px`,
      fontSize: "100px !important",
    },
  });

export default styles;
