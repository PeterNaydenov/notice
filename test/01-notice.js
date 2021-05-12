"use strict"

const 
      notice = require ( '../src/main' )
    , expect = require ( 'chai' ).expect
    ;

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


}) // define


