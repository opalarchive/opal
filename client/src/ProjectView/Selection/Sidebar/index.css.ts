import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "inline-block",
      position: "absolute",
      height: "100%",
    },
    buttonWrapper: {
      paddingBottom: spacingRem(theme, 2),
    },
    button: {
      width: "100%",
      textAlign: "center",
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
