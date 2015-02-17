/* @copyright Toru Nagashima, 2015, under MIT License */
"use strict";
import TeaLogger from "./logger";
import {WARN, isLevel} from "./levels";

let loggers = Object.create(null);

function key(name) {
  return "tea-logger-level:" + name;
}

function store() {
  // this is TeaLogger instance.
  localStorage.setItem(key(this.name), String(this.level));
}

const createLogger = (typeof localStorage === "undefined" ?
  function(name) {
    return new TeaLogger(name, WARN);
  } :
  function(name) {
    // Restore level from cache.
    let level = localStorage.getItem(key(name));
    if (level != null) {
      level = Number(level);
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
