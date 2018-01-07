import {assert} from 'chai';
import {Action, applyMiddleware, createStore, Reducer, Store} from 'redux';
import {spy} from 'sinon';

import {smartEach} from '../src/smartEach';

describe('smartEach', () => {
  it('should call only on new values', () => {
    const newValues = [1, 2];
    const callbackSpy = spy();
    const smartValuesEach = smartEach(callbackSpy);
    smartValuesEach(newValues);

    assert.deepEqual(callbackSpy.args, [[1, undefined, 0], [2, undefined, 1]]);
  });

  it('uses shallow equals', () => {
    const initialValues = [{foo: 'bar'}, {foo: 'baz'}];
    const newValues = [initialValues[0], {foo: 'baz'}];
    const callbackSpy = spy();
    const smartValuesEach = smartEach(callbackSpy, initialValues);
    smartValuesEach(newValues);

    assert.deepEqual(callbackSpy.args, [[{foo: 'baz'}, {foo: 'baz'}, 1]]);
  });

  it('should call only on deleted values', () => {
    const initialValues = [1, 2];
    const newValues: number[] = [];
    const callbackSpy = spy();
    const smartValuesEach = smartEach(callbackSpy, initialValues);
    smartValuesEach(newValues);

    assert.deepEqual(callbackSpy.args, [[undefined, 1, 0], [undefined, 2, 1]]);
  });

  it('should call only on changed values', () => {
    const initialValues = [1, 2, 3, 4, 5];
    const newValues = [1, 2, 3, 5, 6];
    const callbackSpy = spy();
    const smartValuesEach = smartEach(callbackSpy, initialValues);
    smartValuesEach(newValues);

    assert.deepEqual(callbackSpy.args, [[5, 4, 3], [6, 5, 4]]);
  });

  it('should not call on unchanged values', () => {
    const initialValues = [1, 2, 3, 4, 5];
    const newValues = [1, 2, 3, 4, 5];
    const callbackSpy = spy();
    const smartValuesEach = smartEach(callbackSpy, initialValues);
    smartValuesEach(newValues);

    assert.deepEqual(callbackSpy.args, []);
  });

  it('should only refrence last value', () => {
    const newValues1 = [1, 2, 3, 4, 5];
    const newValues2 = [1, 2, 3, 5, 6];
    const callbackSpy = spy();
    const smartValuesEach = smartEach(callbackSpy);
    smartValuesEach(newValues1);
    callbackSpy.reset();

    smartValuesEach(newValues2);
    assert.deepEqual(callbackSpy.args, [[5, 4, 3], [6, 5, 4]]);
  });
});
