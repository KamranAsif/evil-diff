export const shallowClone = <T extends object>(source: T): T => {
  const base = Array.isArray(source) ? [] : {};
  // TODO(asif): Remove this hack when TS/pull/13288 is merged in
  const sourceObj = source as {} as object;
  // Explicitly use Object.assign to avoid array to object conversion.
  // tslint:disable-next-line prefer-object-spread
  const cloneObj = Object.assign(base, sourceObj);
  return cloneObj as T;
};
