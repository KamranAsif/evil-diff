const shallowClone = <T extends object>(source: T): T => {
  const base = Array.isArray(source) ? [] : {};
  // TODO(asif): Remove this hack when TS/pull/13288 is merged in
  const sourceObj = source as any as object;
  const cloneObj = { ...base, ...sourceObj };
  return cloneObj as T;
};

export default shallowClone;
