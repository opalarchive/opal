import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../Constants";

export const notifBoxStyles = (theme: Theme) =>
  createStyles({
    listItem: {
      display: "flex",
      flexDirection: "column",
    },
    notificationDot: {
      fontSize: "4rem",
      marginLeft: "0.2em",
      color: theme.palette.primary.light,
    },
  });

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: spacingRem(theme, 1),
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
    link: {
      color: theme.palette.primary.light,
    },
  });

export default styles;
