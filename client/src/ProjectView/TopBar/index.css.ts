import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: spacingRem(theme, 1),
    },
    title: {
      flexGrow: 1,
    },
    paper: {
      transformOrigin: "top right",
      backgroundColor: theme.palette.info.light,
    },
    list: {
      width: spacingRem(theme, 40),
      maxHeight: spacingRem(theme, 40),
      overflow: "auto",
    },
    listItem: {
      display: "flex",
      flexDirection: "column",
    },
    loading: {
      display: "flex",
      justifyContent: "center",
      margin: `${spacingRem(theme, 1)} 0`,
    },
    divider: {
      margin: `${spacingRem(theme, 1)} 0`,
    },
    centeredSpace: {
      padding: spacingRem(theme, 1),
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
