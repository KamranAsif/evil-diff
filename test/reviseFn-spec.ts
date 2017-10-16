import {assert} from 'chai';

import {reviseFn} from '../src/reviseFn';

describe('reviseFn', () => {

  describe('Should call function correctly', () => {
    it('Passes arguments correctly', () => {
      const mirrorArgs = function() {
        return arguments;
      };
      const originalArgs = [1, 'a', [1, 2, 3]];

      const revisedFn = reviseFn(mirrorArgs);
      const rawArgs = revisedFn.apply(null, originalArgs);
      const returnArgs = Array.prototype.slice.call(rawArgs);

      assert.deepEqual(
          returnArgs, originalArgs, 'Should return same arguments');
    });

    it('Passes correct context', () => {
      const mirrorContext = function(this: {}) {
        return this;
      };
      const originalContext = {foo: 1};

      const revisedFn = reviseFn(mirrorContext);
      const returnContext = revisedFn.apply(originalContext);

      assert.deepEqual(
          returnContext, originalContext, 'Should return same arguments');
    });
  });

  describe('Should diff output', () => {
    it('Should return same value for no op', () => {
      const obj = {foo: 'bar'};
      const fn = () => obj;
      const revisedFn = reviseFn(fn);
      const output1 = revisedFn();
      const output2 = revisedFn();
      assert.strictEqual(output1, obj, 'Should return obj');
      assert.strictEqual(output2, obj, 'Should return obj');
    });

    it('Should return same value for no op', () => {
      const obj = {foo: 'bar'};
      const fn = () => obj;
      const revisedFn = reviseFn(fn);
      const output1 = revisedFn();
      const output2 = revisedFn();
      assert.strictEqual(output1, obj, 'Should return obj');
      assert.strictEqual(output2, obj, 'Should return obj');
    });
  });
});
