import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
    },
    paper: {
      transformOrigin: "top right",
      backgroundColor: theme.palette.info.light,
    },
    list: {
      width: theme.spacing(40),
      maxHeight: theme.spacing(40),
      overflow: "auto",
    },
    listItem: {
      display: "flex",
      flexDirection: "column",
    },
    loading: {
      display: "flex",
      justifyContent: "center",
      margin: theme.spacing(1, 0),
    },
    divider: {
      margin: theme.spacing(1, 0),
    },
    centeredSpace: {
      padding: theme.spacing(1),
      textAlign: "center",
    },
    notificationDot: {
      fontSize: "4rem",
      marginLeft: "0.2em",
      color: theme.palette.primary.light,
    },
    link: {
      color: theme.palette.primary.light,
    },
  });

export default styles;
