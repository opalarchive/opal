import React from 'react';
import { makeStyles, lighten, darken } from "@material-ui/core";

export const camelToTitle = (string) => {
  let result = string.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const preciseTime = (hours, minutes) => {
  if (minutes === 0) {
    if (hours % 12 === 0) {
      return "12:00 " + (hours === 0 ? "AM" : "PM");
    }
    return (hours % 12) + ":00" + (hours < 12 ? "AM" : "PM");
  }
  if (hours % 12 === 0) {
    return (
      "12:" +
      (minutes < 10 ? "0" : "") +
      minutes +
      " " +
      (hours < 12 ? "AM" : "PM")
    );
  }
  return (
    (hours % 12) +
    ":" +
    (minutes < 10 ? "0" : "") +
    minutes +
    " " +
    (hours < 12 ? "AM" : "PM")
  );
};

export const formatTime = (time) => {
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  let date = new Date(time);
  let now = new Date();

  // if its the same day
  if (now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate()) {
    return preciseTime(date.getHours(), date.getMinutes());
  }
  // ???
  if (now.getTime() < date.getTime()) {
    return "Hello time traveler! ^-^";
  }
  return (months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear());
};

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
