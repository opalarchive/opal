import { createStyles, darken, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
    },
    iconPaper: {
      padding: "0.5rem",
      top: 0,
      width: "2.1rem",
      position: "absolute",
    },
    icon: {
      position: "relative",
      top: "0.2rem",
      height: "1.2rem",
      width: "1.2rem",
    },
    iconBodge: {
      height: "100%",
      width: "1rem",
      position: "absolute",
      top: 0,
      left: "2.5rem",
      backgroundColor: "white",
      zIndex: 2,
    },
    reply: {
      padding: "0.5rem 0.5rem 0.5rem 0.5rem",
      margin: "0 0 1rem 3rem",
      position: "relative",
      zIndex: 1,
    },
    top: {
      display: "flex",
      fontSize: "1.09rem",
    },
    author: {
      marginRight: "0.5rem",
    },
    time: {
      color: "rgba(0, 0, 0, 0.64)",
    },
    filler: {
      flexGrow: 1,
    },
    actions: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    linkIcon: {
      padding: 0,
      display: "inline-block",
    },
    text: {
      paddingTop: "0.5rem",
    },
    // highlightPaper: {
    //   boxShadow: `0 0.3rem 0.3rem 0 ${darken(fade(theme.palette.primary.main, 0.4), 0.2)}, 0 0.3rem 0.2rem 0.1rem ${darken(fade(theme.palette.secondary.main, 0.24), 0.2)}, 0 0.1rem 0.6rem 0.1rem ${darken(fade(theme.palette.secondary.main, 0.28), 0.2)}`
    // },
    reveal: {
      color: darken(theme.palette.secondary.main, 0.25),
      cursor: "pointer",
      "&:hover": {
        color: darken(theme.palette.secondary.dark, 0.25),
      },
      "&:focus": {
        color: darken(theme.palette.secondary.dark, 0.25),
        outline: "none",
      },
    },
    input: {
      display: "flex",
    },
    inputRight: {
      padding: "0.5rem",
      display: "flex",
      flexDirection: "column",
    },
    inputRightFiller: {
      flexGrow: 1,
    },
    submitIcon: {
      top: "-0.12rem",
    },
  });

export default styles;
