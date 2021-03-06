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
    body: {
      fontSize: spacingRem(theme, 2.1),
      display: "flex",
      lineHeight: "180%",
    },
    sideBox: { flexBasis: "0px", flexGrow: 1 },
    thinList: { margin: 0 },
    divider: { margin: `0 ${spacingRem(theme, 2)}` },
  });

export default styles;
