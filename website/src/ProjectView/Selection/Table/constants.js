import React from 'react';
import { makeStyles, lighten, darken } from "@material-ui/core";

export const camelToTitle = (string) => {
  let result = string.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
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

  if (now.getTime() > date.getTime() + 86400000) {
    return (
      months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
    );
  }
  if (now.getTime() < date.getTime()) {
    return "Hello time traveler! ^-^";
  }

  let hours = date.getHours();
  let minutes = date.getMinutes();

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

export const getDataPoint = (proj, dataPoint, username) => {
  switch (dataPoint) {
    case "name":
      return proj.name;
    case "owner":
      return proj.owner === username ? 'me' : proj.owner;
    case "lastModified":
      return Math.max(
        ...Object.values(proj.editors).map((info) => info.lastEdit)
      );
    case "shareDate":
      return proj.editors[username].shareDate;
    case "lastModifiedByMe":
      return proj.editors[username].lastEdit;
    default:
      return null;
  }
};

export const formatData = (data) => {
  if (typeof data === "number") {
    return formatTime(data);
  }
  return data;
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
  }
});

export const IfDisplay = props => {
  if (props.condition) {
    return (
      <>
        {props.children}
      </>
    );
  }
  else {
    return (
      <>
      </>
    );
  }
};
