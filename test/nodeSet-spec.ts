import {assert} from 'chai';
import {spy} from 'sinon';

import {NodeSet} from '../src/nodeSet';

describe('NodeSet', () => {
  let nodeSet: NodeSet<{}>;
  beforeEach(() => {
    nodeSet = new NodeSet();
  });

  describe('when object is added', () => {
    let foo: {};
    beforeEach(() => {
      foo = [1, 2, 3];
      nodeSet.add(foo);
    });

    it('should return true for has(object)', () => {
      assert.isTrue(nodeSet.has(foo));
    });

    it('should return false for has(other object)', () => {
      assert.isFalse(nodeSet.has([1, 2, 3]));
    });

    it('should not collide with other NodeSet instances', () => {
      const newNodeSet = new NodeSet();
      assert.isFalse(newNodeSet.has(foo));
    });

  });

  describe('when object is removed', () => {
    let foo: {};
    beforeEach(() => {
      foo = [1, 2, 3];
      nodeSet.add(foo);
      nodeSet.remove(foo);
    });

    it('should return false for has(object)', () => {
      assert.isFalse(nodeSet.has(foo));
    });
  });
});
