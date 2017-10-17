import index = require('../src/index');
import {assert} from 'chai';

describe('index', () => {
  it('should provide revise', () => {
    assert.isDefined(index.revise);
  });
  it('should provide reviseFn', () => {
    assert.isDefined(index.reviseFn);
  });
  it('should provide retainFn', () => {
    assert.isDefined(index.retainFn);
  });
  it('should provide reviseReducer', () => {
    assert.isDefined(index.reviseReducer);
  });
});
