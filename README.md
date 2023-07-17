# Notice (@peter.naydenov/notice)

Notice is an simple event emitter. Define a behaviour related to event and then trigger the event. 

## Installation
Write in your project

```
npm install @peter.naydenov/notice
```





## How to use it
Here is simple example for using this trivial event emitter:
```js
import notice from '@peter.naydenov/notice'
const eBus   = notice ();

eBus.on ( 'note' , () => console.log ( 'hey!')   )
eBus.emit ( 'note' )
// ---> 'hey!'
```





## Methods

```js
{
      on    : 'Register a event'
    , once  : 'Register a single event'
    , off   : 'Unregister regular and single events'
    , reset : 'Remove all events and functions from the event emitter' // After version 2.1.0
    , emit  : 'Trigger a event'
    , stop  : 'Ignore event for a while'
    , start : 'Remove event from ignore list'
    , debug : 'Returns a console message on each triggered event'
}
```

### Notice.on ( eventName, fn )
Register a regular event.
- **eventName**: *string*. Name of the event;
- **fn**: *function*. Behaviour that will be assigned to this eventName;
```js
  const eBus = notice ();

  eBus.on ( 'start', name => console.log ( `Hey, ${name}!` )   )   
  eBus.emit ( 'start', 'Johny' )
// ---> Hey, Johny!
  eBus.emit ( 'start', 'Vessy' )
// ---> Hey, Vessy!
```



### Notice.once ( eventName, fn )
Register a single event.
- **eventName**: *string*. Name of the event;
- **fn**: *function*. Behaviour that will be assigned to this eventName;
```js
const eBus = notice ();

eBus.once ( 'start', name => console.log ( `Hey, ${name}!` )   )
eBus.emit ( 'start', 'Johny' )
// ---> Hey, Johny!
eBus.emit ( 'start', 'Vessy' )
// ---> null. It's a single event and can be triggered only once.
```



### Notice.off ( eventName, fn )
Remove a behaviour(function) related to the event. If 'fn' is not provided, all behaviours related to this event will be removed. Function works with all types of event ( regular and single )
- **eventName**: *string*. Name of the event;
- **fn**(optional): *function*. Behaviour that will be assigned to this eventName;
```js
let result = 0;
const 
      eBus = notice ()
    , fn1 = () => result += 1
    , fn2 = () => result += 3
    , fn3 = () => result += 20
    ;

 eBus.on ( 'go', fn1 )
 eBus.on ( 'go', fn2 )
 eBus.emit ( 'go' )
// ---> result == 4
 eBus.off ( 'go', fn2 )   // fn2 is unsubscribed
 eBus.emit ( 'go' )       // Only fn1 is subscibed.
// ---> result == 5

 eBus.on ( 'go', fn2 )
 eBus.on ( 'go', fn3 )
 // All functions are subscribed now
 eBus.off ( 'go' )       // Unsubscribe the event
 eBus.emit ( 'go' )
 // ---> result == 5. Nothing changed
```

### Notice.reset ( )
Will remove all events and functions from the event emitter.
```js
let result = 0;
const 
      eBus = notice ()
    , fn1 = () => result += 1
    , fn2 = () => result += 3
    , fn3 = () => result += 20
    ;

 eBus.on ( 'go', fn1 )
 eBus.on ( 'go', fn2 )
 eBus.on ( 'load', fn3 )
 eBus.reset () // Remove all events and functions
 eBus.emit ( 'go' )
 eBus.emit ( 'load' )
// ---> result == 0
```


### Notice.emit ( eventName, data )
Trigger the event and execute all subscribed functions.
- **eventName**: *string*. Name of the event;
- **data**(optional): *any*. 

```js
let result = 0;
const 
      eBus = notice ()
    , fn1 = x => result += 1 + x
    , fn2 = x => result += 3 + x
    ;
 eBus.on ( 'go', fn1 )
 eBus.on ( 'go', fn2 )
 eBus.emit ( 'go', 2 )
// ---> result == 8
```





### Notice.stop ( eventName )
Disable specified event.
- **eventName**: *string*. Name of the event;

```js
let result = 0;
const 
      eBus = notice ()
    , fn1 = x => result += 1 + x
    , fn2 = x => result += 3 + x
    ;
 eBus.on ( 'go', fn1 )
 eBus.on ( 'go', fn2 )
 eBus.stop ( 'go' )     // Functions are still subscribed but event is muted
 eBus.emit ( 'go', 2 )
// ---> result == 0
```





### Notice.start ( eventName )
Enable again specified event.
- **eventName**: *string*. Name of the event;

```js
let result = 0;
    const 
          eBus = notice ()
        , fn1 = x => result += 1 + x
        , fn2 = x => result += 3 + x
        ;
     eBus.on ( 'go', fn1 )
     eBus.on ( 'go', fn2 )
     eBus.stop ( 'go' )
     eBus.emit ( 'go', 2 )
    // ---> result == 0
     eBus.start ( 'go' )
     eBus.emit ( 'go', 1 )
     console.log ( result )
     // ---> result == 6 
```


### Notice.debug ( state, label )
Provide debug message on each event. By default is debug is 'off'.

```js
// Turn debug "on"
eBus.debug ( true )

// Turn debug "off"
eBus.debug ( false )

// Activate debugger and set a debug message prefix
eBus.debug ( true, '[eBus]:' )
eBus.emit ( 'dummy' )
// --> [eBus]: Event "dummy" was triggered.
```



## External Links

- [History of changes](https://github.com/PeterNaydenov/notice/Changelog.md)
- [MIT License](https://github.com/PeterNaydenov/notice/LICENSE)




## Credits
'notice' was created and supported by Peter Naydenov.





## License
'notice' is released under the [ISC License](https://opensource.org/licenses/ISC).