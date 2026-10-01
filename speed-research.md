# Speed research: `@peter.naydenov/notice`

Updated on **2026-10-01**, starting from version **2.6.0**. The fixes below are implemented locally; the version is unchanged. The original indentation, `once` implementation, and local error helper have been restored. The only runtime change retained is the broadcast guard.

## What changed

- Fixed wildcard broadcast when a callback removes an event that has not been visited yet. Dispatch now checks that the current subscriber list still exists. This covers `off()`, `reset()`, and Symbol event names.
- Moved callback assertions outside subscribers. Subscriber error isolation can no longer swallow those assertion failures, and the tests now verify that callbacks actually ran.
- Strengthened the wildcard error-isolation test to check a successful wildcard subscriber after a throwing one.
- Preserved the original indentation, callback iteration, `once` registration and delivery, and the local `safeCall` helper. The earlier refactor was reverted; fewer lines did not justify the measured regressions.
- Clarified existing callback order, case-insensitive `STOP`, wildcard delivery, subscriber-list mutation, and `stop('*')` behavior in the README. Corrected release references for error isolation and invalid callbacks.

The factory, arrays, null-prototype maps, synchronous API, once re-registration, and subscriber error isolation are preserved. No new runtime dependency or public API was added.

## Verification

The three new broadcast removal cases failed with the original implementation and passed after the fix. `npm test` passes all **50 tests**, including nested emits, payload identity, subscribers added during delivery, and the documented dispatch order. `npm run build` succeeds; smoke checks confirm the fix and once re-registration in source, ESM, CommonJS, and UMD builds. Public declarations are unchanged; their source map was regenerated.

The source was read before reviewing the previous research. Graphify was used for relationship lookup; its saved graph predates the current test layout, so the current source and tests were the authority.

## Benchmark method

[The benchmark](benchmark/dispatch.js) compares warmed-up variants in alternating order, using nine measured batches per variant. Each comparison was run in two independent Node processes. The environment was **Node v26.10.0 / V8 14.6.202.34-node.35 on an Apple M3 Max**.

The 38 scenarios cover one/eight regular subscribers, zero/one/eight wildcard listeners, zero/three arguments, and minimal or synthetic payload-processing callbacks. There are also missing-event and broadcast cases. Regular batches contain 250,000 emits with setup outside timing. Once batches pre-register 50,000 distinct event names, then time delivery; registration is reported separately. This once workload has many names and does not model repeatedly re-registering one event.

Call counts, argument values, payload identity, event names, and matching work checksums are checked outside timing. Explicit garbage collection happens after setup and before each measured batch. Timing includes any collection triggered during dispatch.

These are median dispatch timings for synthetic workloads. They do not establish browser or application speedups. The four full-matrix runs below describe the earlier refactor, before its restoration; they are retained as historical results, not timings of the current implementation. The raw files include every sample and the source hashes from those runs; see [benchmark instructions](benchmark/README.md).

## Reverted refactor versus the original version

The earlier refactor was compared with revision `78a7e50e1c499c6c983719cbfbb3ed020ccb2878`. The table gives ranges across the two runs, rather than selecting the best result.

| Scenario | Original ns/emit | Refactored ns/emit | Observed change |
|---|---:|---:|---|
| 1 regular, no wildcard, no arguments; minimal callback | 50.1–53.1 | 46.3–47.2 | 7–11% less time |
| 1 regular, 1 wildcard, 3 arguments; minimal callbacks | 81.8–86.2 | 77.5–78.6 | 4–10% less time |
| 1 regular, 8 wildcards, 3 arguments; payload processing | 307.1–310.2 | 296.6–297.2 | 3–4% less time |
| 1 once, 1 wildcard, no arguments; minimal callbacks | 124.9–137.0 | 133.8–152.9 | 7–12% more time |
| Broadcast of 2 events, 8 wildcards, 3 arguments; minimal callbacks | 567.8–569.7 | 562.7–567.6 | Less than 1% difference |

Regular dispatch generally showed modest gains. Once delivery showed both gains and regressions, with greater variation between runs. There is **no general speedup claim**. The refactor has been reverted. The confirmed correctness fix remains as a single broadcast guard, alongside the stronger tests and documentation.

Raw results: [run 1](benchmark/final-vs-original.json), [run 2](benchmark/final-vs-original-2.json).

## Wildcard argument reuse experiment

Both wildcard delivery paths currently construct `[e, ...args]` per wildcard subscriber. The earlier experimental variant built it once per delivery, skipped construction when there were no listeners, and shared the delivery helper at factory scope. Arguments remained local to each dispatch.

This comparison isolates that experiment against the corrected implementation, rather than bundling it with the other fixes.

| Scenario | Experimental change across two runs |
|---|---|
| 1 regular, 8 wildcards, 3 arguments; minimal callbacks | 37% less time |
| 8 regulars, 8 wildcards, 3 arguments; minimal callbacks | 27% less time |
| 1 regular, 8 wildcards, 3 arguments; payload processing | 30–31% less time |
| 1 regular, 1 wildcard, no arguments; minimal callbacks | 8–11% more time |
| Broadcast of 2 events, 8 wildcards, 3 arguments; minimal callbacks | 30–31% less time |

**Decision: leave argument reuse out of the library for now.** It has a repeatable benefit for multiple wildcard listeners carrying payloads, but it also regresses a simple single-listener case. Without evidence that the favorable workload matters to users, this tradeoff does not justify changing dispatch.

The argument-reuse experiment can still be generated against the current source in memory through `node --expose-gc benchmark/dispatch.js --wildcard-reuse`; the current source uses the original local error helper, so this generates a new variant rather than recreating the earlier factory-scope refactor. It adds no branches to the library. Historical raw results: [run 1](benchmark/wildcard-run-1.json), [run 2](benchmark/wildcard-run-2.json).

## Restored once implementation

The current `once` function, once-delivery block, and local `safeCall` helper match the original implementation exactly. All 50 tests pass, including re-registration, nested emits, error isolation, and wildcard delivery. The source's original indentation and column alignment are preserved.

A focused nine-sample comparison against the discarded refactor measured **124.0 → 106.9 ns/emit** for one once subscriber, one wildcard listener, and no payload: about **14% less time**. The twelve once scenarios ranged from about 2% more time to 14% less time; this single focused run is not a universal speedup claim. Registration was prepared outside dispatch timing and measured separately.

Raw results: [restored once versus refactor](benchmark/once-restored-vs-refactor.json). To compare the current once path with an earlier saved source, run `node --expose-gc benchmark/dispatch.js --baseline before.mjs --kind once`.

## Practical conclusion

The confirmed bug and test gaps are fixed. Keep case-insensitive `STOP`, the broadcast wildcard guard, and deleting once subscribers before invoking them. The old argument-destructuring optimization is irrelevant to the current `emit(e, ...args)` signature. No result justifies replacing the current maps or subscriber arrays.

Further performance work should start from an actual slow workload reported by a user. The current benchmark provides a small, repeatable way to check a proposed change while keeping code quality and readability first.
