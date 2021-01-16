import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "inline-block",
      height: "100%",
    },
    wrapper: {
      padding: spacingRem(theme, 3),
      paddingLeft: spacingRem(theme, 1.5),
    },
  });

export default styles;
