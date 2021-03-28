import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginBottom: "1rem",
      display: "flex",
    },
    body: {
      padding: spacingRem(theme, 1),
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
    },
  });

export default styles;
