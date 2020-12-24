import React from "react";
import { lighten, darken, createStyles, Theme } from "@material-ui/core";
import { formatTime } from "../../../Constants";
import { Client } from "../../../../../.shared";
import { ProjectDataPoint } from "../../../Constants/types";

export const getDataPoint = (
  proj: Client.ProjectPublic,
  dataPoint: ProjectDataPoint,
  username: string
) => {
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
      return Object.entries(proj.editors)
        .map(([username, info]) => [username, info.lastEdit])
        .reduce(([lastUsername, totalLastEdit], [username, lastEdit]) => {
          if (lastEdit > totalLastEdit) return [username, lastEdit];
          return [lastUsername, totalLastEdit];
        })[0];
    case "shareDate":
      return proj.shareDate;
    case "lastModifiedByMe":
      return proj.editors[username].lastEdit;
    default:
      return "";
  }
};

export const dataPointDisplay = (
  proj: Client.ProjectPublic,
  dataPoint: ProjectDataPoint,
  username: string,
  styles: { normal: string; thin: string }
) => {
  const filterMe = (name: string | number) => {
    return name === username ? (
      <span className={styles.normal}>me</span>
    ) : (
      <span className={styles.thin}>{name}</span>
    );
  };

  let data = getDataPoint(proj, dataPoint, username);
  switch (dataPoint) {
    case "name":
      return <span className={styles.normal}>{data}</span>;
    case "owner":
      return filterMe(data);
    case "lastModified":
      return (
        <>
          <span className={styles.thin}>{formatTime(data as number)}</span>
          &nbsp;
          {filterMe(getDataPoint(proj, "lastModifier", username))}
        </>
      );
    case "shareDate":
      return <span className={styles.thin}>{formatTime(data as number)}</span>;
    case "lastModifiedByMe":
      return <span className={styles.thin}>{formatTime(data as number)}</span>;
    default:
      return null;
  }
};

export const toolbarStyles = (theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === "light"
        ? {
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: "1 1 100%",
    },
  });

export const rowStyles = (theme: Theme) =>
  createStyles({
    link: {
      color: "black",
      textDecoration: "none",
      "&:hover": {
        color: darken(theme.palette.secondary.dark, 0.1),
      },
    },
    icon: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    thin: {
      color: "rgba(0, 0, 0, 0.64)",
    },
    normal: {
      color: "rgba(0, 0, 0, 0.88)",
      fontWeight: 500,
    },
  });

export const IfDisplay = React.forwardRef<
  HTMLDivElement,
  { condition: boolean; children: React.ReactNode }
>(({ condition, children }, ref) => {
  if (condition) {
    return <div ref={ref}>{children}</div>;
  } else {
    return <div ref={ref} />;
  }
});
