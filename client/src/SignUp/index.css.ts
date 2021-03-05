import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../Constants";

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      marginTop: spacingRem(theme, 8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: spacingRem(theme, 1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%",
      marginTop: spacingRem(theme, 1),
    },
    submit: {
      margin: spacingRem(theme, 3, 0, 2),
    },
  });

export default styles;
