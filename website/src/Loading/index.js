import { useTheme } from '@material-ui/core';
import React from 'react';
import styles from './index.module.css';

class SpinningBase extends React.Component {
  render() {
    const background = this.props.background;
    const inner = this.props.inner;
    const center = this.props.center;
    const outer = this.props.outer;

    const prefix = "3px solid ";
    return (
      <div style={{ position: "relative", top: "2rem" }}>
        <div style={{ position: "relative", height: "8rem" }}>
          <div className={styles.inner} style={{ borderLeft: prefix + background, borderTop: prefix + inner, borderRight: prefix + background }}></div>
          <div className={styles.center} style={{ borderLeft: prefix + background, borderTop: prefix + center, borderRight: prefix + background }}></div>
          <div className={styles.outer} style={{ borderLeft: prefix + background, borderTop: prefix + outer, borderRight: prefix + background }}></div>
        </div>
        <div className={`${styles.text}`} style={{ marginTop: "1rem" }}>Loading...</div>
      </div>
    );
  }
}

const Loading = props => {
  const theme = useTheme();
  return <SpinningBase background={props.background} inner={theme.palette.primary.dark} center={theme.palette.primary.light} outer={theme.palette.secondary.light} />
}

export default Loading;