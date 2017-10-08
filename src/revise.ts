import {walkTree} from './walkTree';

export const revise = <T>(source: T, revision: T): T => {
    return walkTree(source, revision);
};
