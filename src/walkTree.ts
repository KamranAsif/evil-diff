import {isObject} from './isObject';
import {shallowClone} from './shallowClone';

// tslint:disable-next-line no-any Cannot type recursively.
export type WalkFilter = (path: string[], value: any, newValue: any) => boolean;

export interface TreeWalkerOptions {
  // TODO(asif): See if we can get this type working.
  nodeSet: Set<{}>;
  path: string[];
  prefilter?: WalkFilter;
}

/*
 * We want to return a Symbol from crawl that lets us know we hit a circular
 * dep. In order to work with typescript, we have to trick it in a few ways.
 *
 * First, we need to tell it that CIRCULAR_DEP_DETECTED is of type CrawlEscape.
 * This is handled by casting to any to string.
 *
 * Second, we the caller function, walkTree, to identify the Symbol, without
 * having newValue muddled ed as T|CrawlEscape. But because we cast a symbol to
 * string, we can't do newValue === 'CIRCULAR_DEP_DETECTED', which would allow
 * typescript to infer that newValue wouldn't be CIRCULAR_DEP_DETECTED after
 * that line. To get around that, we implement isCrawlEscape that does the
 * symbol check for us.
 */
const CIRCULAR_DEP_DETECTED = Symbol();
type CrawlEscape = 'CIRCULAR_DEP_DETECTED';

const crawl = <T>(
    source: T, revision: T, options: TreeWalkerOptions): (T|CrawlEscape) => {
  const {
    nodeSet,
    path,
    prefilter,
  } = options;

  // Crawl assumes path is up to date.
  if (prefilter && prefilter(path, source, revision)) {
    return source;
  }

  if (isObject(source)) {
    if (nodeSet.has(source)) {
      // Source will be removed by callee from the set.
      return CIRCULAR_DEP_DETECTED as {} as CrawlEscape;
    } else {
      nodeSet.add(source);
    }
  }

  const newValue = walkTree(source, revision, options);

  if (isObject(source)) {
    nodeSet.delete(source);
  }

  return newValue;
};

/**
 * Hack to transform CIRCULAR_DEP_DETECTED to CrawlEscape.
 */
// tslint:disable-next-line no-any We allow any object to be checked.
const isCrawlEscape = (value: any): value is CrawlEscape => {
  return value === CIRCULAR_DEP_DETECTED;
};

/**
 * Recursively walks tree, copy values to revision object and cloning
 * paths that have cloned.
 */
// tslint:disable-next-line only-arrow-functions crawl needs hoisting.
export function walkTree<T>(
    source: T, revision: T, options: TreeWalkerOptions): T {
  const {
    path,
    prefilter,
  } = options;

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

  for (const key of sourceKeys) {
    const sourceValue: ValueType = source[key];
    const revisionValue = key in revision ? revision[key] : undefined;

    // TOOD(asif): Optimize path by only mutating if prefilter is set.
    // Add key to the path before crawling.
    path.push(key);

    // Recursive call. If newValue is deeply equal to sourceValue, then
    // we return sourceValue, allowing us to skip cloning.
    // To handle deleted property via undefined, we need to explictly set this
    // return type.
    const newValue: (ValueType|CrawlEscape|undefined) =
        crawl(sourceValue, revisionValue, options);

    // Remove key from path after crawling.
    path.pop();

    // Check to see if we hit a circular dependency.
    if (isCrawlEscape(newValue)) {
      return revisionValue;
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

  // TODO(asif): Optimize this best O(n) to worst O(n) by switching to a
  // set.
  for (const key of revisionKeys) {
    // TODO(asif): Use deletedCount to return early.
    const sourceHasKey = key in source;

    // TOOD(asif): Optimize path by only mutating if prefilter is set.

    if (!sourceHasKey) {
      path.push(key);

      if (prefilter && prefilter(path, source[key], revision[key])) {
        continue;
      }

      path.pop();

      // There are new keys, so we should clone if we haven't done so already.
      // TODO(asif): Remove isObject call when TS/pull/13288 is merged in.
      if (!cloned && isObject(source)) {
        source = shallowClone(source);
        cloned = true;
      }

      source[key] = revision[key];
    }
  }

  return source;
}
