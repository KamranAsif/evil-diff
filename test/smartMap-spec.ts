import {assert} from 'chai';
import {Action, applyMiddleware, createStore, Reducer, Store} from 'redux';
import {stub} from 'sinon';

import {smartMap} from '../src/smartMap';

describe('smartMap', () => {
  it('should call only on new values', () => {
    const newValues = [1, 2];
    const mapperStub = stub();
    mapperStub.onCall(0).returns(2);
    mapperStub.onCall(1).returns(3);

    const smartValuesMap = smartMap(mapperStub);
    const mappedValues = smartValuesMap(newValues);

    assert.deepEqual(mapperStub.args, [[1, undefined, 0], [2, undefined, 1]]);
    assert.deepEqual(mappedValues, [2, 3]);
  });

  it('uses shallow equals', () => {
    const initialValues = [{foo: 'bar'}, {foo: 'baz'}];
    const newValues = [initialValues[0], {foo: 'baz'}];
    const mapperStub = stub();
    mapperStub.onCall(0).returns(2);

    const smartValuesMap = smartMap(mapperStub, initialValues);
    const mappedValues = smartValuesMap(newValues);

    assert.deepEqual(mapperStub.args, [[{foo: 'baz'}, {foo: 'baz'}, 1]]);
    assert.deepEqual(mappedValues, [initialValues[0], 2]);
  });

  it('should call only on deleted values', () => {
    const initialValues = [1, 2];
    const newValues: number[] = [];
    const mapperStub = stub();
    const smartValuesMap = smartMap(mapperStub, initialValues);
    const mappedValues = smartValuesMap(newValues);

    assert(mapperStub.notCalled);
    assert.deepEqual(mappedValues, []);
  });


  it('should call only on changed values', () => {
    const initialValues = [1, 2, 3, 4, 5];
    const newValues = [1, 2, 3, 5, 6];
    const mapperStub = stub();
    mapperStub.onCall(0).returns(8);
    mapperStub.onCall(1).returns(9);

    const smartValuesMap = smartMap(mapperStub, initialValues);
    const mappedValues = smartValuesMap(newValues);

    assert.deepEqual(mapperStub.args, [[5, 4, 3], [6, 5, 4]]);
    assert.deepEqual(mappedValues, [1, 2, 3, 8, 9]);
  });

  it('should not call on unchanged values', () => {
    const initialValues = [1, 2, 3, 4, 5];
    const newValues = [1, 2, 3, 4, 5];
    const mapperStub = stub();
    const smartValuesMap = smartMap(mapperStub, initialValues);
    const mappedValues = smartValuesMap(newValues);

    assert(mapperStub.notCalled);
    assert.equal(mappedValues, initialValues);
  });

  it('should only refrence last value', () => {
    const newValues1 = [1, 2, 3, 4, 5];
    const newValues2 = [1, 2, 3, 5, 6];
    const mapperStub = stub();
    const smartValuesMap = smartMap(mapperStub);
    const mappedValues = smartValuesMap(newValues1);
    mapperStub.reset();

    const mappedValues2 = smartValuesMap(newValues2);
    assert.deepEqual(mapperStub.args, [[5, 4, 3], [6, 5, 4]]);
  });
});
