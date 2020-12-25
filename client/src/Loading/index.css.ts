/*
Loading circle styling
*/

import { createStyles } from "@material-ui/core";

const styles = createStyles({
  ring: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",

    transformOrigin: "center",
    animationName: "$rotate",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
  },
  inner: {
    width: "calc(8rem - 20px)",
    height: "calc(8rem - 20px)",
    animationDuration: "0.75s",
  },
  center: {
    width: "calc(8rem - 10px)",
    height: "calc(8rem - 10px)",
    animationDuration: "1s",
  },
  outer: {
    width: "8rem",
    height: "8rem",
    animationDuration: "1.5s",
  },
  "@keyframes rotate": {
    "0%": {
      transform: "translate(-50%, -50%) rotate(0deg)",
    },
    "100%": {
      transform: "translate(-50%, -50%) rotate(360deg)",
    },
  },
  text: {
    textAlign: "center",
  },
});

export default styles;
