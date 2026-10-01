import notice from '../src/main.js'
import { describe, it, expect, vi, afterEach } from 'vitest'

afterEach ( () => vi.restoreAllMocks() )



describe ( 'Testing Notice', () => {



it ( 'Standard event', () => {
    const eBus = notice ();
    let result = 0;
    eBus.on ( 'note', () => result += 1 )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 2 )
}) // it standard



it ( 'Single event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.once ( 'note', () => result += 1 )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 1 )
}) // it single


it ( 'Many subscribers for single event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.once ( 'note', () => result += 1 )
    eBus.once ( 'note', () => result += 3 )
    eBus.emit ( 'note'  )
    eBus.emit ( 'note'  )
    expect ( result ).toBe ( 4 )
}) // it single


it ( 'Single event can re-register itself', () => {
    const eBus = notice ();
    let result = 0;

    const fn = () => {
                result += 1
                eBus.once ( 'note', fn )   // Re-register for the next emit
        }

    eBus.once ( 'note', fn )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 3 )
}) // it single event can re-register itself



it ( 'Remove standard event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.on   ( 'note', () => result += 1 )
    eBus.off ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 0 )
}) // it remove std event



it ( 'Remove single event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.once ( 'note', () => result += 1 )
    eBus.off ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 0 )
}) // it remove single event



it ( 'Reset the emitter', () => {
    const eBus = notice ();
    let result = 0;

    eBus.once ( 'note', () => result += 1 )
    eBus.on   ( 'note', () => result += 3 )
    eBus.on   ( 'boom', () => result += 9 )
    eBus.reset ()
    eBus.emit ( 'note' )
    eBus.emit ( 'boom' )
    expect ( result ).toBe ( 0 )
}) // it reset the emitter


it ( 'Stop and resume standard event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.on ( 'note', () => result += 1 )
    eBus.stop ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 0 )
    eBus.start ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 1 )
}) // it stop and resume std event




it ( 'Stop and resume single event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.once ( 'note', () => result += 1 )
    eBus.stop ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 0 )
    eBus.start ( 'note' )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 1 )
}) // it stop and resume single event


it ( 'Emit with wildcard', () => {
    const eBus = notice ();
    let result = 0;

    eBus.on ( 'first'  , () => result+=1  )
    eBus.on ( 'second', () => result+= 3 )

    eBus.emit ( '*' )
    expect ( result ).toBe ( 4 )
}) // it emit with wildcard



it ( 'Listen with wildcard', () => {
    const eBus = notice ();
    let 
          result = 0
        , heard = []
        ;

    eBus.on ( 'first'  , () => result+=1  )
    eBus.on ( 'second', () => result+= 3 )
    eBus.on ( '*'     , e => {
                            heard.push ( e )
                    })

    eBus.emit ( 'first' )
    eBus.emit ( 'second' )
    expect ( result ).toBe ( 4 )
    expect ( heard ).toEqual ([ 'first', 'second' ])
}) // it listen with wildcard



it ( 'Listen and emit with wildcard', () => {
    const eBus = notice ();
    let result = 0;
    const heard = [];

    eBus.on ( 'first'  , () => result+=1  )
    eBus.on ( 'second', () => result+= 3 )
    eBus.on ( '*'     , e => {
                            heard.push ( e )
                            result+=10
                    })
    eBus.emit ( '*' )
    expect ( result ).toBe ( 24 )
    expect ( heard ).toEqual ([ '*', '*' ])
}) // it listen and emit with wildcard



it ( 'Wildcard listener hears single events', () => {
    const eBus = notice ();
    let heard = [];

    eBus.on   ( '*', e => heard.push ( e )   )
    eBus.on   ( 'regular', () => {} )
    eBus.once ( 'single' , () => {} )
    eBus.emit ( 'regular' )
    eBus.emit ( 'single' )
    expect ( heard ).toEqual ([ 'regular', 'single' ])

    eBus.on   ( 'both', () => {} )   // Event with both types of subscribers should notify the wildcard only once
    eBus.once ( 'both', () => {} )
    eBus.emit ( 'both' )
    expect ( heard ).toEqual ([ 'regular', 'single', 'both' ])
}) // it wildcard listener hears single events



