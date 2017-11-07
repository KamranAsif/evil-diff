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

  describe('when there are multiple nodeSets', () => {
    let foo: {};
    let nodeSet2: NodeSet<{}>;

    beforeEach(() => {
      nodeSet2 = new NodeSet();

      foo = [1, 2, 3];
      nodeSet.add(foo);
    });

    it('should not leak to other sets', () => {
      assert.isTrue(nodeSet.has(foo));
      assert.isFalse(nodeSet2.has(foo));
    });

    it('should not collide', () => {
      nodeSet2.add(foo);
      assert.isTrue(nodeSet.has(foo));
      assert.isTrue(nodeSet2.has(foo));
    });

    it('Should only be removed from one node set', () => {
      nodeSet2.add(foo);
      nodeSet.remove(foo);
      assert.isFalse(nodeSet.has(foo));
      assert.isTrue(nodeSet2.has(foo));
    });
  });
});
