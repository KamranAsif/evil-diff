import {reviseFn} from './reviseFn';

// newValue: T, oldValue: undefined = new index
// newValue: T, oldValue: T = changed index
type Mapper<T, S> =
    (newValue: T|undefined, oldValue: T|undefined, index: number) => S;

type ComposedMap<T, S> = (newState: T[]) => S[];
export const smartMap =
    <T, S>(mapper: Mapper<T, S>, initialState: T[] = []): ComposedMap<T, S> => {

      let lastState = initialState;
      // Wrap in reviseFn for more immutability.
      return reviseFn((newState: T[]) => {
        const mappedState = new Array(lastState.length);
        for (let i = 0; i < newState.length; i++) {
          const oldT = lastState[i];
          const newT = newState[i];
          mappedState[i] = oldT === newT ? oldT : mapper(newT, oldT, i);
        }

        lastState = newState;
        return mappedState;
      }, initialState);
    };
