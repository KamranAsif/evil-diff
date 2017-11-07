import {NodeSet} from './nodeSet';
import {WalkFilter, walkTree} from './walkTree';

export interface ReviseOptions { prefilter?: WalkFilter; }

export const revise =
    <T>(source: T, revision: T, reviseOptions: ReviseOptions = {}): T => {
      const {prefilter} = reviseOptions;

      // TODO(asif): See if we can get this type working.
      const nodeSet: NodeSet<{}> = new NodeSet<{}>();
      return walkTree(source, revision, {
        nodeSet,
        path: [],
        prefilter,
      });
    };
