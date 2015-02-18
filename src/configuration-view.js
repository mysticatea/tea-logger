/* @copyright Toru Nagashima, 2015, under MIT License */
"use strict";
import {DEBUG, INFO, WARN, ERROR, NONE, levelOf} from "./levels";
import {getByName, getAll} from "./pool";
import {html, findAncestor} from "./dom-utils";

const forEach = Function.prototype.call.bind(Array.prototype.forEach);

//==============================================================================
// Style Definition.

function defineStyleElement(doc) {
  if (doc.querySelector("style[tea-logger-style]") != null) {
    return;
  }

  doc.head.appendChild(html`
    <style tea-logger-style>
      [tea-logger] {
        position: absolute;
        top: 0;
        left: 0;
        border-collapse: collapse;
        font-family: monospace;
        box-shadow: 0 0 32px 16px rgba(0,0,0,0.33);
      }
      [tea-logger] tr {
        transition: color 300ms, background-color 300ms;
      }
      [tea-logger] td {
        border: 1px solid gray;
        vertical-align: middle;
      }
      [tea-logger] th {
        border: 1px solid gray;
        background: #607D8B;
        text-align: center;
        vertical-align: middle;
        color: #ECEFF1;
        font-weight: bold;
      }

      [tea-logger] .tea-debug {
        color: #212121;
        background: #9FA8DA;
      }
      [tea-logger] .tea-info {
        color: #212121;
        background: #81C784;
      }
      [tea-logger] .tea-warn {
        color: #212121;
        background: #FFEE58;
      }
      [tea-logger] .tea-error {
        color: #212121;
        background: #E57373;
      }
      [tea-logger] .tea-none {
        color: #EEEEEE;
        background: #424242;
      }

      [tea-logger] .tea-name {
      }
      [tea-logger] .tea-value {
      }
      [tea-logger] input[type=range] {
        width: 5.5em;
      }

      [tea-logger] .tea-label::after {
        display: inline-block;
        width: 2.5em;
      }
      [tea-logger] .tea-debug .tea-label::after {
        content: "DEBUG";
      }
      [tea-logger] .tea-info .tea-label::after {
        content: "INFO";
      }
      [tea-logger] .tea-warn .tea-label::after {
        content: "WARN";
      }
      [tea-logger] .tea-error .tea-label::after {
        content: "ERROR";
      }
      [tea-logger] .tea-none .tea-label::after {
        content: "NONE";
      }
    </style>
  `);
}

//==============================================================================
// DOM Definition.

function row(logger) {
  return `
    <tr class="tea-${String(logger.level)}">
      <td class="tea-name">
        ${logger.name}
      </td>
      <td class="tea-value">
        <div class="tea-label">
          <input type="range"
                 min="0"
                 max="4"
                 step="1"
                 value="${Number(logger.level)}"
                 data-name="${logger.name}"
          >
        </div>
      </td>
    </tr>
  `;
}

function onLevelChanged() {
  // `this` is <input type="range">
  let name = this.dataset.name;
  let value = Number(this.value);
  let level = levelOf(value);
  let logger = getByName(name);
  let tr = findAncestor(this, node => node.tagName === "TR");

  logger.level = level;
  tr.className = `tea-${String(level)}`;
}

function show(doc) {
  defineStyleElement(doc);

  // Get loggers.
  let loggers = getAll();
  loggers.sort();

  // Create DOM elements.
  let root = html`
    <table tea-logger>
      <tr>
        <th colspan="2">
          Logger Configuration
        </th>
      </tr>
      ${loggers.map(row)}
    </table>
  `;

  // Setup events.
  forEach(root.querySelectorAll("input[type=range]"), input => {
    input.addEventListener("change", onLevelChanged);
  });

  // Attach.
  doc.body.appendChild(root);
}

//==============================================================================
// Showing Operation.

let mousedown = false;
function toggleLogicOnMousedown(e) {
  mousedown = true;

  if (e.defaultPrevented) {
    return;
  }

  let root = this.querySelector("table[tea-logger]");
  if (root != null) {
    // Hide if outside of root.
    if (findAncestor(e.target, node => node === root) == null) {
      e.preventDefault();
      root.remove();
    }
  }
}

function toggleLogicOnMouseup() {
  mousedown = false;
}

function toggleLogicOnKeydown(e) {
  if (e.defaultPrevented) {
    return;
  }

  if (mousedown && e.keyCode === 84/*T*/) {
    let root = this.querySelector("table[tea-logger]");
    if (root == null) {
      e.preventDefault();
      show(this);
    }
  }
}

//==============================================================================
// Debug Mode.

let debugMode = false;
export function getDebugMode() {
  return debugMode;
}
export function setDebugMode(value) {
  value = Boolean(value);
  if (value === debugMode) {
    return;
  }
  debugMode = value;

  if (typeof document === "undefined") {
    return;
  }
  if (value) {
    document.addEventListener("mousedown", toggleLogicOnMousedown);
    document.addEventListener("mouseup", toggleLogicOnMouseup);
    document.addEventListener("keydown", toggleLogicOnKeydown);
  }
  else {
    document.removeEventListener("mousedown", toggleLogicOnMousedown);
    document.removeEventListener("mouseup", toggleLogicOnMouseup);
    document.removeEventListener("keydown", toggleLogicOnKeydown);
  }
}

//==============================================================================
// Public Interface to show/hide

export function showConfigurationView(doc = undefined) {
  if (doc === undefined && typeof document !== "undefined") {
    doc = document;
  }

  let root = doc.querySelector("table[tea-logger]");
  if (root) {
    return;
  }
  show(doc);
}

export function hideConfigurationView(doc = undefined) {
  if (doc === undefined && typeof document !== "undefined") {
    doc = document;
  }

  let table = doc.querySelector("table[tea-logger]");
  if (table) {
    table.remove();
  }
}

//==============================================================================
// First debug mode.

setDebugMode(
  typeof document !== "undefined" &&
  typeof location !== "undefined" &&
  location.search.indexOf("debug") >= 0);
