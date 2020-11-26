export const camelToTitle = (string) => {
  let result = string.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

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
