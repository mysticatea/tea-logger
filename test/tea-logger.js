/* @copyright Toru Nagashima, 2015, under MIT License */
"use strict";
import chai, {expect} from "chai";
import spies from "chai-spies";
chai.use(spies);

import polyfill from "babel/polyfill";
import TeaLogger from "../lib/index";

describe("TeaLogger", () => {
  it("should have getters.", () => {
    expect(TeaLogger.getByName).to.be.a("function");
    expect(TeaLogger.getAll).to.be.a("function");
  });

  it("should get a same instance for each name.", () => {
    const name1 = "tea-logger-testing-1";
    const name2 = "tea-logger-testing-2";
    expect(TeaLogger.getByName(name1)).to.equal(TeaLogger.getByName(name1));
    expect(TeaLogger.getByName(name2)).to.equal(TeaLogger.getByName(name2));
    expect(TeaLogger.getByName(name1)).to.not.equal(TeaLogger.getByName(name2));
  });

  it("should have constants for logging levels.", () => {
    expect(TeaLogger.DEBUG).to.be.a("object");
    expect(TeaLogger.INFO).to.be.a("object");
    expect(TeaLogger.WARN).to.be.a("object");
    expect(TeaLogger.ERROR).to.be.a("object");
    expect(TeaLogger.NONE).to.be.a("object");
  });

  describe("instance", () => {
    const originalWriter = TeaLogger.writer;
    const name = "tea-logger-testing";
    const value = "hello";
    let logger;

    beforeEach(() => {
      TeaLogger.writer = {
        log: chai.spy(),
        info: chai.spy(),
        warn: chai.spy(),
        error: chai.spy(),
        coloredArgsForName(name) {
          return [name];
        }
      };
      logger = TeaLogger.getByName(name);
    });

    afterEach(() => {
      TeaLogger.writer = originalWriter;
      logger = null;
    });

    it("should have name as same as the first argument of `getByName` calling.", () => {
      expect(logger.name).to.equal(name);
    });

    it("should have level its value is WARN.", () => {
      expect(logger.level).to.equal(TeaLogger.WARN);
    });

    describe("when its level is DEBUG,", () => {
      beforeEach(() => {
        logger.level = TeaLogger.DEBUG;
      });

      expectToWrite("log");
      expectToWrite("info");
      expectToWrite("warn");
      expectToWrite("error");
    });

    describe("when its level is INFO,", () => {
      beforeEach(() => {
        logger.level = TeaLogger.INFO;
      });

      expectToDoNothing("log");
      expectToWrite("info");
      expectToWrite("warn");
      expectToWrite("error");
    });

    describe("when its level is WARN,", () => {
      beforeEach(() => {
        logger.level = TeaLogger.WARN;
      });

      expectToDoNothing("log");
      expectToDoNothing("info");
      expectToWrite("warn");
      expectToWrite("error");
    });

    describe("when its level is ERROR,", () => {
      beforeEach(() => {
        logger.level = TeaLogger.ERROR;
      });

      expectToDoNothing("log");
      expectToDoNothing("info");
      expectToDoNothing("warn");
      expectToWrite("error");
    });

    describe("when its level is NONE,", () => {
      beforeEach(() => {
        logger.level = TeaLogger.NONE;
      });

      expectToDoNothing("log");
      expectToDoNothing("info");
      expectToDoNothing("warn");
      expectToDoNothing("error");
    });

    function expectToWrite(methodName) {
      it(methodName + " method should write value.", () => {
        logger[methodName](value);

        expect(TeaLogger.writer[methodName]).to.have.been.called.with(name, value);
      });
    }

    function expectToDoNothing(methodName) {
      it(methodName + " method should do nothing.", () => {
        logger[methodName](value);

        expect(TeaLogger.writer[methodName]).to.not.have.been.called();
      });
    }
  });// describe("instance", ...
});// describe("TeaLogger", ...
