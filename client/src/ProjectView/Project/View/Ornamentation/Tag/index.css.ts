import { createStyles, Theme } from "@material-ui/core";
import { transform } from "typescript";

const styles = (theme: Theme) =>
  createStyles({
    tag: {
      display: "inline-block",
      marginRight: "0.25rem",
      backgroundColor: "#eaecec",
      margin: "0.25rem 0 0.25rem 0",
    },
    tagBody: {
      padding: "0.1rem 0.4rem 0.1rem 0.2rem",
      borderBottomRightRadius: "1rem",
      borderTopRightRadius: "1rem",
    },
    tagText: {
      marginRight: "0.25rem",
    },
    addTag: {
      padding: "0.1rem 0.1rem 0.1rem 0.1rem",
      position: "relative",
      borderRadius: "1rem",
      "&hover": { backgroundColor: theme.palette.secondary.light },
    },
    pointer: {
      cursor: "pointer",
    },
    icon: {
      transform: "translateY(10%)",
    },
  });
export default styles;
