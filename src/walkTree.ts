import {isObject} from './isObject';
import {NodeSet} from './nodeSet';
import {shallowClone} from './shallowClone';

export type TreeWalkerOptions<T> = {
  // TODO(asif): See if we can get this type working.
  nodeSet: NodeSet<{}>
};

/**
 * Recursively walks tree, copy values to revision object and cloning
 * paths that have cloned.
 */
export const walkTree =
    <T>(source: T, revision: T, options: TreeWalkerOptions<T>): T => {
      // Return early for no op.
      if (source === revision) {
        return source;
      }

      // Return revision if its a non object type.
      // This also catches null/undefined values.
      if (!isObject(source) || !isObject(revision)) {
        return revision;
      }

      // Check if both objects are the same. This catches Arr/Obj merging.
      const matchingType = source instanceof revision.constructor &&
          revision instanceof source.constructor;

      if (!matchingType) {
        return revision;
      }

      type KeyType = keyof T;
      type ValueType = T[keyof T];

      // Gather keys. For arrays, its just a list of indexes.
      // TODO(asif): Test walking arrays instead of getting its keys.
      const sourceKeys = Object.keys(source) as KeyType[];
      const revisionKeys = Object.keys(revision) as KeyType[];

      let cloned = false;
      let deletedCount = 0;

      const {nodeSet} = options;

      for (const key of sourceKeys) {
        const sourceValue: ValueType = source[key];
        const revisionValue = key in revision ? revision[key] : undefined;

        if (isObject(sourceValue)) {
          if (nodeSet.has(sourceValue)) {
            // sourceValue will be removed my callee from the set.
            return revisionValue;
          } else {
            nodeSet.add(sourceValue);
          }
        }

        // Recursive call. If newValue is deeply equal to sourceValue, then
        // we return sourceValue, allowing us to skip cloning.
        const newValue: (ValueType|undefined) =
            walkTree(sourceValue, revisionValue, options);

        if (isObject(sourceValue)) {
          nodeSet.remove(sourceValue);
        }

        // If walkTree doesn't return new object, that means no change.
        if (newValue === sourceValue) {
          continue;
        }

        // On first change, clone current object.
        // This needs to be done before we set the newValue to the property,
        // so we don't modify the original object.
        // TODO(asif): Remove isObject call when TS/pull/13288 is merged in.
        if (!cloned && isObject(source)) {
          source = shallowClone(source);
          cloned = true;
        }

        if (newValue === undefined) {
          deletedCount++;
          // TODO(asif): Investigate performance of delete vs setting
          // undefined.
          // TODO(asif): Add configuration property to prefer undefined vs
          // delete.
          delete source[key];
        } else {
          source[key] = newValue;
        }
      }

      // Check if there are any new keys in revision object.
      if (sourceKeys.length - deletedCount === revisionKeys.length) {
        return source;
      }

      // There are new keys, so we should clone if we haven't done so already.
      // TODO(asif): Remove isObject call when TS/pull/13288 is merged in.
      if (!cloned && isObject(source)) {
        source = shallowClone(source);
        cloned = true;
      }

      // TODO(asif): Optimize this best O(n) to worst O(n) by switching to a
      // set.
      for (const key of revisionKeys) {
        // TODO(asif): Use deletedCount to return early.
        const sourceHasKey = key in source;
        if (!sourceHasKey) {
          source[key] = revision[key];
        }
      }

      return source;
    };
