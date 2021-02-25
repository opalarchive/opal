import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: spacingRem(theme, 2),
    },
    paper: {
      padding: spacingRem(theme, 2),
    },
    title: {
      fontSize: spacingRem(theme, 2.5),
    },
    subtitle: {
      fontSize: spacingRem(theme, 2.2),
      marginBottom: spacingRem(theme, 1),
    },
    content: {
      marginBottom: spacingRem(theme, 2),
      color: "rgba(0, 0, 0, 0.8)",
    },
    emphasized: {
      color: "black",
      fontStyle: "italic",
    },
    inputWrapper: {
      padding: `0 ${spacingRem(theme, 2)}`,
    },
    error: {
      color: "red",
      marginTop: spacingRem(theme, 2),
    },
  });

export default styles;
