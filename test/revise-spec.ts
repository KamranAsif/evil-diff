import revise from '../src/revise';
import { assert } from 'chai';

describe('revise', () => {
  describe('works with primitives', () => {
    it('should return unchanged value', () => {
      const sources = [1, 'two', false, null, undefined];
      const revisions = [1, 'two', false, null, undefined];
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        const revision = revisions[i];
        const newSource = revise(source, revision);
        assert.strictEqual(newSource, source, 'Should return same value');
      }
    });
    it('should return changed values', () => {
      const sources = [1, 'two', false, null, undefined];
      const revisions = [2, 'three', true, '4', 5];
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        const revision = revisions[i];
        const newSource = revise(source, revision);
        assert.strictEqual(newSource, revision, 'Should return new value');
      }
    });
  });

  describe('works with objects', () => {
    it('should return unchanged object if no change', () => {
      const source = {foo: 1};
      const revision = {foo: 1};
      const newSource = revise(source, revision);
      assert.strictEqual(newSource, source, 'Should return same obj');
    });
    it('should return new object if changed', () => {
      const source = {foo: 1};
      const revision = {foo: 2};
      const newSource = revise(source, revision);
      assert.notStrictEqual(newSource, source, 'Should return a new obj');
    });
    it('should take values from revision object', () => {
      const source = {foo: 1};
      const revision = {foo: 2};
      const newSource = revise(source, revision);
      assert.deepEqual(newSource, revision, 'Should have values from second obj');
    });
  });

  describe('works with arrays', () => {
    it('should return unchaged array if no change', () => {
      const source = [1, 2, 3];
      const revision = [1, 2, 3];
      const newSource = revise(source, revision);
      assert.strictEqual(newSource, source, 'Should return same obj');
    });
    it('should return new array if changed', () => {
      const source = [1, 2, 3];
      const revision = [3, 2, 1];
      const newSource = revise(source, revision);
      assert.notStrictEqual(newSource, source, 'Should return a new obj');
    });
    it('should take values from revision array', () => {
      const source = [1, 2, 3];
      const revision = [3, 2, 1];
      const newSource = revise(source, revision);
      assert.deepEqual(newSource, revision, 'Should have values from second obj');
    });
  });

  describe('works with functions', () => {
    it('should return unchaged function if no change', () => {
      const source = () => {};
      const revision = source;
      const newSource = revise(source, revision);
      assert.strictEqual(newSource, source, 'Should return original function');
    });
    it('should return new function if changed', () => {
      const source = (a: string) => {};
      const revision = (b: string) => {};
      const newSource = revise(source, revision);
      assert.strictEqual(newSource, revision, 'Should return new function');
    });
  });

  describe('works with mixed types', () => {
    it('Shouldn\'t merge array and object', () => {
      const arr: any = ['a', 'b', 'c'];
      const obj: any = { 0: 'a', 1: 'b', 2: 'c' };
      const objRevision = revise(arr, obj);
      const arrRevision = revise(obj, arr);
      assert.strictEqual(objRevision, obj, 'Should return obj');
      assert.strictEqual(arrRevision, arr, 'Should return arr');
    });
  });

  it('should have values from revision', () => {
    const source = {foo: {bar: 1}, baz: [1, 2, 3]};
    const revision1 = {foo: {bar: 2}, baz: [1, 2, 3]};
    const revision2 = {foo: {bar: 1}, baz: [3, 2, 1]};

    //debugger;
    const diff2Obj = revise(source, revision1);
    const diff3Obj = revise(source, revision2);

    assert.strictEqual(diff2Obj.baz, source.baz, 'Should keep object path unmodified path');
    assert.notStrictEqual(diff2Obj.foo, source.foo, 'Should return new path for changed value');

    assert.strictEqual(diff3Obj.foo, source.foo, 'Should keep array path unmodified path');
    assert.notStrictEqual(diff3Obj.baz, source.baz, 'Should return new path for changed value');
  });
 
});
