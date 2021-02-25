import { createStyles, Theme } from "@material-ui/core";
import { spacingRem } from "../../../../../Constants";

const styles = (theme: Theme) =>
  createStyles({
    valueDescriptor: {
      color: "rgba(0, 0, 0, 0.69)",
      paddingRight: spacingRem(theme, 1),
    },
    currentList: {
      backgroundColor: theme.palette.secondary.light,
    },
  });
export default styles;
