---
name: notice
description: |
  Help developers use `@peter.naydenov/notice` (the `notice` event emitter,
  v2.5.0): register subscribers with `on` / `once`, fire with `emit`,
  unregister with `off`, and use `stop` / `start` for muting. Use when a
  developer asks for a simple pub/sub / event emitter, decoupled
  callbacks for a state change, or the "fire and call a list of
  subscribers" pattern with support for string AND Symbol event names
  and a `'*'` wildcard. Do NOT use for: a full state-management library
  (point to `@peter.naydenov/signals` or `@peter.naydenov/data-pool`),
  async event handling (use `@peter.naydenov/ask-for-promise` to wrap
  the callback), or fixing bugs in the library itself.
---

# notice helper

A minimal event emitter. One bus, named events, optional wildcard, sync
callbacks. Built around a null-prototype `scroll` map so reserved names
(`'__proto__'`, `'constructor'`) are safe to use as event names.

Source of truth:
- `src/main.js` — the entire bus is one function; JSDoc on each public method
- `test/notice.test.js` — executable examples for every pattern below
- `README.md` — narrative docs and the "Last Updates" changelog snippet

## Procedure

1. **Map the developer's intent to the right shape of `notice()` call**:
   - "Subscribe to events on this object" / "I need a small event bus" → `const bus = notice()`, then `bus.on('eventName', fn)`
   - "Listen for any event" → `bus.on('*', fn)` — fires for every `emit` with the event name as the first arg
   - "Run this once, then unsubscribe" → `bus.once('eventName', fn)` — does NOT work for `'*'` (silently no-ops)
   - "Remove a subscriber" / "tear down" → `bus.off('eventName', fn?)` — pass `fn` to remove one subscriber, omit to remove all subscribers of that event
   - "Fire the event" / "broadcast a state change" → `bus.emit('eventName', ...args)` — sync, errors caught per-subscriber
   - "Temporarily mute" / "Mute everything" → `bus.stop('eventName')` or `bus.stop('*')`
   - "Unmute" / "Reset everything" → `bus.start('eventName')` or `bus.start('*')`; `bus.reset()` for a full wipe
   - "Log every event to console" → `bus.debug(true, '[my-tag]')` — header is optional and appears in the log

2. **Generate code that follows the real API contract**:
   - ESM import: `import notice from '@peter.naydenov/notice'` (CJS: `require('@peter.naydenov/notice')`)
   - Default export is a **factory function** — call it to get a bus: `const bus = notice()`. Multiple buses are independent (each has its own `scroll`, `scrollOnce`, `ignore`).
   - Event names can be `string` OR `Symbol`. Use a `Symbol` when you need a guaranteed-private event name across modules.
   - Subscribers can return the literal string `'STOP'` (case-insensitive) to halt the chain. Useful as a "short-circuit" — a guard subscriber that returns `'STOP'` prevents later subscribers on the same event from running.
   - **Subscribers that `throw` no longer abort the chain** (since v2.5.0). The error is logged to `console.error` and `emit` continues with the next subscriber. Don't rely on `emit` re-throwing.
   - `off` is overloaded: `off(eventName)` removes ALL subscribers (regular and once) for that event; `off(eventName, fn)` removes only `fn` from the subscribers of that event (in both the regular and once lists).
   - `'*'` is the wildcard event for the regular `on`/`off` only. `once('*')` silently no-ops (a `once` on wildcard would be ambiguous — which event was the "one"?).
   - Reserved object property names (`'__proto__'`, `'constructor'`) are safe to use as event names. The internal `scroll` map uses `Object.create(null)`, so prototype chain tricks don't apply.

3. **Apply the order-of-execution rules**:
   - Subscribers fire in registration order. Multiple subscribers of the same event run one after another, in the order they were added.
   - After the named subscribers, wildcard subscribers (registered via `on('*', fn)`) fire — with the **event name as the first argument**, then the event's own args.
   - A subscriber returning `'STOP'` halts the chain at that subscriber — neither the next named subscriber nor the wildcard subscribers fire for that one event.
   - A throwing subscriber is logged to `console.error` and the chain continues (v2.5.0+). Don't rely on `emit` re-throwing.

