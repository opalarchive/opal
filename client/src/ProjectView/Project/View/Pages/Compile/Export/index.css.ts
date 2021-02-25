import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: spacingRem(theme, 2),
    },
    body: {
      display: "flex",
    },
    title: {
      fontSize: spacingRem(theme, 2.5),
      paddingBottom: spacingRem(theme, 1),
    },
    templateWrapper: {
      marginLeft: spacingRem(theme, 2),
      flexGrow: 1,
    },
    subtitle: {
      fontSize: spacingRem(theme, 2.2),
      marginBottom: spacingRem(theme, 1),
    },
    templateEdit: {
      color: "rgba(0, 0, 0, 0.87)",
      backgroundColor: "rgba(0, 0, 0, 0.09)",
      font: "inherit",
      fontFamily:
        "Menlo, Monaco, Consolas, source code pro, Courier New, monospace",
      "& > div": {
        font: "inherit",
        color: "initial !important",
        padding: "0 12px !important",
        backgroundColor: "rgba(0, 0, 0, 0) !important",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0)",
        },
      },
    },
    filler: {
      marginTop: spacingRem(theme, 2),
    },
    buttonContainer: {
      float: "right",
      padding: `${spacingRem(theme, 2)} 0`,
    },
  });

export default styles;
