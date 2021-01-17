import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "inline-block",
      height: `calc(100% - ${spacingRem(theme, 2.8)})`,
      paddingTop: spacingRem(theme, 2.8),
    },
    wrapper: {
      paddingTop: spacingRem(theme, 0.2),
      paddingLeft: spacingRem(theme, 1.5),
      paddingRight: spacingRem(theme, 3),
    },
  });

export default styles;