it ( 'Symbol event with wildcard emit and stop', () => {
    const eBus = notice ();
    const SYM = Symbol ( 'note' );
    let result = 0;

    eBus.on ( SYM, () => result += 1 )
    eBus.emit ( '*' )
    expect ( result ).toBe ( 1 )

    eBus.stop ( '*' )
    eBus.emit ( SYM )
    expect ( result ).toBe ( 1 )

    eBus.start ( '*' )
    eBus.emit ( SYM )
    expect ( result ).toBe ( 2 )
}) // it symbol event with wildcard emit and stop



it ( 'Reserved object keys as event names', () => {
    const eBus = notice ();
    let result = 0;

    eBus.on ( '__proto__'  , () => result += 1 )
    eBus.on ( 'constructor', () => result += 3 )
    eBus.emit ( '__proto__' )
    eBus.emit ( 'constructor' )
    expect ( result ).toBe ( 4 )
}) // it reserved object keys as event names



it ( 'Unsubscribe wildcard listeners keeps emitter working', () => {
    const eBus = notice ();
    let result = 0;

    const wild = () => result += 10;

    eBus.on  ( '*'   , wild )
    eBus.off ( '*'   , wild )   // Removing the last wildcard listener should not break 'emit'
    eBus.on  ( 'note', () => result += 1 )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 1 )

    eBus.on  ( '*', wild )
    eBus.off ( '*' )            // Removing all wildcard listeners should not break 'emit' either
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 2 )
}) // it unsubscribe wildcard listeners keeps emitter working



it ( 'Stop and start with wildcard', () => {
    const eBus = notice ();
    let result = 0;

    eBus.on ( 'first'  , () => result+=1  )
    eBus.on ( 'second', () => result+= 3 )

    eBus.stop ( '*' )
    eBus.emit ( 'first' )
    eBus.emit ( 'second' )
    expect ( result ).toBe ( 0 )
    eBus.start ( '*' )
    eBus.emit ( 'first' )
    eBus.emit ( 'second' )
    expect ( result ).toBe ( 4 )
}) // it stop with wildcard



it ( 'Wildcard with a stopped event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.on ( 'first'  , () => result+=1  )
    eBus.on ( 'second', () => result+= 3 )

    eBus.stop ( 'second' )
    eBus.emit ( '*' )
    expect ( result ).toBe ( 1 )

}) // it wildcard with stopped event


it ( 'Unsubscribe a function', () => {
    const eBus = notice ();
    let result = 0;

    const
          fn1 = () => result += 1
        , fn2 = () => result += 3
        , fn3 = () => result += 20
        ;

    eBus.on   ( 'note' , fn1 )
    eBus.on   ( 'note' , fn2 )
    eBus.once ( 'note' , fn2 )
    eBus.once ( 'note' , fn3 )
    eBus.off  ( 'note' , fn3 )
    eBus.emit ( 'note' )
    eBus.off  ( 'note', fn2  )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 8 )
}) // it unsibsribe a function



it ( 'Unsubscribe a single function', () => {
    const eBus = notice ();
    let result = 0;

    const
          fn1 = () => result += 1
        , fn2 = () => result += 3
        , fn3 = () => result += 20
        ;

    eBus.once ( 'note' , fn3 )
    eBus.off  ( 'note' , fn3 )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 0 )
}) // it unsibsribe a function



it ( 'Unsubscribe last single function keeps standard subscribers', () => {
    const eBus = notice ();
    let result = 0;

    const
          fn1 = () => result += 1
        , fn2 = () => result += 3
        ;

    eBus.on   ( 'note' , fn1 )
    eBus.once ( 'note' , fn2 )
    eBus.off  ( 'note' , fn2 )   // Removing the last single subscriber should not affect standard subscribers
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 2 )
}) // it unsubscribe last single function keeps standard subscribers



it ( 'Unsubscribe all functions for the event', () => {
    const eBus = notice ();
    let result = 0;

    const fn3 = () => result += 20;

    eBus.on  ( 'note' , fn3 )
    eBus.off ( 'note' , fn3 )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 0 )
}) // it unsibsribe a function



it ( 'Unsubscribe a function from non existing event', () => {
    const eBus = notice ();
    let result = 0;

    const
          fn1 = () => result += 1
        , fn2 = () => result += 3
        , fn3 = () => result += 20
        ;

    eBus.on  ( 'note' , fn3 )
    eBus.off ( 'non'  , fn1 )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).toBe ( 40 )
}) // it unsibsribe a function



it ( 'Event with primitive data', () => {
    const eBus = notice ();
    const subscriber = vi.fn ();
    eBus.on ( 'note', subscriber )
    eBus.emit ( 'note', 12 )
    expect ( subscriber.mock.calls ).toEqual ([ [12] ])
}) // it Event with primitive data



