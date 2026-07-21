import notice from '../src/main.js'
import { describe, it, expect, vi } from 'vitest'



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
        , count = 0
        ;

    eBus.on ( 'first'  , () => result+=1  )
    eBus.on ( 'second', () => result+= 3 )
    eBus.on ( '*'     , e => {
                            expect (['first','second']).toContain ( e )
                            count++    
                    })

    eBus.emit ( 'first' )
    eBus.emit ( 'second' )
    expect ( result ).toBe ( 4 )
    expect ( count ).toBe ( 2 )
}) // it listen with wildcard



it ( 'Listen and emit with wildcard', () => {
    const eBus = notice ();
    let result = 0;

    eBus.on ( 'first'  , () => result+=1  )
    eBus.on ( 'second', () => result+= 3 )
    eBus.on ( '*'     , e => {
                            expect (e).toBe ( '*' )
                            result+=10 
                    })
    eBus.emit ( '*' )
    expect ( result ).toBe ( 24 )
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
    eBus.on  ( 'note' , a => expect (a).toBe ( 12 )   )    
    eBus.emit ( 'note', 12 )
}) // it Event with primitive data



it ( 'Event with object', () => {
    const eBus = notice ();
    eBus.on  ( 'note' , a => expect ( a['val'] ).toBe ( 12 )   )    
    eBus.emit ( 'note', {val:12} )
}) // it Event with primitive data



it ( 'Event with two values', () => {
    const eBus = notice ();
    eBus.on  ( 'note' , (str,a) => {
                    expect ( str ).toBe ( 'test' )
                    expect (a.val).toBe ( 12 )
                })    
    eBus.emit ( 'note', 'test', {val:12} )
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

    eBus1.on ( 'test', x => expect ( x ).toBe ( 12 )   )
    eBus2.on ( 'test', x => expect ( x ).toBe ( 73 )   )
    eBus1.emit ( 'test', 12 )
    eBus2.emit ( 'test', 73 )
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




// ============================================================================
// Regression: a throwing subscriber used to abort the whole `emit()` chain
// and propagate the error to the caller, silently skipping every subscriber
// registered after the failing one. Each subscriber call is now wrapped in
// try/catch, errors are logged to `console.error`, and `emit` continues.
// ============================================================================

describe ( 'Subcriber error isolation', () => {

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
        eBus.on ( 'note', () => result += 10 )

        eBus.emit ( 'note' )   // must not throw

        expect ( result ).toBe ( 11 )
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