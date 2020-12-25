import { ProjectView, ProjectViewType } from "./types";

export const camelToTitle = (input: string): string => {
  let result = input.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const preciseTime = (hours: number, minutes: number): string => {
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

export const formatTime = (time: number): string => {
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

  let date = new Date(time);
  let now = new Date();

  // if its the same day
  if (
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()
  ) {
    return preciseTime(date.getHours(), date.getMinutes());
  }
  // ???
  if (now.getTime() < date.getTime()) {
    return "Hello time traveler! ^-^";
  }
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const poll = async (
  func: () => any,
  validate: (o?: any) => boolean = (o: any) => !!o,
  interval: number,
  maxAttempts?: number
) => {
  // console.log('Start poll...');
  let attempts = 0;

  const executePoll = async (): Promise<any> => {
    // console.log(`poll step ${attempts}`);
    const result = await func();
    attempts++;

    if (validate(result)) {
      return result;
    } else if (maxAttempts && attempts === maxAttempts) {
      return new Error("Exceeded max attempts");
    } else {
      setTimeout(executePoll, interval);
    }
  };

  await executePoll();
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

// rly js?
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

// tuples seem to be broken rn
export const tupleToRGBString = (arr: number[]) => {
  return `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`;
};

/*
 * + denotes union
 * starred is a subset of my projects + shared
 *
 * priority = my projects + starred, sort by name
 * my projects = my projects, sort by name
 * shared = shared, sort by share date
 * recent = my projects + shared, sort by last modified date (perhaps only by me)
 * trash = my projects trash, sort by trash date (same as last modified date)
 */

export const projectViewTypes = {
  priority: {
    filter: {
      includeMine: true,
      includeShared: false,
      includeAllStarred: true,
      includeTrash: false,
    },
    data: ["name", "owner", "lastModified"],
    fixed: false,
    defaultSort: {
      dataPoint: "name",
      direction: "asc",
    },
  },
  myProjects: {
    filter: {
      includeMine: true,
      includeShared: false,
      includeAllStarred: false,
      includeTrash: false,
    },
    data: ["name", "owner", "lastModified"],
    fixed: false,
    defaultSort: {
      dataPoint: "name",
      direction: "asc",
    },
  },
  sharedWithMe: {
    filter: {
      includeMine: false,
      includeShared: true,
      includeAllStarred: false,
      includeTrash: false,
    },
    data: ["name", "owner", "shareDate"], // owner = shared by in this case (unless we allow collaborator sharing?)
    fixed: false, // owner is still better I think
    defaultSort: {
      dataPoint: "shareDate",
      direction: "desc",
    },
  },
  recent: {
    filter: {
      includeMine: true,
      includeShared: true,
      includeAllStarred: false,
      includeTrash: false,
    },
    data: ["name", "owner", "lastModifiedByMe"],
    fixed: true,
    defaultSort: {
      dataPoint: "lastModifiedByMe",
      direction: "desc",
    },
  },
  trash: {
    filter: {
      includeMine: false,
      includeShared: false,
      includeAllStarred: false,
      includeTrash: true, // trash is only trash by me (i.e. only owner can trash)
    },
    data: ["name", "owner", "lastModified"], // last modified = trash date for obvious reasons
    fixed: false, // (disable editing when trashed)
    defaultSort: {
      dataPoint: "lastModified",
      direction: "desc",
    },
  },
} as {
  [type in ProjectViewType]: ProjectView;
};
