import {shallowArrayEqual} from './shallowArrayEqual';

export type callback<K, A, M> = (this: K, ...args: A[]) => M;

export const retainFn =
  <K, A, M>(fn: callback<K, A, M>): ((...args: A[]) => M) => {
    let lastArgs: A[];
    let output: M;

    // TODO(asif): Use WeakMap to allow obj dealloc.
    return function (...newArgs: A[]): M {
      const unchanged = shallowArrayEqual(lastArgs, newArgs);

      if (!unchanged) {
        output = fn.apply(this as K, newArgs) as M;
        lastArgs = newArgs;
      }

      return output;
    };
  };
