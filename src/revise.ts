import {NodeSet} from './nodeSet';
import {walkTree} from './walkTree';

export const revise = <T>(source: T, revision: T): T => {
  // TODO(asif): See if we can get this type working.
  const nodeSet: NodeSet<{}> = new NodeSet<{}>();
  return walkTree(source, revision, {
    nodeSet,
  });
};
