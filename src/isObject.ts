// tslint:disable-next-line no-any We allow any object to be checked.
export const isObject = (obj: any): obj is object => {
  return typeof obj === 'object';
};
