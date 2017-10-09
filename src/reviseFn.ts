import {revise} from './revise';

export type callback<K, A, M> = (this: K, ...args: A[]) => M;

export const reviseFn =
    <K, A, M>(fn: callback<K, A, M>): ((...args: A[]) => M) => {
      let source: M;

      return function(...args: A[]) {
        const revision = fn.apply(this as K, args) as M;
        source = revise(source, revision);
        return source;
      };
    };
