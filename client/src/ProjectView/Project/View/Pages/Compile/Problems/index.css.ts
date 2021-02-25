import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginBottom: "1rem",
      padding: spacingRem(theme, 2),
    },
    title: {
      fontSize: spacingRem(theme, 2.5),
      paddingBottom: spacingRem(theme, 1),
    },
  });

export default styles;
