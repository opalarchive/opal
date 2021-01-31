import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: spacingRem(theme, 3),
      paddingBottom: 0,
    },
  });

export const tabContainerStyles = (theme: Theme) =>
  createStyles({
    indicator: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "transparent",
      "& > span": {
        maxWidth: 40,
        width: "100%",
        backgroundColor: "#635ee7",
      },
    },
  });

export const tabStyles = (theme: Theme) =>
  createStyles({
    root: {
      marginRight: theme.spacing(1),
      "&:focus": {
        color: "rgba(0, 0, 0, 0.95)",
      },
    },
  });

export default styles;
