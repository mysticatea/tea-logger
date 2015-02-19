"use strict";
import {escapeHtml} from "./dom-utils";
import {DEBUG, INFO, WARN, ERROR, NONE, levelOf} from "./levels";
import {getWriter, setWriter} from "./logger";
import {getByName as get, getAll, clearStorage} from "./pool";
import {showConfigurationView, hideConfigurationView, getDebugMode, setDebugMode} from "./configuration-view";

export default {
  // Levels
  DEBUG,
  INFO,
  WARN,
  ERROR,
  NONE,
  levelOf,

  // Pools
  getByName(name) { return get(escapeHtml(name)); },
  getAll,
  clearStorage,

  // Writers
  get writer() { return getWriter(); },
  set writer(value) { setWriter(value, getAll()); },

  // Configurations
  get debugMode() { return getDebugMode(); },
  set debugMode(value) { setDebugMode(value); },
  showConfigurationView,
  hideConfigurationView
};
