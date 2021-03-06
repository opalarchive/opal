import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: spacingRem(theme, 3),
      paddingLeft: spacingRem(theme, 1.5),
    },
  });

export default styles;
