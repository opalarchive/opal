import { Theme, withStyles, WithStyles, withTheme } from "@material-ui/core";
import React from "react";
import { compose } from "recompose";

import styles from "./index.css";

interface SpinningProps extends WithStyles<typeof styles> {
  background: string;
  inner: string;
  center: string;
  outer: string;
  hideText?: boolean;
}

class SpinningBase extends React.Component<SpinningProps> {
  render() {
    const { background, inner, center, outer, hideText, classes } = this.props;

    const prefix = "3px solid ";
    const overrideColor = {
      borderLeft: prefix + background,
      borderRight: prefix + background,
    };
    return (
      <div
        style={{
          position: "relative",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ position: "relative", height: "8rem" }}>
          <div
            className={`${classes.ring} ${classes.inner}`}
            style={{ ...overrideColor, borderTop: prefix + inner }}
          ></div>
          <div
            className={`${classes.ring} ${classes.center}`}
            style={{ ...overrideColor, borderTop: prefix + center }}
          ></div>
          <div
            className={`${classes.ring} ${classes.outer}`}
            style={{ ...overrideColor, borderTop: prefix + outer }}
          ></div>
        </div>
        {!!hideText ? (
          ""
        ) : (
          <div className={`${classes.text}`} style={{ marginTop: "1rem" }}>
            Loading...
          </div>
        )}
      </div>
    );
  }
}

const Spinning = withStyles(styles)(SpinningBase);

interface LoadingProps {
  background: string;
  hideText?: boolean;
  theme: Theme;
}

const Loading: React.FC<LoadingProps> = ({ background, hideText, theme }) => {
  return (
    <Spinning
      background={background}
      inner={theme.palette.primary.light}
      center={theme.palette.primary.dark}
      outer={theme.palette.secondary.dark}
      hideText={hideText}
    />
  );
};

export default withTheme(Loading);
