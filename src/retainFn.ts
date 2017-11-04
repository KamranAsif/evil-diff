import {shallowArrayEqual} from './shallowArrayEqual';

export type callback<K, A, M> = (this: K, ...args: A[]) => M;

export const retainFn =
    <K, A, M>(fn: callback<K, A, M>): ((...args: A[]) => M) => {
      let lastArgs: A[];
      let output: M;

      // TODO(asif): Use WeakMap to allow obj dealloc.
      return function(this: K, ...newArgs: A[]): M {
        // TODO(#27): reviseFn instead of shallowArrayEqual.
        const unchanged = shallowArrayEqual(lastArgs, newArgs);

        if (!unchanged) {
          output = fn.apply(this, newArgs) as M;
          lastArgs = newArgs;
        }

        return output;
      };
    };
