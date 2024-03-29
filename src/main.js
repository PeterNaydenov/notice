"use strict"
function notice () {
    function Notice () {
                    let 
                          scroll     = {'*':[]}  // General events with their subscribers
                        , scrollOnce = {}  // Single events with their subscribers
                        , ignore     = []  // Ignore event names ( general and single )
                        , debugFlag  = false 
                        , debugHeader = ''
                        ;
                    function on ( e, fn ) {
                            if ( !scroll[e] ) scroll[e] = []
                            scroll[e].push ( fn )
                        } // on func.
                    function once ( e, fn ) {
                            if ( e === '*' )   return  // The wildcard '*' doesn't work for 'once' events
                            if ( !scrollOnce[e] )   scrollOnce[e] = []
                            scrollOnce[e].push ( fn )
                        } // once func.
                    function off ( e, fx ) {
                            if ( fx ) {   // fx is optional
                                    if ( scroll[e]     )  scroll[e]     = scroll[e].filter     ( fn => fn !== fx )
                                    if ( scrollOnce[e] )  scrollOnce[e] = scrollOnce[e].filter ( fn => fn !== fx )
                                    if ( scroll[e] && scroll[e].length         === 0 )   delete scroll[e]
                                    if ( scrollOnce[e] && scrollOnce[e].length === 0 )   delete scroll[e]
                                    return
                                }
                            if ( scrollOnce[e] )   delete scrollOnce[e]
                            if ( scroll[e]     )   delete scroll[e]
                        } // off func.
                    function reset () {
                            scroll     = {'*':[]}
                            scrollOnce = {}
                            ignore     = []
                        } // reset func.
                    function debug ( val, header ) {
                            debugFlag =  val ? true : false
                            if ( header && (typeof header === 'string') )   debugHeader = header
                        } // debug func.
                    function emit () {
                            const [ e, ...args ] = arguments
                            if ( debugFlag ) {  
                                        console.log ( `${debugHeader} Event "${e}" was triggered.`)
                                        if ( args.length > 0 ) {
                                            console.log ( 'Arguments:')
                                            console.log ( ...args )
                                            console.log ( '^----' )
                                        }
                                        
                                }

                            function exeCallback ( name ) {
                                        let stopped = false;
                                        if ( name === '*' )   return    
                                        if ( ignore.includes(name) )   return
                                        scroll[name].every ( fn => {
                                                            const r = fn ( ...args );
                                                            if ( typeof(r) !== 'string'     )   return true
                                                            if ( r.toUpperCase() === 'STOP' ) {  
                                                                                                stopped = true
                                                                                                return false
                                                                                    }
                                                            return true
                                                        })
                                        if ( !stopped )   scroll['*'].forEach ( fn => fn(e,...args)   )
                                } // exeCallback func.

                            if ( e === '*' ) {   // The wildcard '*' doesn't work for 'once' events
                                        let evNames = Object.keys ( scroll )
                                        evNames.forEach ( name => exeCallback(name)   )
                                        return
                                }
                            if ( scrollOnce[e] ) {
                                        if ( ignore.includes(e) )   return
                                        scrollOnce[e].forEach ( fn => fn(...args)   )
                                        delete scrollOnce[e]
                                }
                            if ( scroll[e]     ) { 
                                        exeCallback ( e )
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
                                , reset // Unregister all events
                                , emit  // Trigger a event
                                , stop  // Ignore event for a while
                                , start // Remove event from ignore list
                                , debug
                        }
        } // notice fn.
    return new Notice ()
}



export default notice


