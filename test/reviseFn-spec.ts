import {assert} from 'chai';
import {stub} from 'sinon';

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

  describe('when new values are passed', () => {
    it('should return original value', () => {
      const fnStub = stub();
      fnStub.onCall(0).returns(
          {person1: {name: 'Bob'}, person2: {name: 'Jane'}});
      fnStub.onCall(1).returns(
          {person1: {name: 'Bob'}, person2: {name: 'Mary'}});
      const revisedFn = reviseFn(fnStub);
      const output1 = revisedFn();
      const output2 = revisedFn();
      assert.strictEqual(
          output2.person1, output1.person1, 'Should keep unchanged');
      assert.notStrictEqual(
          output2.person2, output1.person2, 'Should change new values');
    });
  });

  describe('when same values are passed', () => {
    it('should return original value', () => {
      const fn = () => ({foo: 'bar'});
      const revisedFn = reviseFn(fn);
      const output1 = revisedFn();
      const output2 = revisedFn();
      assert.strictEqual(output2, output1, 'Should return obj');
    });
  });

  describe('when gven initial value and unchanged output', () => {
    it('should return original value', () => {
      const obj = {foo: 'bar'};
      const fn = () => ({foo: 'bar'});
      const revisedFn = reviseFn(fn, obj);
      const output1 = revisedFn();
      const output2 = revisedFn();
      assert.strictEqual(output1, obj, 'Should return obj');
      assert.strictEqual(output2, obj, 'Should return obj');
    });
  });

  describe('on subsequent calls', () => {
    it('uses last value', () => {
      const fnStub = stub();
      fnStub.onCall(0).returns(
          {person1: {name: 'Bob'}, person2: {name: 'Jane'}});
      fnStub.onCall(1).returns(
          {person1: {name: 'Bob'}, person2: {name: 'Mary'}});
      fnStub.onCall(2).returns(
          {person1: {name: 'Dave'}, person2: {name: 'Mary'}});
      const revisedFn = reviseFn(fnStub);
      const output1 = revisedFn();
      const output2 = revisedFn();
      const output3 = revisedFn();
      assert.strictEqual(
          output3.person2, output2.person2, 'Should keep unchanged values');
    });
  });
});
