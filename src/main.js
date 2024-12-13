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
                    /**
                     *  Register a regular event.
                     *  @param {string} e - Name of the event;
                     *  @param {function} fn - Behaviour that will be assigned to this eventName;
                     *  @returns void
                     */
                    function on ( e, fn ) {
                            if ( !scroll[e] ) scroll[e] = []
                            scroll[e].push ( fn )
                        } // on func.

                    /**
                     * Register a single event that will be triggered only once.
                     * @param {string} e - Name of the event; the wildcard '*' is not supported.
                     * @param {function} fn - Behaviour that will be executed when the event is triggered.
                     */
                    function once ( e, fn ) {
                            if ( e === '*' )   return  // The wildcard '*' doesn't work for 'once' events
                            if ( !scrollOnce[e] )   scrollOnce[e] = []
                            scrollOnce[e].push ( fn )
                        } // once func.
                    /**
                     * Remove a behavior (function) related to the specified event.
                     * If 'fx' is provided, only that specific function will be removed from the event.
                     * If 'fx' is not provided, all functions related to the event will be removed.
                     * Works with both regular and single events.
                     * 
                     * @param {string} e - Name of the event.
                     * @param {function} [fx] - Optional. The specific function to be removed.
                     */
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
                    /**
                     * Resets all event-related data structures.
                     * Clears all general and single event subscriptions, as well as the ignore list.
                     */
                    function reset () {
                            scroll     = {'*':[]}
                            scrollOnce = {}
                            ignore     = []
                        } // reset func.
                    /**
                     *  Enables or disables debug mode.
                     *  In debug mode, every triggered event prints a message to the console, including the event name and arguments.
                     *  The header argument is optional and can be used to provide a prefix string for the debug message.
                     *  @param {boolean} val - Enable or disable debug mode.
                     *  @param {string} [header] - Optional. The header string for the debug message.
                     *  @returns void
                     */
                    function debug ( val, header ) {
                            debugFlag =  val ? true : false
                            if ( header && (typeof header === 'string') )   debugHeader = header
                        } // debug func.
                    /**
                     * Triggers an event and executes all associated functions.
                     * 
                     * @param {string} e - Name of the event to be triggered.
                     * @param {...*} [args] - Optional. Arguments to be passed to the callback functions.
                     * @returns void
                     */
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
                                        if ( !stopped )   scroll['*'].forEach ( fn => fn(e,...args)  )
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
                    /**
                     * Enables again specified event.
                     * 
                     * @param {string} e - Name of the event to be enabled again; the wildcard '*' is supported.
                     * @returns void
                     */
                    function start ( e ) {
                            if ( e === '*' ) {  
                                        ignore = []
                                        return
                                }
                            ignore = ignore.filter ( type => e != type )
                        } // start func.
                    /**
                     * Temporarily disables specified event.
                     * 
                     * @param {string} e - Name of the event to be disabled; the wildcard '*' is supported.
                     * @returns void
                     */
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
    return Notice ()
}



export default notice


