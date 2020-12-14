import React from 'react';
import { makeStyles, lighten, darken } from "@material-ui/core";
import { formatTime } from '../../../Constants';

export const getDataPoint = (proj, dataPoint, username) => {
  switch (dataPoint) {
    case "name":
      return proj.name;
    case "owner":
      return proj.owner;
    case "lastModified":
      return Math.max(
        ...Object.values(proj.editors).map((info) => info.lastEdit)
      );
    case "lastModifier":
      return Object.entries(proj.editors).map(([username, info]) => [username, info.lastEdit]).reduce(
        ([lastUsername, totalLastEdit], [username, lastEdit]) => {
          if (lastEdit > totalLastEdit) return [username, lastEdit];
          return [lastUsername, totalLastEdit];
        }
      )[0];
    case "shareDate":
      return proj.editors[username].shareDate;
    case "lastModifiedByMe":
      console.log(' - ' + proj.editors[username].lastEdit)
      return proj.editors[username].lastEdit;
    default:
      return null;
  }
}

export const dataPointDisplay = (proj, dataPoint, username, styles) => {
  const filterMe = (name) => {
    return name === username ? <span className={styles.normal}>me</span> : <span className={styles.thin}>{name}</span>;
  }

  let data = getDataPoint(proj, dataPoint, username);
  switch (dataPoint) {
    case "name":
      return <span className={styles.normal}>{data}</span>;
    case "owner":
      return filterMe(data);
    case "lastModified":
      return <><span className={styles.thin}>{formatTime(data)}</span>&nbsp;{filterMe(getDataPoint(proj, "lastModifier", username))}</>
    case "shareDate":
      return <span className={styles.thin}>{formatTime(data)}</span>;
    case "lastModifiedByMe":
      return <span className={styles.thin}>{formatTime(data)}</span>;
    default:
      return null;
  }
};

export const toolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
        backgroundColor: lighten(theme.palette.secondary.light, 0.85)
      }
      : {
        backgroundColor: theme.palette.secondary.dark
      },
  title: {
    flex: "1 1 100%"
  }
}));

export const rowStyles = (theme) => ({
  link: {
    color: "black",
    textDecoration: "none",
    "&:hover": {
      color: darken(theme.palette.secondary.dark, 0.1)
    }
  },
  icon: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  thin: {
    color: "rgba(0, 0, 0, 0.64)"
  },
  normal: {
    color: "rgba(0, 0, 0, 0.88)",
    fontWeight: 500
  }
});

export const IfDisplay = React.forwardRef((props, ref) => {
  if (props.condition) {
    return (
      <div ref={ref}>
        {props.children}
      </div>
    );
  }
  else {
    return (
      <div ref={ref} />
    );
  }
});
