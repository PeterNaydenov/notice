# Dispatch benchmark

Run from the repository root. No additional dependencies are needed.

```sh
# Compare the working source with the committed source.
npm run bench

# Compare against the original revision used for this research.
node --expose-gc benchmark/dispatch.js --ref 78a7e50e1c499c6c983719cbfbb3ed020ccb2878

# Isolate wildcard argument reuse against the current, corrected source.
# The experimental variant is generated in memory; library code stays unchanged.
node --expose-gc benchmark/dispatch.js --wildcard-reuse

# Compare any two saved source modules and save the raw samples.
node --expose-gc benchmark/dispatch.js --baseline before.mjs --candidate after.mjs --output result.json
```

The experiment is generated inside `emit`, follows the source indentation, and expects the current two wildcard delivery expressions and fails explicitly if the source changes. `--samples N` changes the default of nine measured batches per variant. `--kind once` limits the matrix to once scenarios.

The matrix covers one/eight regular subscribers, zero/one/eight wildcard subscribers, zero/three payload arguments, regular and once delivery, a missing event, and a two-event wildcard broadcast. Callback workloads either record counts and received values or additionally process the payload through twelve integer-mixing steps. This is synthetic work, not an application performance estimate.

Each scenario gets three warmup batches per variant. Regular subscriptions are prepared outside timing; each measured batch emits 250,000 times. Once batches pre-register 50,000 distinct event names on one bus, then time delivery separately. Once registration time is recorded separately in the JSON; this many-name workload does not model repeatedly re-registering one name. Callback call counts, final arguments, payload identity, event names, and matching work checksums are verified outside timing.

Variants alternate execution order. `--expose-gc` enables a garbage collection after setup and before each measured batch; collections triggered during dispatch remain included. No benchmarks should run concurrently. Results report median nanoseconds per emit and every individual sample. A positive time reduction means the candidate took less time.

The recorded runs used Node v26.10.0 on an Apple M3 Max. Small differences and noisy once results should be interpreted cautiously. These results say nothing about browser engines or total application speed.

- `wildcard-run-1.json` and `wildcard-run-2.json`: corrected dispatch versus the experimental argument-reuse helper; two independent process runs. The corrected source snapshot was saved before the experiment. Both source hashes are recorded. These are historical results from before the refactor was reverted.
- `final-vs-original.json` and `final-vs-original-2.json`: two historical process runs comparing the discarded refactor with original revision `78a7e50e1c499c6c983719cbfbb3ed020ccb2878`.
- `once-restored-vs-refactor.json`: current source with the original once implementation and local error helper restored, compared with the discarded refactor; nine samples per variant across twelve once scenarios.
- See [speed-research.md](../speed-research.md) for the findings and implementation decision.

Source formatting follows the existing library style.
