"use strict"
function notice () {
    function Notice () {
                    let 
                          scroll     = {}  // General events with their subscribers
                        , scrollOnce = {}  // Single events with their subscribers
                        , ignore     = []  // Ignore event names ( general and single )
                        ;
                    function on ( e, fn ) {
                            if ( !scroll[e] ) scroll[e] = []
                            scroll[e].push ( fn )
                        } // on func.
                    function once ( e, fn ) {
                            if ( !scrollOnce[e] )   scrollOnce[e] = []
                            scrollOnce[e].push ( fn )
                        } // once func.
                    function off ( e, fx ) {
                            if ( fx ) {   // fx is optional
                                    if ( scroll[e]     )  scroll[e]     = scroll[e].filter     ( fn => fn !== fx )
                                    if ( scrollOnce[e] )  scrollOnce[e] = scrollOnce[e].filter ( fn => fn !== fx )
                                    if ( scroll[e] && scroll[e].length         === 0 )   delete scroll[e]
                                    if ( scrollOnce[e] && scrollOnce[e].length === 0 )   delete scroll[e]
                                    return
                                }
                            if ( scrollOnce[e] )   delete scrollOnce[e]
                            if ( scroll[e]     )   delete scroll[e]
                        } // off func.
                    function emit () {
                            const [ e, ...args ] = arguments
                            if ( e == '*' ) {   // The wildcard '*' doesn't work for 'once' events
                                    let evNames = Object.keys ( scroll )
                                    evNames.forEach ( name => {
                                                    if ( ignore.includes(name) )   return
                                                    scroll[name].forEach ( fn => fn(...args))
                                            })
                                }
                            if ( scrollOnce[e] ) {
                                        if ( ignore.includes(e) )   return
                                        scrollOnce[e].forEach ( fn => fn(...args)   )
                                        delete scrollOnce[e]
                                }
                            if ( scroll[e]     )  {  
                                        if ( ignore.includes(e) ) return
                                        scroll[e].forEach ( fn => fn(...args)   )                
                                }                
                        } // emit func.
                    function start ( e ) {
                            if ( e === '*' ) {  
                                        ignore = []
                                        return
                                }
                            ignore = ignore.filter ( type => e != type )
                        } // start func.
                    function stop ( e ) {
                            if ( e === '*' ) {
                                        const 
                                              evNames     = Object.keys ( scroll )
                                            , evOnceNames = Object.keys ( scrollOnce )
                                            ;
                                        ignore = [ ...evOnceNames, ...evNames ]
                                        return
                                }
                            ignore.push ( e )
                        } // stop func.

                    return {
                                  on    // Register a event
                                , once  // Register a single event 
                                , off   // Unregister regular and single events
                                , emit  // Trigger a event
                                , stop  // Ignore event for a while
                                , start // Remove event from ignore list
                        }
        } // notice fn.
    return new Notice ()
}



module.exports = notice


