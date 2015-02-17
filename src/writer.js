/* @copyright Toru Nagashima, 2015, under MIT License */
"use strict";

export function isValidWriter(x) {
  return (
    x != null &&
    typeof x.log === "function" &&
    typeof x.info === "function" &&
    typeof x.warn === "function" &&
    typeof x.error === "function" &&
    typeof x.coloredArgsForName === "function"
  );
}
