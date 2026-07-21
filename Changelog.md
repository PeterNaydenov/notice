# Release History


### 2.5.0 ( 2026-07-21 )
- [x] Fix: a throwing subscriber used to abort the whole `emit()` chain and propagate the error to the caller, silently skipping every subscriber registered after the failing one. Each subscriber call is now wrapped in try/catch, errors are logged to `console.error`, and `emit` continues. (This is a behavior change — callers that relied on `emit` re-throwing a subscriber's error must handle it themselves, e.g. via their own wrapping);
- [x] Change: `on()` and `once()` silently no-op when `fn` is not a function. Previously they stored the value as-is and threw `'fn is not a function'` at `emit` time, far from the bug site. Defensive use (passing a possibly-undefined handler) is preserved;
- [x] Cleanup: removed unreachable-looking `if (name === '*') return` from `exeCallback` was actually load-bearing (it prevents `emit('*')` from double-firing the wildcard when iterating `Reflect.ownKeys(scroll)`). Kept the check, rewrote the comment to explain why;
- [x] Cleanup: removed stale `external: ['ms']` from `rollup.config.js`. `ms` is not a dep and not imported anywhere — leftover from a previous setup;
- [x] Docs: README "Last Updates" section now covers 2.4.0–2.4.5 (Symbol event names, reserved `__proto__` / `constructor` keys, wildcard + Symbol combinations, `once` re-registration interaction with `off`, debug mode with Symbol event names, etc.);



### 2.4.5 ( 2026-07-08 )
- [x] Fix: Build was not updated;



### 2.4.4 ( 2026-07-07 )
- [x] Fix: Wildcard listeners are not notified for 'once' events;
- [x] Fix: Symbol events are invisible for wildcard 'emit' and 'stop';
- [x] Fix: Reserved object property names ( '__proto__', 'constructor' ) can not be used as event names;
- [x] Bug: Build was not updated;



### 2.4.3 ( 2026-07-07 )
- [x] Fix: Removing the last 'once' subscriber with 'off' deletes the regular subscribers of the event;
- [x] Fix: Removing the last wildcard listener breaks 'emit';
- [x] Fix: 'Once' subscriber that re-registers itself during 'emit' is lost;
- [x] Fix: Debug mode crashes on Symbol event names;




### 2.4.2 ( 2026-04-02 )
- [x] Dependencies and devDependencies updates;



### 2.4.1 ( 2025-05-02 )
- [x] Refactoring: Some speed optimizations;



### 2.4.0 ( 2025-01-11 )
- [x] Types: Name of the event could be a symbol;



### 2.3.2 ( 2024-12-13 )
- [x] JSDoc comments were added;
- [x] TypeScript generated types were added;



### 2.3.1 ( 2024-03-15 )
- [x] Fix: Callback stop should stop the wildcard callbacks as well;



### 2.3.0 ( 2024-03-14 )
- [x] Stop execution of the event callbacks on first callback that returns string 'stop';
- [ ] Bug: Callback stop should stop the wildcard callbacks as well;



### 2.2.3 ( 2024-01-29)
- [x] Folder 'dist' was added. It contains compiled files for commonjs and es6 modules;
- [x] Package.json: "exports" section was added. Allows you to use package as commonjs or es6 module without additional configuration;



### 2.2.2 ( 2023-11-09)
- [x] Badges and head image were added to README.md;



### 2.2.1 ( 2023-10-23)
- [x] Fix: Calling 'Reset' breaks callback execution;



### 2.2.0 ( 2023-09-20)
- [x] Listen with wildcard was added;
- [ ] Bug: Calling 'Reset' breaks callback execution;



### 2.1.0 ( 2023-07-17)
- [x] Method 'reset' was added. It removes all events and functions from the event emitter; 



### 2.0.0 ( 2023-06-15)
- [x] Library was converted to ES6 module;
- [x] License was changed from ISC to MIT;



### 1.1.0 ( 2022-10-21)
- [x] Method 'debug' was added;




### 1.0.1 ( 2022-08-15)
- [x] Fix: Event data is coming in Array;
- [x] Fix: Multiple instances of notice;



### 1.0.0 (2021-05-12)
- [x] Initial code;
- [x] Test package;
- [x] Documentation;
- [ ] Bug: Event data is coming in Array;
- [ ] Bug: Multiple instances of notice;