it ( 'Event with object', () => {
    const eBus = notice ();
    const subscriber = vi.fn ();
    const data = {val:12};
    eBus.on ( 'note', subscriber )
    eBus.emit ( 'note', data )
    expect ( subscriber.mock.calls ).toEqual ([ [data] ])
    expect ( subscriber.mock.calls[0][0] ).toBe ( data )
}) // it Event with primitive data



it ( 'Event with two values', () => {
    const eBus = notice ();
    const subscriber = vi.fn ();
    eBus.on ( 'note', subscriber )
    eBus.emit ( 'note', 'test', {val:12} )
    expect ( subscriber.mock.calls ).toEqual ([ ['test', {val:12}] ])
}) // it Event with primitive data



it ( 'Debug mode with Symbol event name', () => {
    const eBus = notice ();
    const SYM = Symbol ( 'note' );
    let result = 0;

    const logSpy = vi.spyOn ( console, 'log' ).mockImplementation ( () => {} )
    eBus.debug ( true, '[test]' )
    eBus.on ( SYM, () => result += 1 )
    eBus.emit ( SYM )
    logSpy.mockRestore ()
    expect ( result ).toBe ( 1 )
}) // it debug mode with Symbol event name



it ( 'Multiple Notice instances', () => {
    const
         eBus1 = notice ()
       , eBus2 = notice ()
       ;

    const first = vi.fn ();
    const second = vi.fn ();
    eBus1.on ( 'test', first )
    eBus2.on ( 'test', second )
    eBus1.emit ( 'test', 12 )
    eBus2.emit ( 'test', 73 )
    expect ( first.mock.calls ).toEqual ([ [12] ])
    expect ( second.mock.calls ).toEqual ([ [73] ])
}) // it Multiple Notice instances



it ( 'Stop execution of the subscriber list on condition', () => {
        const eBus = notice ();
        let x = 0;
        eBus.on ( 'note', () => x++ )
        eBus.on ( 'note', () => {   // This function returns 'stop' and will stop the execution of the following functions
                            if ( x === 1 )   return 'stop'
                        }) 
        eBus.on ( 'note', () => x++ )
        /**
         *  Subscribers functions for the event 'note' are 3. In general, functions don't have to return anything.
         *  If a function returns string 'stop', stops executing the rest of the subscriber functions.
         * 
         *  You can build a condition subscriber functions. Register them before main subscriber function to
         *  prevent the execution if the conditions are not met.
         */
        eBus.emit ( 'note' )
        expect ( x ).toBe ( 1 )
}) // it stop execution of the subscriber list on condition


it ( 'Stop execution of the subscriber list on condition with wildcard', () => {
        const eBus = notice ();
        let x = 0;
        eBus.on ( 'note', () => 'STOP' ) // First subscriber returns 'STOP' and stops the execution of the rest of the subscribers, including the wildcard
        eBus.on ( 'note', () => x++ )
        eBus.on ( '*', () => x++ )

        eBus.emit ( 'note' )
        expect ( x ).toBe ( 0 )
}) // it stop execution of the subscriber list on condition with wildcard