4. **Surface only the relevant gotcha proactively** — pick at most one from the list below that applies to the current example, and only if the user is unlikely to know it:
   - **One bus per call.** `notice()` is a factory, not a singleton. If you want shared state, create the bus once at module scope and export it; don't call `notice()` in multiple files.
   - **Wildcard `once` is a silent no-op.** `bus.once('*', fn)` does nothing — no error, no warning. If the user wrote that and is confused why their one-shot handler never fires, point this out.
   - **`off(eventName)` without `fn` removes ALL subscribers of that event** (regular AND once). It's a wildcard teardown. If the user wanted to remove just one, they need to pass `fn`.
   - **Throw safety changed in 2.5.0.** A subscriber that throws used to abort the entire `emit` chain and propagate the error to the caller. It now logs and continues. If the user's code relies on `emit` re-throwing, they need to handle it themselves.
   - **Debug mode prints `console.log` on every emit** (not `console.debug` or a silenced logger). It's a development tool. Don't enable it in production.

5. **If the request is for a state-management library with reactive updates** (state → view, automatic re-render, computed values), point the user at `@peter.naydenov/signals` or `@peter.naydenov/data-pool`. `notice` is a low-level pub/sub — useful for loose coupling, not for reactive UI.

6. **If the request is for an async event bus** (one subscriber awaiting another, promises as payloads), `notice` is sync-only. Either wrap the subscriber body in `@peter.naydenov/ask-for-promise` if you need cancellation/timeout control, or recommend a different library.

## Output contract

- One focused code snippet, ESM by default (CJS if asked)
- One line of context explaining which methods are used and why
- A pointer to the relevant source/test section if the developer wants to dig deeper
- Surface at most one relevant gotcha proactively, only if it applies to the example
- Never include a code example that uses `once('*', ...)` (silent no-op)
- Never include a code example that relies on `emit` re-throwing a subscriber's error (v2.5.0+ catches and logs)

## Failure handling

- The developer's use case genuinely ambiguous (e.g., "I need events") → start with the basic `on` / `emit` pair; mention `*` for cross-cutting subscribers and `once` for one-shot work
- Developer reports a bug or unexpected behavior in `notice` itself → do NOT try to fix from this skill; route to the project source or maintainer
- Developer wants a feature `notice` doesn't have (priority levels, sync/async subscribers, payload validation) → say so plainly, don't invent an API

## Examples

**"Subscribe to a state change and re-render"**

```js
import notice from '@peter.naydenov/notice'

const bus = notice()

bus.on('state:changed', (newState) => {
  render(newState)
})

// elsewhere:
bus.emit('state:changed', { count: 42 })
```

Subscribers run in registration order, in the same tick. A subscriber that throws logs to `console.error` and the chain continues — useful when one render shouldn't block another. See `on` in `src/main.js` and the "Register a regular event" example in the README.

**"Listen for ANY event with a wildcard"**

```js
import notice from '@peter.naydenov/notice'

const bus = notice()

bus.on('*', (eventName, ...args) => {
  console.log(`[logger] event "${String(eventName)}" fired with`, args)
})

bus.emit('user:login', { id: 1 })
bus.emit('data:loaded', [1, 2, 3])
// logs:
// [logger] event "user:login" fired with [{ id: 1 }]
// [logger] event "data:loaded" fired with [[1, 2, 3]]
```

Wildcard subscribers receive the event name as the **first** arg, then the event's own args. Use for cross-cutting concerns (logging, metrics, audit trails). `once('*', ...)` is a silent no-op — there is no "first event" to bind to. See `emit` and `exeCallback` in `src/main.js`.

**"Use `'STOP'` to short-circuit"**

```js
import notice from '@peter.naydenov/notice'

const bus = notice()

bus.on('request:login', (user) => {
  if (!user.allowed) return 'STOP'   // guard: halt the chain
  console.log('login attempt for', user)
})

bus.on('request:login', () => {
  console.log('this never fires for blocked users')
})

bus.emit('request:login', { name: 'P', allowed: false })
// logs: (nothing)
bus.emit('request:login', { name: 'P', allowed: true })
// logs: "login attempt for {name: 'P', allowed: true}"
//       "this never fires for blocked users"  // — wait, this DOES fire for allowed users
```

Returning the literal string `'STOP'` (case-insensitive) halts the chain at that subscriber. The next named subscriber and the wildcard subscribers both skip for that one event. Useful for guards/validators that should bypass the main work. See `exeCallback` in `src/main.js`.
