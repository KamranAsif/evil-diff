export const isObject = (obj: {}): obj is object => {
  return typeof obj === 'object';
};
