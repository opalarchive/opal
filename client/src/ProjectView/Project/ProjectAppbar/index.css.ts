import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: spacingRem(theme, 3),
      paddingRight: spacingRem(theme, 3),
    },
  });

export const tabContainerStyles = (theme: Theme) =>
  createStyles({
    indicator: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "transparent",
      "& > span": {
        width: "30%",
        backgroundColor: theme.palette.secondary.light,
      },
    },
  });

export const tabStyles = (theme: Theme) =>
  createStyles({
    root: {
      textTransform: "none",
      fontSize: "1.1rem",
      font: "inherit",
      minWidth: spacingRem(theme, 12),
      "&:hover": {
        opacity: 0.95,
      },
      "&:focus": {
        opacity: 0.95,
      },
    },
  });

export default styles;
