import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "inline-block",
      height: `calc(100% - ${spacingRem(theme, 2.8)})`,
      paddingTop: `calc(${spacingRem(theme, 2.8)} - 8px)`, // cancel out with default mui padding
    },
    wrapper: {
      paddingTop: spacingRem(theme, 0.2),
      paddingLeft: spacingRem(theme, 3),
      paddingRight: spacingRem(theme, 1.5),
    },
    item: {
      display: "block",
      padding: `${spacingRem(theme, 1)} ${spacingRem(theme, 2)}`,
    },
    itemIcon: {
      minWidth: 0,
    },
    itemText: {
      display: "inline-block",
      margin: `0 0 0 ${spacingRem(theme, 2)}`,
      fontSize: "100px !important",
    },
  });

export default styles;
