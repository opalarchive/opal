/**
 * Basically ``make stuff pretty'' for the user.
 */

import { Color, DifficultyColors } from "./types";

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
  "Dec",
];

let daysOfTheWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const preciseTime = (time: Date): string => {
  const hours = time.getHours();
  const minutes = time.getMinutes();

  if (minutes === 0) {
    if (hours % 12 === 0) {
      return `12:00 ${hours === 0 ? "AM" : "PM"}`;
    }
    return `${hours % 12}:00${hours < 12 ? "AM" : "PM"}`;
  }
  if (hours % 12 === 0) {
    return `12:${minutes < 10 ? "0" : ""}${minutes} ${
      hours < 12 ? "AM" : "PM"
    }`;
  }
  return `${hours % 12}:${minutes < 10 ? "0" : ""}${minutes} ${
    hours < 12 ? "AM" : "PM"
  }`;
};

/**
 * Return a human readable string for the amount of time elapsed since time.
 * Intended to mimic AoPS style.
 */
export const timeElapsed = (time: number) => {
  const now = new Date();
  const then = new Date(time);
  // the beginning of today
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const nowTime = now.getTime(),
    todayTime = today.getTime();
  // if it is before the day before yesterday
  if (time < todayTime - 2 * 24 * 60 * 60 * 1000) {
    return `${
      months[then.getMonth()]
    } ${then.getDate()}, ${then.getFullYear()}, ${preciseTime(then)}`;
  }
  // if it is the day before yesterday
  if (time < todayTime - 24 * 60 * 60 * 1000) {
    return `${daysOfTheWeek[then.getDay()]}, ${preciseTime(then)}`;
  }
  // if it is yesterday
  if (time < todayTime) {
    return `yesterday at ${preciseTime(then)}`;
  }
  // if it is today and more than 6 hours ago
  if (time < nowTime - 6 * 60 * 60 * 1000) {
    return `today at ${preciseTime(then)}`;
  }
  // if it is between 6 and 59.5 minutes ago (to avoid 59.7 minutes ago rounding to 60 minutes for example)
  if (time <= nowTime - 59.5 * 60 * 1000) {
    const hoursAgo = Math.round((nowTime - time) / 60 / 60 / 1000);
    return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
  }
  // if it is between 59.5 minutes and 0.5 minutes ago
  if (time <= nowTime - 0.5 * 60 * 1000) {
    const minutesAgo = Math.round((nowTime - time) / 60 / 1000);
    return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
  }
  if (time <= nowTime) {
    return `a few seconds ago`;
  }
  return `in the future`;
};

export const lerp = (
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  x: number
) => {
  return ((y2 - y1) / (x2 - x1)) * (x - x1) + y1;
};

// returns first element in sorted array arr that is at least x
export function lowerBound<T>(arr: T[], x: T): number {
  let lo = 0,
    hi = arr.length - 1;

  while (hi > lo) {
    let mid = Math.floor((hi + lo) / 2);

    if (arr[mid] < x) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

// pointwise (r, g, or b) linearlly interpolate the difficulty color using ``keyframe'' variable difficultyColors
export function getDifficultyColor(
  difficultyColors: DifficultyColors,
  difficulty: number
) {
  const keys = Object.keys(difficultyColors).map((key) => parseInt(key));

  let top = lowerBound(keys, difficulty);
  const difficultyColor = difficultyColors[keys[top]];

  if (top === 0) {
    return difficultyColor;
  }
  return Object.fromEntries(
    Object.entries(difficultyColor).map(([primaryColor, value]) => [
      primaryColor,
      lerp(
        keys[top - 1],
        keys[top],
        difficultyColors[keys[top - 1]][primaryColor as keyof Color],
        difficultyColors[keys[top]][primaryColor as keyof Color],
        difficulty
      ),
    ])
  ) as unknown as Color;
}

// tuples seem to be broken at the moment
export const ColorToString = (color: Color) => {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
};
