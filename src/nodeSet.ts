export const NODE_SYMBOL = Symbol();

export const node1 = {
  [NODE_SYMBOL]: null,
};

export const node2 = {
  [NODE_SYMBOL]: undefined,
};

// TODO(asif): Get correct typings once TS/issue/1863 is resolved.
export type Node = typeof node1|typeof node2;

/**
 * Replacement for WeakSet that checks if a node exists in a set.
 * Optimized for memory usage and performance.
 */
export class NodeSet<T extends Node> {
  /** Symbol belonging to this NodeSet. */
  private readonly nodeSymbol: symbol;

  constructor() {
    this.nodeSymbol = Symbol();
  }

  /** Removes node to set. */
  public add(node: T) {
    node[this.nodeSymbol] = null;
  }

  /** Check if node in set. */
  public has(node: T): boolean {
    return this.nodeSymbol in node;
  }

  /** Removes node from set. */
  public remove(node: T) {
    delete node[this.nodeSymbol];
  }
}
