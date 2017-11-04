import {revise} from './revise';

export type callback<K, A, M> = (this: K, ...args: A[]) => M;

export const reviseFn =
    <K, A, M>(fn: callback<K, A, M>, initial?: M): ((...args: A[]) => M) => {
      let source: M|undefined = initial;

      return function(this: K, ...args: A[]) {
        const revision = fn.apply(this, args) as M;
        source = revise(source, revision) as M;
        return source;
      };
    };