describe ( 'Dispatch during subscription changes', () => {
    it.each ([ 'off', 'reset' ]) ( 'skips events removed by %s during broadcast', method => {
        const bus = notice ();
        const first = vi.fn ( () => bus[method] ( 'second' ) );
        const later = vi.fn ();
        const remaining = vi.fn ();
        bus.on ( 'first', first )
        bus.on ( 'second', later )
        bus.on ( 'third', remaining )

        expect ( () => bus.emit ( '*' ) ).not.toThrow ()
        expect ( first ).toHaveBeenCalledTimes ( 1 )
        expect ( later ).not.toHaveBeenCalled ()
        expect ( remaining ).toHaveBeenCalledTimes ( method === 'reset' ? 0 : 1 )
    })

    it ( 'skips a Symbol event removed before its broadcast turn', () => {
        const bus = notice ();
        const event = Symbol ( 'later' );
        const later = vi.fn ();
        bus.on ( 'first', () => bus.off ( event ) )
        bus.on ( event, later )

        expect ( () => bus.emit ( '*' ) ).not.toThrow ()
        expect ( later ).not.toHaveBeenCalled ()
    })

    it ( 'defers regular subscribers added to their active list until the next emit', () => {
        const bus = notice ();
        const later = vi.fn ();
        bus.on ( 'note', () => bus.on ( 'note', later ) )
        bus.emit ( 'note' )
        expect ( later ).not.toHaveBeenCalled ()
        bus.emit ( 'note' )
        expect ( later ).toHaveBeenCalledTimes ( 1 )
    })

    it ( 'defers wildcard subscribers added to their active list until the next emit', () => {
        const bus = notice ();
        const later = vi.fn ();
        bus.on ( 'note', () => {} )
        bus.on ( '*', () => bus.on ( '*', later ) )
        bus.emit ( 'note' )
        expect ( later ).not.toHaveBeenCalled ()
        bus.emit ( 'note' )
        expect ( later ).toHaveBeenCalledTimes ( 1 )
    })

    it.each ([ 'on', 'once' ]) ( 'keeps wildcard arguments independent during nested %s emits', method => {
        const bus = notice ();
        const payload = { value: 12 };
        const heard = vi.fn ();
        bus[method] ( 'outer', () => {} )
        bus.on ( 'inner', () => {} )
        bus.on ( '*', event => {
            if ( event === 'outer' ) bus.emit ( 'inner', 73 )
        })
        bus.on ( '*', heard )
        bus.emit ( 'outer', payload, 'extra' )
        expect ( heard.mock.calls ).toEqual ([ ['inner', 73], ['outer', payload, 'extra'] ])
        expect ( heard.mock.calls[1][1] ).toBe ( payload )
    })
})


describe ( 'Dispatch contract', () => {
    it ( 'runs once subscribers before regular subscribers', () => {
        const bus = notice ();
        const calls = [];
        bus.on ( 'note', () => calls.push ( 'regular' ) )
        bus.once ( 'note', () => calls.push ( 'once' ) )
        bus.on ( '*', () => calls.push ( 'wildcard' ) )
        bus.emit ( 'note' )
        expect ( calls ).toEqual ([ 'once', 'regular', 'wildcard' ])
    })

    it ( 'accepts a mixed-case STOP from regular subscribers', () => {
        const bus = notice ();
        const skipped = vi.fn ();
        bus.on ( 'note', () => 'sToP' )
        bus.on ( 'note', skipped )
        bus.on ( '*', skipped )
        bus.emit ( 'note' )
        expect ( skipped ).not.toHaveBeenCalled ()
    })

    it ( 'ignores STOP from once and wildcard subscribers', () => {
        const bus = notice ();
        const regular = vi.fn ();
        const wildcard = vi.fn ();
        bus.once ( 'note', () => 'STOP' )
        bus.on ( 'note', regular )
        bus.on ( '*', () => 'STOP' )
        bus.on ( '*', wildcard )
        bus.emit ( 'note' )
        expect ( regular.mock.calls ).toEqual ([ [] ])
        expect ( wildcard.mock.calls ).toEqual ([ ['note'] ])
    })

    it ( 'does not deliver unregistered names or once-only events during broadcast', () => {
        const bus = notice ();
        const wildcard = vi.fn ();
        const once = vi.fn ();
        bus.on ( '*', wildcard )
        bus.once ( 'single', once )
        bus.emit ( 'missing' )
        bus.emit ( '*' )
        expect ( wildcard ).not.toHaveBeenCalled ()
        expect ( once ).not.toHaveBeenCalled ()
        bus.emit ( 'single' )
        expect ( once ).toHaveBeenCalledTimes ( 1 )
        expect ( wildcard.mock.calls ).toEqual ([ ['single'] ])
    })

    it ( 'allows new event names after stop wildcard', () => {
        const bus = notice ();
        const old = vi.fn ();
        const added = vi.fn ();
        bus.on ( 'old', old )
        bus.stop ( '*' )
        bus.on ( 'new', added )
        bus.emit ( 'old' )
        bus.emit ( 'new' )
        expect ( old ).not.toHaveBeenCalled ()
        expect ( added ).toHaveBeenCalledTimes ( 1 )
    })
})


// ============================================================================
// Regression: a throwing subscriber used to abort the whole `emit()` chain
// and propagate the error to the caller, silently skipping every subscriber
// registered after the failing one. Each subscriber call is now wrapped in
// try/catch, errors are logged to `console.error`, and `emit` continues.
// ============================================================================

