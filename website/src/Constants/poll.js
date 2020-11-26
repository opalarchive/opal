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