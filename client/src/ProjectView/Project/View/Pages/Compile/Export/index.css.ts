import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginBottom: "1rem",
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
    templateBox: {
      // match mui styles
      padding: "10px 12px 11px 12px",
      whiteSpace: "pre-wrap",
      color: "rgba(0, 0, 0, 0.87)",
      backgroundColor: "rgba(0, 0, 0, 0.09)",
    },
    templateEdit: {
      "& > div": {
        padding: "0 12px !important",
      },
    },
    filler: {
      marginTop: spacingRem(theme, 2),
    },
  });

export default styles;
