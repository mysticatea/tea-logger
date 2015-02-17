# tea-logger

The Logger Manager for frontend.

## Installation

```
$ npm install tea-logger --save
```

TeaLogger is designed on the assumption that uses together with browserify.

## Usage

### Basic

```js
import TeaLogger from "tea-logger";

let logger = TeaLogger.getByName("my-module-name");

logger.log("hello");
logger.info("hello");
logger.warn("hello");
logger.error("hello");
```

TeaLogger has methods `log`, `info`, `warn`, and `error` as same as `console` object's.
Of course, debug tools show correct line and column.

TODO: Image.

Logs that has log level greater than configuration are written to `console`.
You can open the configuration view by `click + T` to configure log levels.

TODO: Image.

### Custom Writer

```ts
interface Writer {
  log: (...args: any[]) => void
  info: (...args: any[]) => void
  warn: (...args: any[]) => void
  error: (...args: any[]) => void
  coloredArgsForName: (name: string) => string[]
}
```

You can customize log writing logic.

```js
import TeaLogger from "tea-logger";

TeaLogger.writer = yourWriter;
```

## Reference

```ts
declare module TeaLogger {
  const DEBUG: TeaLoggerLevel;
  const INFO: TeaLoggerLevel;
  const WARN: TeaLoggerLevel;
  const ERROR: TeaLoggerLevel;
  const NONE: TeaLoggerLevel;

  function isLevel(x: any): boolean;
  function levelOf(x: number|string): TeaLoggerLevel;

  const consoleWriter: Writer;
  let writer: Writer;

  function getByName(name: string): TeaLogger;
  function getAll(): TeaLogger[];

  interface TeaLoggerLevel {
    valueOf(): number;
    toString(): string;
  }

  interface TeaLogger {
    name: string;
    level: TeaLoggerLevel;

    log(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
  }

  interface Writer {
    log(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    coloredArgsForName(name: string): string[]
  }
}
```

TODO: Details.
