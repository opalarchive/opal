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

export const poll = async({ func, validate = (o => !!o), interval, maxAttempts = -1}) => {
  // console.log('Start poll...');
  let attempts = 0;

  const executePoll = async (resolve, reject) => {
    // console.log(`poll step ${attempts}`);
    const result = await func();
    attempts++;

    if (validate(result)) {
      return resolve(result);
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error('Exceeded max attempts'));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
}

export const lerp = (x1, x2, y1, y2, x) => {
  return (y2 - y1) / (x2 - x1) * (x - x1) + y1;
}

// rly js?
// returns first element in sorted array arr that is at least x
export const lowerBound = (arr, x) => {
  let lo = 0, hi = arr.length - 1;

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

export const arrToRGBString = (arr) => {
  return `rgb(${arr.join(', ')})`;
}
