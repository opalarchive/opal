export function getMean(arr: number[]) {
  if (arr.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
}

// log n = 1 said the engineer
export function getMedianSlow(arr: number[]) {
  const n = arr.length;
  if (n === 0) return 0;

  const arr2: number[] = [...arr];
  arr2.sort((a, b) => a - b);

  return (arr2[Math.floor((n - 1) / 2)] + arr2[Math.ceil((n - 1) / 2)]) / 2;
}

export function getStDev(arr: number[]) {
  if (arr.length === 0) return 0;

  const mean = getMean(arr);

  return Math.sqrt(
    arr
      .map((val) => (mean - val) * (mean - val))
      .reduce((prev, cur) => prev + cur, 0) / arr.length
  );
}
