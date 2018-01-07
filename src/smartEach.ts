// newValue: T, oldValue: undefined = new index.
// newValue: undefined, oldValue: T = deleted index.
// newValue: T, oldValue: T = changed index.
type Callback<T> =
    (newValue: T|undefined, oldValue: T|undefined, index: number) => void;

type ComposedEach<T> = (newState: T[]) => void;
export const smartEach =
    <T>(callback: Callback<T>, initialState: T[] = []): ComposedEach<T> => {

      let lastState = initialState;

      return (newState: T[]) => {
        for (let i = 0; i < Math.max(newState.length, lastState.length); i++) {
          const oldT = lastState[i];
          const newT = newState[i];
          if (oldT !== newT) {
            callback(newT, oldT, i);
          }
        }

        lastState = newState;
      };
    };
