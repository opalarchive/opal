import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    tag: {
      marginRight: "0.25rem",
      backgroundColor: "#eaecec",
      padding: "0.1rem 0.4rem 0.1rem 0.2rem",
      borderBottomRightRadius: "1rem",
      borderTopRightRadius: "1rem",
    },
  });
export default styles;
