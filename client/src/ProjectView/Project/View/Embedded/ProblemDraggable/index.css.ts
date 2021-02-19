import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginBottom: "1rem",
      display: "flex",
    },
    dragIcon: {
      userSelect: "none",
      padding: `${spacingRem(theme, 1)} 0`,
      "& path": {
        stroke: "rgba(0, 0, 0, 0.2)",
      },
    },
    lockIcon: {
      userSelect: "none",
      padding: `${spacingRem(theme, 1.6)} ${spacingRem(
        theme,
        0.2
      )} ${spacingRem(theme, 1.6)} ${spacingRem(theme, 0.8)}`,
    },
    body: {
      flexGrow: 1,
      display: "flex",
      padding: spacingRem(theme, 1),
    },
    index: {
      fontSize: spacingRem(theme, 2.1),
      minWidth: spacingRem(theme, 8),
    },
    title: {
      fontSize: spacingRem(theme, 2.2),
    },
    filler: {
      flexGrow: 1,
    },
    right: {
      display: "flex",
      flexDirection: "column",
    },
    rightCategory: {
      padding: `0 ${spacingRem(theme, 1)}`,
      display: "flex",
      minWidth: spacingRem(theme, 18),
    },
    rightDifficulty: {
      display: "flex",
      minWidth: spacingRem(theme, 8),
    },
  });

export default styles;
