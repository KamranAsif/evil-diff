import * as Benchmark from 'benchmark'
import EvilDiff = require("../src/index");

declare var global: any

global.generateSchema = () => ({
  "title": "Person",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "age": {
      "description": "Age in years",
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["firstName", "lastName"]
});

const suite = new Benchmark.Suite;

let revision: any;
let source: any;

suite.add('basic no op', {
  setup: () => {
    source = global.generateSchema();
    revision = global.generateSchema();
  },
  fn: () => {
    EvilDiff.revise(source, revision);
  }
});

suite.add('single deep object change', {
  setup: () => {
    source = global.generateSchema();
    revision = global.generateSchema();
    revision.properties.age.minimum = 1;
  },
  fn: () => {
    EvilDiff.revise(source, revision);
  }
});

suite.add('array property addition', {
  setup: () => {
    source = global.generateSchema();
    revision = global.generateSchema();
    revision.required.push('age');
  },
  fn: () => {
    EvilDiff.revise(source, revision);
  }
});

suite.add('object property addition', {
  setup: () => {
    source = global.generateSchema();
    revision = global.generateSchema();
    revision.properties.firstName.description = 'First name';
  },
  fn: () => {
    EvilDiff.revise(source, revision);
  }
});

suite.add('array property deletion', {
  setup: () => {
    source = global.generateSchema();
    revision = global.generateSchema();
    revision.required.pop();
  },
  fn: () => {
    EvilDiff.revise(source, revision);
  }
});

suite.add('object property deletion', {
  setup: () => {
    source = global.generateSchema();
    revision = global.generateSchema();
    delete revision.properties.age.description;
  },
  fn: () => {
    EvilDiff.revise(source, revision);
  }
});

suite.add('object property undefined', {
  setup: () => {
    source = global.generateSchema();
    revision = global.generateSchema();
    revision.properties.age.description = undefined;
  },
  fn: () => {
    EvilDiff.revise(source, revision);
  }
});

suite.on('cycle', function (event: Benchmark.Event) {
  console.log(String(event.target));
})

suite.run();
