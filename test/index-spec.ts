
import index = require("../src/index");
import * as chai from "chai";

const expect = chai.expect;

describe("index", () => {
  it("should provide EvilDiff", () => {
    expect(index.EvilDiff).to.not.be.undefined;
  });
});
