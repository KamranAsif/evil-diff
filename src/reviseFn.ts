import revise from "./revise";

const reviseOutput = <T>(fn: () => T): (() => T) => {
  let source: T;
  return function() {
    const revision = fn.apply(this, arguments);
    source = revise(source, revision);
    return source;
  };
};

export default reviseOutput;
