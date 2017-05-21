import { toArray } from "lodash";
import shallowArrayEqual from "./shallowArrayEqual";

const retain = <T>(fn: () => T): (() => T) => {
  let lastArgs: any[];
  let output: T;

  // TODO (asif) Use WeakMap to allow obj dealloc
  return function(): T {
    const newArgs = toArray(arguments);
    const unchanged = shallowArrayEqual(lastArgs, newArgs);

    if (!unchanged) {
      output = fn.apply(this, newArgs);
      lastArgs = toArray(newArgs);
    }

    return output;
  };
};

export default retain;
