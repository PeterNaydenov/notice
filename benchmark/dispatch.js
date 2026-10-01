import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { cpus } from 'node:os'
import { performance } from 'node:perf_hooks'
import { parseArgs } from 'node:util'

const { values } = parseArgs({ options: {
    baseline: { type: 'string' },
    'wildcard-reuse': { type: 'boolean', default: false },
    candidate: { type: 'string', default: 'src/main.js' },
    ref: { type: 'string', default: 'HEAD' },
    output: { type: 'string' },
    samples: { type: 'string', default: '9' },
    kind: { type: 'string' }
} })
const samples = Number(values.samples)
assert(Number.isInteger(samples) && samples >= 3, 'Use at least three samples')
if (values.kind) assert(['regular', 'once', 'missing', 'broadcast'].includes(values.kind), 'Unknown event kind')
const currentSource = readFileSync(values.candidate, 'utf8')
let sources
if (values['wildcard-reuse']) {
    assert(!values.baseline, 'Use either --baseline or --wildcard-reuse')
    const call = /scroll\['\*'\]\.forEach\s*\(\s*fn\s*=>\s*safeCall\s*\(\s*fn\s*,\s*\[e,\s*\.\.\.args\]\s*\)\s*\)/g
    const marker = currentSource.match(/^([ \t]+)function (?:exeCallback|dispatchEvent) \( name \) \{/m)
    assert.equal([...currentSource.matchAll(call)].length, 2, 'Expected the two wildcard delivery paths')
    assert(marker, 'Expected the named-event dispatch helper')
    const indent = marker[1]
    // Generate the experimental variant in memory; keep it out of library code.
    const helper = [
        `${indent}function dispatchWildcard ( e, args ) {`,
        `${indent}        const subscribers = scroll['*'];`,
        `${indent}        if ( subscribers.length === 0 ) return`,
        `${indent}        const wildcardArgs = [e, ...args];`,
        `${indent}        subscribers.forEach ( fn => safeCall ( fn, wildcardArgs ) )`,
        `${indent}    } // dispatchWildcard func.`,
        '', ''
    ].join('\n')
    sources = [currentSource, currentSource.replaceAll(call, 'dispatchWildcard ( e, args )')
        .replace(marker[0], helper + marker[0])]
} else {
    sources = [values.baseline ? readFileSync(values.baseline, 'utf8')
        : execFileSync('git', ['show', `${values.ref}:src/main.js`], { encoding: 'utf8' }), currentSource]
}
const factories = await Promise.all(sources.map(async (source, index) => {
    const url = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}#${index}`
    return (await import(url)).default
}))
const median = numbers => [...numbers].sort((a, b) => a - b)[Math.floor(numbers.length / 2)]
const names = Array.from({ length: 50000 }, (_, i) => `event:${i}`)
const payload = [12, { value: 73 }, 'payload']

function prepare(factory, scenario, iterations) {
    const bus = factory()
    const args = scenario.args ? payload : []
    let regularCalls = 0
    let wildcardCalls = 0
    let checksum = 0
    let lastEvent
    let lastArgCount
    let lastA
    let lastB
    let lastC
    function work(a = 0, b, c) {
        let value = a + (b?.value ?? 0) + (c?.length ?? 0)
        for (let step = 0; step < 12; step++) value = Math.imul(value ^ step, 16777619)
        checksum = (checksum + value) | 0
    }
    function regular(a, b, c) {
        regularCalls++
        lastArgCount = arguments.length
        lastA = a
        lastB = b
        lastC = c
        if (scenario.work === 'payload') work(a, b, c)
    }
    function wildcard(event, a, b, c) {
        wildcardCalls++
        lastEvent = event
        lastArgCount = arguments.length - 1
        lastA = a
        lastB = b
        lastC = c
        if (scenario.work === 'payload') work(a, b, c)
    }
    for (let i = 0; i < scenario.wildcards; i++) bus.on('*', wildcard)
    const registrationStart = performance.now()
    if (scenario.kind === 'once') {
        for (let i = 0; i < iterations; i++) bus.once(names[i], regular)
    } else if (scenario.kind !== 'missing') {
        for (let i = 0; i < scenario.regulars; i++) bus.on('note', regular)
        if (scenario.kind === 'broadcast') bus.on('other', regular)
    }
    const registrationNs = (performance.now() - registrationStart) * 1e6 / iterations
    function run() {
        if (scenario.kind === 'once') {
            for (let i = 0; i < iterations; i++) bus.emit(names[i], ...args)
        } else {
            const event = scenario.kind === 'broadcast' ? '*' : 'note'
            for (let i = 0; i < iterations; i++) bus.emit(event, ...args)
        }
    }
    function verify() {
        const deliveries = scenario.kind === 'broadcast' ? 2 : scenario.kind === 'missing' ? 0 : 1
        assert.equal(regularCalls, iterations * (scenario.kind === 'broadcast' ? 2 : scenario.regulars))
        assert.equal(wildcardCalls, iterations * deliveries * scenario.wildcards)
        if (deliveries) {
            assert.equal(lastArgCount, args.length)
            assert.equal(lastA, args[0])
            assert.equal(lastB, args[1])
            assert.equal(lastC, args[2])
            if (scenario.wildcards) assert.equal(lastEvent,
                scenario.kind === 'once' ? names[iterations - 1] : scenario.kind === 'broadcast' ? '*' : 'note')
        }
        return checksum
    }
    return { run, verify, registrationNs }
}

