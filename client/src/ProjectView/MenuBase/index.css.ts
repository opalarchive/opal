import { createStyles } from "@material-ui/core";

const styles = (
  width: number,
  right: boolean,
  background: string,
  totalScroll: boolean
) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      backgroundColor: background,
    },
    inner: {
      ...{
        position: "relative",
        marginLeft: !!right ? 0 : `${width}rem`,
        marginRight: !!right ? `${width}rem` : 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      },
      ...(totalScroll
        ? {
            "& .ScrollbarsCustom-TrackY": {
              top: "0 !important",
              height: "100% !important",
            },
          }
        : {}),
    },
  });

export default styles;
