"use strict";

const IS_IE = typeof navigator === "undefined" || /Trident|Edge/.test(navigator.userAgent);
const bind = Function.prototype.call.bind(Function.prototype.bind);

export default Object.freeze({
  log: bind(console.log, console),
  info: bind(console.info, console),
  warn: bind(console.warn, console),
  error: bind(console.error, console),

  coloredArgsForName(name) {
    if (IS_IE) {
      return [name + ":"];
    }
    return ["%c" + name + ":%c", "color:gray;", ""];
  }
});
