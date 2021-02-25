import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "inline-block",
      height: `calc(100% - ${spacingRem(theme, 2.8)})`,
      paddingTop: spacingRem(theme, 2.8),
    },
    wrapper: {
      paddingTop: spacingRem(theme, 0.2),
      paddingLeft: spacingRem(theme, 3),
      paddingRight: spacingRem(theme, 1.5),
    },
    paper: {
      marginBottom: spacingRem(theme, 3),
      paddingBottom: spacingRem(theme, 1.5),
    },
    title: {
      fontSize: spacingRem(theme, 2.5),
      padding: `${spacingRem(theme, 2)} ${spacingRem(theme, 2)} 0 ${spacingRem(
        theme,
        2
      )}`,
    },
    divider: { marginTop: `${spacingRem(theme, 1)}` },
  });

export default styles;
