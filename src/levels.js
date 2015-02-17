/* @copyright Toru Nagashima, 2015, under MIT License */
"use strict";

const VALUE = Symbol("value");
const NAME = Symbol("name");

class TeaLoggerLevel {
  constructor(value, name) {
    this[VALUE] = value;
    this[NAME] = name;
    Object.freeze(this);
  }

  valueOf() {
    return this[VALUE];
  }

  toString() {
    return this[NAME];
  }
}

export const DEBUG = new TeaLoggerLevel(0, "debug");
export const INFO  = new TeaLoggerLevel(1, "info");
export const WARN  = new TeaLoggerLevel(2, "warn");
export const ERROR = new TeaLoggerLevel(3, "error");
export const NONE  = new TeaLoggerLevel(4, "none");

export function isLevel(x) {
  return x === DEBUG || x === INFO || x === WARN || x === ERROR || x === NONE;
}

export function levelOf(x) {
  switch (x) {
    case 0: case "debug": return DEBUG;
    case 1: case "info": return INFO;
    case 2: case "warn": return WARN;
    case 3: case "error": return ERROR;
    case 4: case "none": return NONE;

    default: throw new Error("unknown value: " + x);
  }
}
