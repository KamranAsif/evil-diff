import {AnyAction, Reducer} from 'redux';

import {revise} from './revise';

/**
 * EvilDiff.revise wrapper for redux.
 * 
 * Usage:
 *   createStore(reviseReducer(rootReducer));
 */
export const reviseReducer = <S>(reducer: Reducer<S>) => {
  return (state: S, action: AnyAction): S => {
    return revise(state, reducer(state, action));
  };
};
