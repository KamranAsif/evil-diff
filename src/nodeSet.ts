export const NODE_SYMBOL = Symbol();

export const node1 = {
  [NODE_SYMBOL]: 1,
};

export const node2 = {
  [NODE_SYMBOL]: undefined,
};

// TODO(asif): Get correct typings once TS/issue/1863 is resolved.
export type Node = typeof node1|typeof node2;

let COUNTER = 0;

/**
 * Replacement for WeakSet that checks if a node exists in a set.
 * Optimized for memory usage and performance.
 */
export class NodeSet<T extends Node> {
  /** Index used to avoid NodeSet collisions. */
  private idx: number;

  constructor() {
    this.idx = COUNTER++;
  }

  /** Removes node to set. */
  public add(node: T) {
    node[NODE_SYMBOL] = this.idx;
  }

  /** Check if node in set. */
  public has(node: T): boolean {
    return node[NODE_SYMBOL] === this.idx;
  }

  /** Removes node from set. */
  public remove(node: T) {
    delete node[NODE_SYMBOL];
  }
}
