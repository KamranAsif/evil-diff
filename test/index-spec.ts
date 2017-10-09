import index = require("../src/index");
import * as chai from "chai";

const expect = chai.expect;

describe("index", () => {
  it("should provide revise", () => {
    expect(index.revise).to.not.be.undefined;
  });
  it("should provide reviseFn", () => {
    expect(index.reviseFn).to.not.be.undefined;
  });
  it("should provide reviseReducer", () => {
    expect(index.reviseReducer).to.not.be.undefined;
  });
  it("should provide retainFn", () => {
    expect(index.retainFn).to.not.be.undefined;
  });
});
