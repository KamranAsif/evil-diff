import {assert} from 'chai';

import {revise} from '../src/revise';

describe('revise', () => {
  describe('given primitives', () => {
    it('returns unchanged value', () => {
      const sources = [1, 'two', false, null, undefined];
      const revisions = [1, 'two', false, null, undefined];
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        const revision = revisions[i];
        const revised = revise(source, revision);
        assert.strictEqual(revised, source, 'Should return same value');
      }
    });
    it('returns changed values', () => {
      const sources = [1, 'two', false, null, undefined];
      const revisions = [2, 'three', true, '4', 5];
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        const revision = revisions[i];
        const revised = revise(source, revision);
        const newRevision = revise(revision, source);
        assert.strictEqual(revised, revision, 'Should return new value');
        assert.strictEqual(newRevision, source, 'Should return new value');
      }
    });
  });

  describe('given objects', () => {
    it('returns unchanged object if no change', () => {
      const source = {foo: 1};
      const revision = {foo: 1};
      const revised = revise(source, revision);
      assert.strictEqual(revised, source, 'Should return same obj');
    });
    it('returns new object if changed', () => {
      const source = {foo: 1};
      const revision = {foo: 2};
      const revised = revise(source, revision);
      assert.notStrictEqual(revised, source, 'Should return a new obj');
    });
    it('takes values from revision object', () => {
      const source = {foo: 1};
      const revision = {foo: 2};
      const revised = revise(source, revision);
      assert.deepEqual(revised, revision, 'Should have values from second obj');
    });
    it('takes new values from revision object', () => {
      const source = {foo: 1};
      const revision = {foo: 1, bar: 2};
      const revised = revise(source, revision);
      assert.deepEqual(
          revised, revision, 'Should have new values from second obj');
    });
    it('removes deleted values from source object', () => {
      const source = {foo: 1, bar: 2};
      const revision = {foo: 1};
      const revised = revise(source, revision);
      assert.deepEqual(
          revised, revision, 'Should have new values from second obj');
    });
    it('handles repeated objects, deeply nested', () => {
      const foo = {foo: 1};
      const bar = {bar: 2};
      const source = {foo, bar, foobar: [foo, bar]};
      const revision = {foo, bar, foobar: [bar, foo]};
      const revised = revise(source, revision);
      assert.deepEqual(
          revised, revision, 'Should have new values from second obj');
    });
  });

  describe('given arrays', () => {
    it('returns unchaged array if no change', () => {
      const source = [1, 2, 3];
      const revision = [1, 2, 3];
      const revised = revise(source, revision);
      assert.strictEqual(revised, source, 'Should return same obj');
    });
    it('returns new array if changed', () => {
      const source = [1, 2, 3];
      const revision = [3, 2, 1];
      const revised = revise(source, revision);
      assert.notStrictEqual(revised, source, 'Should return a new obj');
    });
    it('takes values from revision array', () => {
      const source = [1, 2, 3];
      const revision = [3, 2, 1];
      const revised = revise(source, revision);
      assert.deepEqual(revised, revision, 'Should have values from second obj');
    });
    it('takes new values from revision array', () => {
      const source = [1, 2, 3];
      const revision = [1, 2, 3, 4];
      const revised = revise(source, revision);
      assert.deepEqual(revised, revision, 'Should have values from second obj');
    });
    it('removes deleted values from source array', () => {
      const source = [1, 2, 3, 4];
      const revision = [1, 2, 3];
      const revised = revise(source, revision);
      assert.deepEqual(revised, revision, 'Should have values from second obj');
    });
  });

  describe('given functions', () => {
    it('returns unchaged function if no change', () => {
      const source = () => {
        return;
      };
      const revision = source;
      const revised = revise(source, revision);
      assert.strictEqual(revised, source, 'Should return original function');
    });
    it('returns new function if changed', () => {
      const source = (a: string) => {
        return;
      };
      const revision = (b: string) => {
        return;
      };

      const revised = revise(source, revision);
      assert.strictEqual(revised, revision, 'Should return new function');
    });
  });

  describe('given mixed types', () => {
    it(`doesn't merge arrays and objects`, () => {
      const arr: any = ['a', 'b', 'c'];
      const obj: any = {0: 'a', 1: 'b', 2: 'c'};
      const objRevision = revise(arr, obj);
      const arrRevision = revise(obj, arr);
      assert.strictEqual(objRevision, obj, 'Should return obj');
      assert.strictEqual(arrRevision, arr, 'Should return arr');
    });
  });

  it('returns values from revision', () => {
    const source = {foo: {bar: 1}, baz: [1, 2, 3]};
    const revision1 = {foo: {bar: 2}, baz: [1, 2, 3]};
    const revision2 = {foo: {bar: 1}, baz: [3, 2, 1]};

    const diff2Obj = revise(source, revision1);
    const diff3Obj = revise(source, revision2);

    assert.strictEqual(
        diff2Obj.baz, source.baz, 'Should keep object path unmodified path');
    assert.notStrictEqual(
        diff2Obj.foo, source.foo, 'Should return new path for changed value');

    assert.strictEqual(
        diff3Obj.foo, source.foo, 'Should keep array path unmodified path');
    assert.notStrictEqual(
        diff3Obj.baz, source.baz, 'Should return new path for changed value');
  });

  describe('when circular references are present', () => {
    it('handles self pointing circular references', () => {
      const source: any = {};
      source.foo = source;
      const revision: any = {};
      revision.foo = revision;

      const revised = revise(source, revision);
      assert.strictEqual(revised.foo, revision);
    });

    it('handles reversed pointing circular references', () => {
      const source: any = {};
      const revision: any = {};
      source.foo = revision;
      revision.foo = source;

      const revised = revise(source, revision);

      // Strange case, it ends up being source..
      assert.strictEqual(revised.foo, revision);
    });

    it('handles circular references pointing to source object', () => {
      const source: any = {};
      const revision: any = {};
      source.foo = source;
      revision.foo = source;

      const revised = revise(source, revision);
      assert.strictEqual(revised.foo, source);
    });

    it('handles circular references pointing to revision object', () => {
      const source: any = {};
      const revision: any = {};
      source.foo = revision;
      revision.foo = revision;

      const revised = revise(source, revision);
      assert.strictEqual(revised.foo, revision);
    });

    it('handles circular references pointing to other object', () => {
      const bar: any = {};
      bar.foo = bar;

      const baz: any = {};
      baz.foo = baz;

      const source: any = {};
      const revision: any = {};
      source.foo = bar;
      revision.foo = baz;

      const revised = revise(source, revision);
      assert.strictEqual(revised.foo, baz);
    });
  });

  describe('When walkFilter is passed in', () => {
    describe('when paths are passed in to prefilter', () => {
      let paths: string[];
      beforeEach(() => {

        paths = [];
        const prefilter = (path: string[]) => {
          paths.push(path.join('.'));
          return false;
        };

        const source: any = {
          changed: {prop: 1},
          deleted: {prop: 2},
        };
        const revision: any = {
          changed: {prop: 1},
          new: {prop: 2},
        };
        revise(source, revision, {prefilter});
      });

      it('should include changed paths', () => {
        assert.include(paths, 'changed');
        assert.include(paths, 'changed.prop');
      });

      it('should include new paths', () => {
        assert.include(paths, 'new');
        assert.notInclude(paths, 'mew.prop');
      });

      it('should include delete paths', () => {
        assert.include(paths, 'deleted');
        assert.notInclude(paths, 'deleted.prop');
      });
    });

    describe('when prefilter returns true', () => {
      it('should not recurse deeply', () => {
        const prefilter = (paths: string[]) => true;
        const source: any = {
          changed: {
            prop1: {foo: 1},
            prop2: {bar: 2},
          },
        };
        const revision: any = {
          changed: {prop1: null, prop2: null},
        };
        const revised = revise(source, revision, {prefilter});

        assert.strictEqual(revised, source);
      });

      it('should work with new values', () => {
        const prefilter = (paths: string[]) => includes(paths, 'prop2');
        const source: any = {
          prop1: {foo: 1},
        };
        const revision: any = {
          prop1: {foo: 1},
          prop2: {bar: 2},
        };
        const revised = revise(source, revision, {prefilter});

        assert.strictEqual(revised, source);
      });


      it('should ignore paths returned true', () => {
        const prefilter = (paths: string[]) => includes(paths, 'prop1');
        const source: any = {
          changed: {
            prop1: {foo: 1},
            prop2: {bar: 2},
          },
        };
        const revision: any = {
          changed: {prop1: null, prop2: null},
        };
        const revised = revise(source, revision, {prefilter});

        assert.strictEqual(revised.changed.prop1, source.changed.prop1);
        assert.strictEqual(revised.changed.prop2, null);
      });
    });

  });

  function includes<T>(array: T[], value: T): boolean {
    return array.indexOf(value) >= 0;
  }
});
