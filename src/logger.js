/* @copyright Toru Nagashima, 2015, under MIT License */
"use strict";
import {DEBUG, INFO, WARN, ERROR, isLevel} from "./levels";
import {isValidWriter} from "./writer";
import consoleWriter from "./console-writer";

const NAME = Symbol("name");
const LEVEL = Symbol("level");
const LISTENERS = Symbol("listeners");
const RM_QUEUE = Symbol("removingQueue");
const FIRE_RECURSIVE_COUNT = Symbol("fireRecursiveCount");
const UPDATE_LOG_METHODS = Symbol("updateLogMethods");
const UPDATE_LOG_METHOD = Symbol("updateLogMethod");
const NOTIFY_LEVEL_CHANGE = Symbol("notifyLevelChange");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertType(obj, type, message) {
  if (typeof obj !== type) {
    throw new TypeError(message);
  }
}

function assertValidName(name) {
  assertType(name, "string", "name should be a string.");
  assert(name !== "", "name should be not empty string.");
}

function assertValidLevel(level) {
  assert(isLevel(level), "level should be one of DEBUG, INFO, WARN, ERROR, or NONE.");
}

function assertValidEventName(name) {
  assertType(name, "string", "name should be a string.");
}

function assertValidEventListener(listener) {
  assertType(listener, "function", "listener should be a function.");
}

function assertValidWriter(writer) {
  assert(isValidWriter(writer), "writer is invalid.");
}

function includes(array, value) {
  return array.indexOf(value) >= 0;
}

function remove(array, value) {
  const index = array.indexOf(value);
  if (index >= 0) {
    array.splice(index, 1);
  }
}

const bind = Function.prototype.apply.bind(Function.prototype.bind);
let currentWriter = consoleWriter;

function getLogMethodWithName(methodName, loggerName) {
  const method = currentWriter[methodName];
  const args = currentWriter.coloredArgsForName(loggerName);
  return bind(method, [null].concat(args));
}

export function getWriter() {
  return currentWriter;
}

export function setWriter(value, allLoggers) {
  assertValidWriter(value);

  currentWriter = value;
  allLoggers.forEach(logger => logger[UPDATE_LOG_METHODS](true));
}

export default class TeaLogger {
  constructor(name, level) {
    assertValidName(name);
    assertValidLevel(level);

    this[NAME] = name;
    this[LEVEL] = level;
    this[LISTENERS] = [];
    this[RM_QUEUE] = [];
    this[FIRE_RECURSIVE_COUNT] = 0;
    this[UPDATE_LOG_METHODS]();
  }

  get name() {
    return this[NAME];
  }

  get level() {
    return this[LEVEL];
  }

  set level(newLevel) {
    assertValidLevel(newLevel);

    const oldLevel = this[LEVEL];
    if (newLevel === oldLevel) {
      return;
    }

    this[LEVEL] = newLevel;
    this[UPDATE_LOG_METHODS]();
    this[NOTIFY_LEVEL_CHANGE](newLevel, oldLevel);
  }

  log() {}
  info() {}
  warn() {}
  error() {}

  addEventListener(name, listener) {
    assertValidEventName(name);
    assertValidEventListener(listener);
    if (name !== "levelchange") {
      // Never notify.
      return;
    }

    const listeners = this[LISTENERS];
    if (includes(listeners, listener)) {
      // Duplicated.
      return;
    }

    listeners.push(listener);
  }

  removeEventListener(name, listener) {
    assertValidEventName(name);
    assertValidEventListener(listener);
    if (name !== "levelchange") {
      // Never exist.
      return;
    }

    const listeners = this[LISTENERS];
    if (this[FIRE_RECURSIVE_COUNT] > 0) {
      // Since this is notifying event now, remove later.
      if (includes(listeners, listener)) {
        this[RM_QUEUE].push(listener);
      }
    }
    else {
      remove(listeners, listener);
    }
  }

  [UPDATE_LOG_METHODS](force = false) {
    this[UPDATE_LOG_METHOD](DEBUG, "log", force);
    this[UPDATE_LOG_METHOD](INFO, "info", force);
    this[UPDATE_LOG_METHOD](WARN, "warn", force);
    this[UPDATE_LOG_METHOD](ERROR, "error", force);
  }

  [UPDATE_LOG_METHOD](borderLevel, methodName, force) {
    const newEnabled = (this[LEVEL] <= borderLevel);
    const oldEnabled = this.hasOwnProperty(methodName);
    if (newEnabled === oldEnabled && !(newEnabled && force)) {
      return;
    }

    if (newEnabled) {
      // Should not be enumerable.
      Object.defineProperty(this, methodName, {
        value: getLogMethodWithName(methodName, this[NAME]),
        writable: true,
        configurable: true
      });
    }
    else {
      // To use prototype's.
      delete this[methodName];
    }
  }

  [NOTIFY_LEVEL_CHANGE](newLevel, oldLevel) {
    const listeners = this[LISTENERS];

    this[FIRE_RECURSIVE_COUNT] += 1;
    try {
      const e = Object.freeze({newLevel, oldLevel});
      listeners.forEach(listener => listener.call(this, e));
    }
    finally {
      this[FIRE_RECURSIVE_COUNT] -= 1;
    }

    // If some listeners have been removed from this logger while notifying,
    // those operations are pended.
    // Now, remove those.
    if (this[FIRE_RECURSIVE_COUNT] === 0) {
      const queue = this[RM_QUEUE];
      let listener;
      while ((listener = queue.pop()) != null) {
        remove(listeners, listener);
      }
    }
  }
}
