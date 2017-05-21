import walkTree from "./walkTree";

const revise = <T>(source: T, revision: T): T => {
    return walkTree(source, revision);
};

export default revise;
