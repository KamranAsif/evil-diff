/**
 * Recursively walks tree and clones paths that have changed
 */
const walkTree = <T>(source: T, revision: T): T => {
  //Return early for no op
  if (source === revision) {
    return source;
  }

  //Return revision if its a non object type
  if (typeof source !== "object" || typeof revision !== "object") {
    return revision;
  }

  //Gather keys. For arrays, its just a list of indexes
  //TODO (asif) See if it'll be quicker walk arrays instead of getting its keys
  type keyType = keyof T;
  const sourceKeys = Object.keys(source) as keyType[];
  const revisionKeys = Object.keys(revision) as keyType[];
  let changed = false;

  for (const key of sourceKeys) {
    const sourceValue = source[key];
    const revisionValue = revision[key];
    const newValue = walkTree(sourceValue, revisionValue);

    //If walkTree doesn't return new object, that means no change
    if (newValue === sourceValue) {
      continue;
    }

    //On first change, clone current object.
    //This needs to be done before we set the newValue to the property
    if (!changed) {
      const base = Array.isArray(source) ? [] : {};
      source = Object.assign(base, source as any as object) as T;
      changed = true;
    }

    source[key] = newValue;
  }

  return source;
};

const diff = <T>(source: T, revision: T): T => {
  return walkTree(source, revision);
};

export default {
  diff,
};
