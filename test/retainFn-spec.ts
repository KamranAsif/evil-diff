import {retainFn} from '../src/retainFn';
import {assert} from 'chai';
import {spy} from 'sinon';

describe('retainFn', () => {
  describe('should call function correctly', () => {
    it('and pass arguments correctly', () => {
      const mirrorArgs = function() { return arguments; };
      const originalArgs = [1, 'a', [1, 2, 3]];

      const retainedFn = retainFn(mirrorArgs);
      const rawArgs = retainedFn.apply(null, originalArgs);
      const returnArgs = Array.prototype.slice.call(rawArgs); 

      assert.deepEqual(returnArgs, originalArgs, 'Should return same arguments');
    });

    it('and pass correct context', () => {
      const mirrorContext = function() { return this; };
      const originalContext = {foo: 1};

      const retainedFn = retainFn(mirrorContext);
      const returnContext = retainedFn.apply(originalContext);

      assert.deepEqual(returnContext, originalContext, 'Should return same arguments');
    });
  });

  describe('should retain inputs', () => {
    let retainedFn: (...args: any[]) => void;
    let fnSpy: sinon.SinonSpy;

    beforeEach(() => {
      fnSpy = spy();
      retainedFn = retainFn(fnSpy);
    });

    let args1: any[];
    let args2: any[];
    beforeEach(() => {
      args1 = [];
      args2 = [];
    });

    describe('and should not call twice for no ops', () => {
      it('with primitives', () => { 
        args1 = [1, '2', false, null, undefined]; 
        args2 = [1, '2', false, null, undefined]; 
      });

      it('with objects', () => {
        const foobar = {foo: 'bar'};
        const foobaz = {foo: 'baz'};

        args1 = [foobar, foobaz]; 
        args2 = [foobar, foobaz]; 
      });

      it('with arrays', () => {
        const arr1 = [1, 2, 3];
        const arr2 = [3, 4, 5];

        args1 = [arr1, arr2];
        args2 = [arr1, arr2];
      });

      it('with functions ', () => {
        const fn1 = () => {};
        const fn2 = () => {};

        args1 = [fn1, fn2]; 
        args2 = [fn1, fn2]; 
      });

      afterEach(() => {
        retainedFn.apply(null, args1);
        assert.equal(fnSpy.calledOnce, true);

        retainedFn.apply(null, args2);
        assert.equal(fnSpy.calledOnce, true);
      });
    });

    describe('and should be called twice for new objs', () => {
      it('with less args', () => { 
        args1 = [1, '2', false, null];
        args2 = [1, '2', false];
      });

      it('with more args', () => { 
        args1 = [1, '2', false];
        args2 = [1, '2', false, null];
      });

      const primitives = [
        {'type': 'number', value: 2},
        {'type': 'string', value: '3'},
        {'type': 'boolean', value: true},
        {'type': 'null', value: {}},
        {'type': 'undefined', value: null}
      ];

      primitives.forEach(({type, value}, index) => {
        it(`with primitive ${type}`, () => { 
          args1 = [1, '2', false, null, undefined];
          args2 = JSON.parse(JSON.stringify(args1));
          args2[index] = value
        });
      });

      it('with objects', () => {
        const obj1 = {val: 'bar'};
        const obj2 = {val: 'bar'};
        const obj3 = {val: 'baz'};

        args1 = [obj1, obj3]; 
        args2 = [obj2, obj3]; 
      });

      it('with arrays', () => { 
        const arr1 = [1, 2, 3];
        const arr2 = [1, 2, 3];
        const arr3 = [3, 4, 5];

        args1 = [arr1, arr3];
        args2 = [arr2, arr3];
      });

      it('with functions ', () => {
        const fn1 = () => {};
        const fn2 = () => {};
        const fn3 = () => {};

        args1 = [fn1, fn3]; 
        args2 = [fn2, fn3]; 
      });

      afterEach(() => {
        retainedFn.apply(null, args1);
        assert.equal(fnSpy.calledOnce, true);

        retainedFn.apply(null, args1);
        assert.equal(fnSpy.calledOnce, true);

        retainedFn.apply(null, args2);
        assert.equal(fnSpy.calledTwice, true);

        retainedFn.apply(null, args2);
        assert.equal(fnSpy.calledTwice, true);
      });
    });
  });
});
