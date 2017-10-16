import {walkTree} from './walkTree';

export const revise = <T>(source: T, revision: T): T => {
  const nodeSet: WeakSet<{}> = new WeakSet<{}>();
  return walkTree(source, revision, {
    nodeSet,
  });
};
