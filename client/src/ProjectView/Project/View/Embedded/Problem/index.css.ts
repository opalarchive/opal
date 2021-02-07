import { createStyles, darken, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginBottom: "1rem",
      display: "flex",
    },
    icon: {
      display: "inline-block",
      flexShrink: 0,
      position: "relative",
      top: "0.28rem",
      fontSize: "1.2rem",
      height: "1.2rem",
      width: "1.2rem",
      marginRight: "0.5rem",
    },
    left: {
      display: "flex",
      flexDirection: "column",
      fontSize: "1.1rem",
      minWidth: "4rem",
    },
    leftIndex: {
      padding: "1rem 0 0.5rem 0",
      textAlign: "center",
    },
    leftVote: {
      padding: "0.5rem",
      textAlign: "center",
    },
    leftVoteNumber: {
      position: "relative",
      fontWeight: 600,
      top: "-0.15rem",
    },
    leftVoteArrow: {
      color: "black",
      "&:hover": {
        color: "rgb(0, 0, 0, 0.4)",
      },
    },
    leftVoteArrowActivated: {
      color: theme.palette.primary.light,
      "&:hover": {
        color: darken(theme.palette.primary.light, 0.2),
      },
    },
    body: {
      padding: "0.25rem 0 0.25rem 0",
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
    },
    bodyTitle: {
      padding: "0.5rem 0.5rem 0.1rem 0.5rem",
      fontSize: "1.25rem",
    },
    bodyAuthor: {
      padding: "0.1rem 0.5rem 0.5rem 0.5rem",
      fontSize: "0.9rem",
    },
    bodyText: {
      padding: "0.5rem",
    },
    bodyFiller: {
      flexGrow: 1,
    },
    bodyTags: {
      padding: "0.5rem",
    },
    bodyReply: {
      padding: "0.5rem 0.5rem 0.5rem 0.5rem",
      display: "flex",
    },
    link: {
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
    right: {
      padding: "0.25rem 0.5rem 0.25rem 0",
      display: "flex",
      flexDirection: "column",
      fontSize: "1.2rem",
      width: "11rem",
      flexShrink: 0,
    },
    rightCategory: {
      padding: "0.5rem 0.5rem 0 0.5rem",
      display: "flex",
    },
    rightDifficulty: {
      padding: "0.5rem",
      display: "flex",
    },
    rightFiller: {
      flexGrow: 1,
    },
    rightComments: {
      padding: "0 0.5rem 0.5rem 0.5rem",
      display: "flex",
    },
    rightSolutions: {
      padding: "0 0.5rem 0.5rem 0.5rem",
      display: "flex",
    },
  });

export default styles;
