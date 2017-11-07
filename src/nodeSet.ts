export const testSymbol = Symbol();
export const node1 = {
  [testSymbol]: true,
};
export const node2 = {
  [testSymbol]: undefined,
};

// TODO(asif): Get correct typings once TS/issue/1863 is resolved.
export type Node = typeof node1|typeof node2;

/**
 * Replacement for WeakSet that checks if a node exists in a set.
 * Optimized for memory usage and performance.
 */
export class NodeSet<T extends Node> {
  /** Symbol used to avoid set collisions. */
  private setSymbol: symbol;

  constructor() {
    this.setSymbol = Symbol();
  }

  /** Adds node to set. */
  public add(node: T) {
    node[this.setSymbol] = true;
  }

  /** Check if node in set. */
  public has(node: T): boolean {
    return node[this.setSymbol] === true;
  }

  /** Removes node from set. */
  public remove(node: T) {
    delete node[this.setSymbol];
  }
}
