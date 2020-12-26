import { createStyles } from "@material-ui/core";

const styles = createStyles({
  root: {
    width: "100%",
    height: "100%",
  },
  inner: {
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "& .ScrollbarsCustom-TrackY": {
      top: "0 !important",
      height: "100% !important",
    },
  },
});

export default styles;
