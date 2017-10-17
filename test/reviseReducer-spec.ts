import {assert} from 'chai';
import {Action, applyMiddleware, createStore, Reducer, Store} from 'redux';
import {sandbox, SinonSandbox, SinonSpy} from 'sinon';

import {reviseReducer} from '../src/reviseReducer';

const DEFAULT_STATE = {
  foo: [1, 2, 3, 4, 5],
  bar: {1: 'a'},
};

type StoreState = typeof DEFAULT_STATE;

const testReducer: Reducer<StoreState> =
    (state = DEFAULT_STATE, action: Action): StoreState => {
      switch (action.type) {
        case 'NO-OP':
          return {
            ...state,
            foo: [1, 2, 3, 4, 5],
          };
        case 'OP':
          return {
            ...state,
            foo: [3, 2, 1, 0],
          };
        default:
          return state;
      }
    };

describe('middleware', () => {
  let store: Store<StoreState>;

  beforeEach(() => {
    store = createStore(reviseReducer(testReducer));
  });

  describe('when reducer returns the same state', () => {
    let state: StoreState;

    beforeEach(() => {
      state = store.getState();
      store.dispatch({type: 'NO-OP'});
    });

    it('should not return new state', () => {
      assert.strictEqual(store.getState(), state, 'should return same object');
    });
  });

  describe('when reducer returns new state', () => {
    let state: StoreState;

    beforeEach(() => {
      state = store.getState();
      store.dispatch({type: 'OP'});
    });

    it('should return new state', () => {
      assert.notStrictEqual(
          store.getState(), state, 'should return new objects');
    });

    it('should not clone unchanged paths', () => {
      assert.strictEqual(
          store.getState().bar, state.bar, 'should return same object');
    });
  });
});