const scenarios = []
for (const kind of ['regular', 'once']) {
    for (const regulars of kind === 'regular' ? [1, 8] : [1]) {
        for (const wildcards of [0, 1, 8]) {
            for (const args of [0, 3]) {
                for (const work of ['counter', 'payload']) scenarios.push({ kind, regulars, wildcards, args, work })
            }
        }
    }
}
scenarios.push(
    { kind: 'missing', regulars: 0, wildcards: 0, args: 0, work: 'counter' },
    { kind: 'broadcast', regulars: 1, wildcards: 8, args: 3, work: 'counter' }
)
const results = []
for (const scenario of scenarios.filter(scenario => !values.kind || scenario.kind === values.kind)) {
    const iterations = scenario.kind === 'once' ? 50000 : 250000
    // Both variants receive the same warmup, and each measured batch has fresh state.
    for (let warmup = 0; warmup < 3; warmup++) {
        for (const factory of factories) {
            const batch = prepare(factory, scenario, iterations)
            batch.run()
            batch.verify()
        }
    }
    const times = [[], []]
    const registrations = [[], []]
    for (let sample = 0; sample < samples; sample++) {
        const checksums = []
        // Alternate order to reduce consistent first/second position bias.
        for (const index of sample % 2 ? [1, 0] : [0, 1]) {
            const batch = prepare(factories[index], scenario, iterations)
            // When --expose-gc is used, exclude setup garbage from the timed batch.
            global.gc?.()
            const start = performance.now()
            batch.run()
            times[index].push((performance.now() - start) * 1e6 / iterations)
            registrations[index].push(batch.registrationNs)
            checksums[index] = batch.verify()
        }
        assert.equal(checksums[0], checksums[1])
    }
    const baselineNs = median(times[0])
    const candidateNs = median(times[1])
    results.push({ ...scenario, iterations, baselineNs, candidateNs,
        reductionPercent: (1 - candidateNs / baselineNs) * 100,
        baselineSamplesNs: times[0], candidateSamplesNs: times[1],
        ...(scenario.kind === 'once' ? {
            baselineRegistrationNs: median(registrations[0]),
            candidateRegistrationNs: median(registrations[1])
        } : {})
    })
}
const report = {
    node: process.version, v8: process.versions.v8, platform: process.platform,
    arch: process.arch, gcBeforeBatch: typeof global.gc === 'function', cpu: cpus()[0]?.model, samples,
    baseline: values['wildcard-reuse'] ? values.candidate : values.baseline ?? `git ${values.ref}:src/main.js`,
    candidate: values['wildcard-reuse'] ? 'experimental wildcard reuse' : values.candidate,
    hashes: sources.map(source => createHash('sha256').update(source).digest('hex')),
    results
}
if (values.output) writeFileSync(values.output, JSON.stringify(report, null, 2) + '\n')
console.table(results.map(({ kind, regulars, wildcards, args, work, baselineNs, candidateNs, reductionPercent }) => ({
    kind, regulars, wildcards, args, work,
    'baseline ns/emit': baselineNs.toFixed(1), 'candidate ns/emit': candidateNs.toFixed(1),
    'time reduction %': reductionPercent.toFixed(1)
})))
console.log(`${process.version}; ${report.cpu}; ${samples} samples per variant; positive reduction means less time`)
