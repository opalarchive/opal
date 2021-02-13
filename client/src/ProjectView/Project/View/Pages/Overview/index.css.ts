import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: `${spacingRem(theme, 3)} ${spacingRem(theme, 3)} 
                ${spacingRem(theme, 1)} ${spacingRem(theme, 1.5)}`,
    },
    navbarContainer: {
      position: "relative",
      margin: "0 auto",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    logo: {
      marginRight: theme.spacing(2),
      "& img": {
        height: theme.spacing(8),
        padding: theme.spacing(1),
      },
    },
    filler: {
      flexGrow: 1,
    },
    headerWrapper: {
      background: "#05386b",
    },
  });

export default styles;
