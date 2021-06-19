function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

/**
 * Returns whether the specified object has those
 * keys, and those keys are mapped to string values.
 */
export const validateString = (obj: object, keys: string[]) => {
  for (let i = 0; i < keys.length; i++) {
    if (!hasOwnProperty(obj, keys[i]) || typeof obj[keys[i]] !== "string") {
      return false;
    }
  }

  return true;
};
