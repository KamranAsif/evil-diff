[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/KamranAsif/evil-diff.svg?branch=master)](https://travis-ci.org/KamranAsif/evil-diff.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/KamranAsif/evil-diff/badge.svg?branch=master)](https://coveralls.io/github/KamranAsif/evil-diff?branch=master)
[![npm version](https://badge.fury.io/js/fixed-data-table-2.svg)](https://www.npmjs.com/package/fixed-data-table-2)
 
# Evil Diff

Immutable data can make things fast. The problem is trying to model your data as immutable is very challenging. You might have seen libraries like Immutable.js and seamless-immutable and feared switching. 

EvilDiff comes to the rescue!

It will compare two pieces of data, apply any changes it finds, and clone along the path. Unchanged data keep their old pointer and changed data gets new pointers along its path.

## Getting started

Install evil-diff using npm or yarn.

```
npm install evil-diff
```

Then require it into any module.

```
import EvilDiff from 'evil-diff';

var objDiff = EvilDiff.revise(obj1, obj2);
```

## Examples

No changes between two objects returns original object:

```
const result1 = { 'John': {name: {first: 'John', last: 'Doe'}, zipCode: '86469'} };
const result2 = { 'John': {name: {first: 'John', last: 'Doe'}, zipCode: '86469'} };

assertFalse(result1 === result2); // not same object
assertdeepEqual(result1, result2); // but same data

const revisedResult = EvilDiff.revise(result1, result2);
assertTrue(revisedResult === result1); //Data was unchanged, returns old pointer
```

Changes return new references, but preserve references for unchanged properties

```
const result1 = { 'John': {name: {first: 'John', last: 'Doe'}, zipCode: '86469'} };
const result2 = { 'John': {name: {first: 'John', last: 'Doe'}, zipCode: '91752'} };

assertFalse(result1 === result3); // not same object
assertNotDeepEqual(result1, result3); // different data

const revisedResult = EvilDiff.revise(result1, result3);

assertFalse(revisedResult === result1 || revisedResult === result3); //Data was changed, new object

assertDeepEqual(revisedResult, result3); // Data matches result3
assertTrue(revisedResult.John.name === result1.John.name); // Unchanged data keeps same reference
``````
