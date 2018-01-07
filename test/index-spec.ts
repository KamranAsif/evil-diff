import index = require('../src/index');
import {assert} from 'chai';

describe('index', () => {
  it('should provide reviseOperator', () => {
    assert.isDefined(index.reviseOperator);
  });
  it('should provide retainFn', () => {
    assert.isDefined(index.retainFn);
  });
  it('should provide revise', () => {
    assert.isDefined(index.revise);
  });
  it('should provide reviseFn', () => {
    assert.isDefined(index.reviseFn);
  });
  it('should provide reviseReducer', () => {
    assert.isDefined(index.reviseReducer);
  });
  it('should provide smartEach', () => {
    assert.isDefined(index.smartEach);
  });
  it('should provide smartMap', () => {
    assert.isDefined(index.smartMap);
  });
});