describe ( 'Subscriber error isolation', () => {

    it ( 'a throwing subscriber does not abort the rest of the chain', () => {
        const eBus = notice ()
        let firstRan  = false
        let thirdRan  = false
        const errorSpy = vi.spyOn ( console, 'error' ).mockImplementation ( () => {} )

        eBus.on ( 'note', () => { firstRan = true } )
        eBus.on ( 'note', () => { throw new Error ( 'boom' ) } )
        eBus.on ( 'note', () => { thirdRan = true } )

        eBus.emit ( 'note' )     // must not throw

        expect ( firstRan ).toBe ( true )
        expect ( thirdRan ).toBe ( true )
        expect ( errorSpy ).toHaveBeenCalled ()
        errorSpy.mockRestore ()
    })


    it ( 'a throwing once() subscriber does not abort the chain', () => {
        const eBus = notice ()
        let result = 0
        const errorSpy = vi.spyOn ( console, 'error' ).mockImplementation ( () => {} )

        eBus.once ( 'note', () => { throw new Error ( 'boom' ) } )
        eBus.on   ( 'note', () => result++ )

        eBus.emit ( 'note' )
        eBus.emit ( 'note' )

        expect ( result ).toBe ( 2 )   // both emits ran the regular subscriber
        errorSpy.mockRestore ()
    })


    it ( 'a throwing wildcard subscriber does not abort the rest of the chain', () => {
        const eBus = notice ()
        let result = 0
        const errorSpy = vi.spyOn ( console, 'error' ).mockImplementation ( () => {} )

        eBus.on ( 'note', () => result++ )
        eBus.on ( '*'   , () => { throw new Error ( 'wildcard boom' ) } )
        const laterWildcard = vi.fn ();
        eBus.on ( '*', laterWildcard )
        eBus.on ( 'note', () => result += 10 )

        eBus.emit ( 'note' )   // must not throw

        expect ( result ).toBe ( 11 )
        expect ( laterWildcard.mock.calls ).toEqual ([ ['note'] ])
        expect ( errorSpy ).toHaveBeenCalledTimes ( 1 )
        errorSpy.mockRestore ()
    })


    it ( 'STOP still works after a throwing subscriber', () => {
        const eBus = notice ()
        let x = 0
        const errorSpy = vi.spyOn ( console, 'error' ).mockImplementation ( () => {} )

        eBus.on ( 'note', () => { throw new Error ( 'boom' ) } )   // logged + skipped
        eBus.on ( 'note', () => 'STOP' )                              // halts the chain
        eBus.on ( 'note', () => x++ )                                 // never called

        eBus.emit ( 'note' )

        expect ( x ).toBe ( 0 )
        errorSpy.mockRestore ()
    })

}) // describe subscriber error isolation




// ============================================================================
// Regression: `on` and `once` used to silently store non-function values
// (e.g. `eBus.on('note')` with no second arg, or a typo), then throw
// `'fn is not a function'` at `emit` time — far from the bug site and
// confusing. They now silently no-op so the bad call is a no-op (no
// throw, no storage, no future `'fn is not a function'`).
// ============================================================================

describe ( 'on / once input validation', () => {

    it ( 'on() with no fn argument is a silent no-op', () => {
        const eBus = notice ()
        let result = 0

        expect ( () => eBus.on ( 'note' ) ).to.not.throw ()
        eBus.on ( 'note', () => result++ )

        eBus.emit ( 'note' )   // no throw, regular subscriber fires

        expect ( result ).toBe ( 1 )
    })


    it ( 'on() with a non-function fn is a silent no-op', () => {
        const eBus = notice ()
        let result = 0

        expect ( () => eBus.on ( 'note', 'not a function' ) ).to.not.throw ()
        eBus.on ( 'note', () => result++ )

        eBus.emit ( 'note' )   // no "'fn is not a function'" thrown at emit

        expect ( result ).toBe ( 1 )
    })


    it ( 'once() with no fn argument is a silent no-op', () => {
        const eBus = notice ()
        let result = 0

        expect ( () => eBus.once ( 'note' ) ).to.not.throw ()
        eBus.on   ( 'note', () => result++ )

        eBus.emit ( 'note' )

        expect ( result ).toBe ( 1 )
    })


    it ( 'once() with a non-function fn is a silent no-op', () => {
        const eBus = notice ()
        let result = 0

        expect ( () => eBus.once ( 'note', 42 ) ).to.not.throw ()
        eBus.on   ( 'note', () => result++ )

        eBus.emit ( 'note' )

        expect ( result ).toBe ( 1 )
    })

}) // describe on / once input validation



}) // define