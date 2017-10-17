import {walkTree} from './walkTree';

export const NODE_SYMBOL = Symbol();

export const node1 = {
  [NODE_SYMBOL]: null
};

export const node2 = {
  [NODE_SYMBOL]: undefined
};

// TODO(asif): Get correct typings once TS/issue/1863 is resolved.
export type Node = typeof node1|typeof node2;

export class NodeSet<T extends Node> {
  add(node: T) {
    node[NODE_SYMBOL] = null;
  }

  has(node: T): boolean {
    return NODE_SYMBOL in node;
  }

  remove(node: T) {
    delete node[NODE_SYMBOL];
  }
};
