"use strict"

import notice from '../src/main.js'
import { expect } from 'chai'





describe ( 'Testing Notice', () => {



it ( 'Standard event', () => {
    const eBus = notice ();
    let result = 0;
    eBus.on ( 'note', () => result += 1 )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).to.be.equal ( 2 )
}) // it standard



it ( 'Single event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.once ( 'note', () => result += 1 )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).to.be.equal ( 1 )
}) // it single


it ( 'Many subscribers for single event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.once ( 'note', () => result += 1 )
    eBus.once ( 'note', () => result += 3 )
    eBus.emit ( 'note'  )
    eBus.emit ( 'note'  )
    expect ( result ).to.be.equal ( 4 )
}) // it single


it ( 'Remove standard event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.on   ( 'note', () => result += 1 )
    eBus.off ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).to.be.equal ( 0 )
}) // it remove std event



it ( 'Remove single event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.once ( 'note', () => result += 1 )
    eBus.off ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).to.be.equal ( 0 )
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
    expect ( result ).to.be.equal ( 0 )
}) // it reset the emitter


it ( 'Stop and resume standard event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.on ( 'note', () => result += 1 )
    eBus.stop ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).to.be.equal ( 0 )
    eBus.start ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).to.be.equal ( 1 )
}) // it stop and resume std event




it ( 'Stop and resume single event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.once ( 'note', () => result += 1 )
    eBus.stop ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).to.be.equal ( 0 )
    eBus.start ( 'note' )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).to.be.equal ( 1 )
}) // it stop and resume single event


it ( 'Emit with wildcard', () => {
    const eBus = notice ();
    let result = 0;

    eBus.on ( 'first'  , () => result+=1  )
    eBus.on ( 'second', () => result+= 3 )

    eBus.emit ( '*' )
    expect ( result ).to.be.equal ( 4 )
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
                            expect (['first','second']).to.include ( e )
                            count++    
                    })

    eBus.emit ( 'first' )
    eBus.emit ( 'second' )
    expect ( result ).to.be.equal ( 4 )
    expect ( count ).to.be.equal ( 2 )
}) // it listen with wildcard



it ( 'Listen and emit with wildcard', () => {
    const eBus = notice ();
    let result = 0;

    eBus.on ( 'first'  , () => result+=1  )
    eBus.on ( 'second', () => result+= 3 )
    eBus.on ( '*'     , e => {
                            expect (e).to.be.equal ( '*' )
                            result+=10 
                    })
    eBus.emit ( '*' )
    expect ( result ).to.be.equal ( 24 )
}) // it listen and emit with wildcard



it ( 'Stop and start with wildcard', () => {
    const eBus = notice ();
    let result = 0;

    eBus.on ( 'first'  , () => result+=1  )
    eBus.on ( 'second', () => result+= 3 )

    eBus.stop ( '*' )
    eBus.emit ( 'first' )
    eBus.emit ( 'second' )
    expect ( result ).to.be.equal ( 0 )
    eBus.start ( '*' )
    eBus.emit ( 'first' )
    eBus.emit ( 'second' )
    expect ( result ).to.be.equal ( 4 )
}) // it stop with wildcard



it ( 'Wildcard with a stopped event', () => {
    const eBus = notice ();
    let result = 0;

    eBus.on ( 'first'  , () => result+=1  )
    eBus.on ( 'second', () => result+= 3 )

    eBus.stop ( 'second' )
    eBus.emit ( '*' )
    expect ( result ).to.be.equal ( 1 )

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
    expect ( result ).to.be.equal ( 8 )
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
    expect ( result ).to.be.equal ( 0 )
}) // it unsibsribe a function



it ( 'Unsubscribe all functions for the event', () => {
    const eBus = notice ();
    let result = 0;

    const fn3 = () => result += 20;

    eBus.on  ( 'note' , fn3 )
    eBus.off ( 'note' , fn3 )
    eBus.emit ( 'note' )
    eBus.emit ( 'note' )
    expect ( result ).to.be.equal ( 0 )
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
    expect ( result ).to.be.equal ( 40 )
}) // it unsibsribe a function



it ( 'Event with primitive data', () => {
    const eBus = notice ();
    eBus.on  ( 'note' , a => expect (a).to.be.equal ( 12 )   )    
    eBus.emit ( 'note', 12 )
}) // it Event with primitive data



it ( 'Event with object', () => {
    const eBus = notice ();
    eBus.on  ( 'note' , a => expect ( a['val'] ).to.be.equal ( 12 )   )    
    eBus.emit ( 'note', {val:12} )
}) // it Event with primitive data



it ( 'Event with two values', () => {
    const eBus = notice ();
    eBus.on  ( 'note' , (str,a) => {
                    expect ( str ).to.be.equal ( 'test' )
                    expect (a.val).to.be.equal ( 12 )
                })    
    eBus.emit ( 'note', 'test', {val:12} )
}) // it Event with primitive data



it ( 'Multiple Notice instances', () => {
    const
         eBus1 = notice ()
       , eBus2 = notice ()
       ;

    eBus1.on ( 'test', x => expect ( x ).to.be.equal ( 12 )   )
    eBus2.on ( 'test', x => expect ( x ).to.be.equal ( 73 )   )
    eBus1.emit ( 'test', 12 )
    eBus2.emit ( 'test', 73 )
}) // it Multiple Notice instances



}) // define


