import { createStyles, darken, lighten, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: spacingRem(theme, 3),
      paddingRight: spacingRem(theme, 1.5),
    },
    top: {
      fontSize: "1.2rem",
      display: "flex",
    },
    topLink: {
      paddingBottom: "1rem",
      display: "flex",
      color: "rgba(0, 0, 0, 0.87)",
      textDecoration: "none",
      "&:hover": {
        color: darken(theme.palette.secondary.light, 0.1),
      },
      "&:focus": {
        color: darken(theme.palette.secondary.light, 0.1),
        outline: "none",
      },
    },
    topIcon: {
      position: "relative",
      top: "0.32rem",
      marginRight: "0.25rem",
    },
    topFiller: {
      flexGrow: 1,
    },
    replyOffset: {
      position: "relative",
      marginLeft: "1rem",
    },
    replyWrapper: {
      position: "relative",
    },
    replyLine: {
      position: "absolute",
      top: "-1rem",
      left: "0.75rem",
      // boxShadow: `0 -0.2rem 0.1rem 0.2rem ${lighten(theme.palette.secondary.light, 0.25)}`,
      backgroundColor: lighten(theme.palette.secondary.light, 0.1),
      width: "0.5rem",
      height: "calc(100% + 2rem)",
      zIndex: -1,
    },
  });

export default styles;
