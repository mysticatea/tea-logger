/* @copyright Toru Nagashima, 2015, under MIT License */
"use strict";
import {WARN, isLevel, levelOf} from "./levels";
import TeaLogger from "./logger";

const HAS_LOCAL_STORAGE = (typeof localStorage !== "undefined");
const KEY_PATTERN = /^tea-logger-level:/;
let loggers = Object.create(null);

function key(name) {
  return "tea-logger-level:" + name;
}

function store() {
  // this is TeaLogger instance.
  localStorage.setItem(key(this.name), String(this.level));
}

const createLogger = (!HAS_LOCAL_STORAGE ?
  function(name) {
    return new TeaLogger(name, WARN);
  } :
  function(name) {
    // Restore level from cache.
    let level = localStorage.getItem(key(name));
    if (level != null) {
      try { level = levelOf(level); } catch (err) { /*ignore*/ }
    }
    if (!isLevel(level)) {
      level = WARN;
    }

    // Store level when changed.
    const logger = new TeaLogger(name, level);
    logger.addEventListener("levelchange", store);

    // Done!
    return logger;
  }
);

export function getByName(name) {
  var logger = loggers[name];
  if (logger == null) {
    logger = loggers[name] = createLogger(name);
  }
  return logger;
}

export function getAll() {
  return Object.keys(loggers).map(name => loggers[name]);
}

export const clearStorage = (!HAS_LOCAL_STORAGE ?
  function() {
    // do nothing.
  } :
  function() {
    for (let i = localStorage.length - 1; i >= 0; --i) {
      let key = localStorage.key(i);
      if (KEY_PATTERN.test(key)) {
        localStorage.removeItem(key);
      }
    };
  }
);
