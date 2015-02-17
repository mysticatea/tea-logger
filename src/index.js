/* @copyright Toru Nagashima, 2015, under MIT License */
"use strict";
import {DEBUG, INFO, WARN, ERROR, NONE, levelOf} from "./levels";
import consoleWriter from "./consoleWriter";
import {getWriter, setWriter} from "./logger";
import {getByName, getAll} from "./pool";

export default {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  NONE,
  levelOf,
  getByName,
  getAll,
  consoleWriter,

  get writer() {
    return getWriter();
  },
  set writer(value) {
    setWriter(value, getAll());
  }
};
