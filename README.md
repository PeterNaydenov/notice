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
    , emit  : 'Trigger a event'
    , stop  : 'Ignore event for a while'
    , start : 'Remove event from ignore list'
}
```

### Notice.on ( eventName, fn )
Register a regular event.
- **eventName**: *string*. Name of the event;
- **fn**: *function*. Behaviour that will be assigned to this eventName;
```js
  const eBus = notice ();

  eBus.on ( 'start', ([name]) => console.log ( `Hey, ${name}!` )   )   // notice that data params from emit are coming as array
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

eBus.once ( 'start', ([name]) => console.log ( `Hey, ${name}!` )   )   // notice that data params from emit is coming as array
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




### Notice.emit ( eventName, data )
Trigger the event and execute all subscribed functions.
- **eventName**: *string*. Name of the event;
- **data**(optional): *any*. 

```js
let result = 0;
const 
      eBus = notice ()
    , fn1 = ([x]) => result += 1 + x
    , fn2 = ([x]) => result += 3 + x
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
    , fn1 = ([x]) => result += 1 + x
    , fn2 = ([x]) => result += 3 + x
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
    , fn1 = ([x]) => result += 1 + x
    , fn2 = ([x]) => result += 3 + x
    ;
 eBus.on ( 'go', fn1 )
 eBus.on ( 'go', fn2 )
 eBus.stop ( 'go' )
 eBus.emit ( 'go', 2 )
// ---> result == 0
 eBus.start ( 'go', 2 )
 eBus.emit ( 'go' )
 // ---> result == 8
```


## Release History

### 1.0.1 ( 2022-08-15)
- [x] Fix: Event data is coming in Array;
- [x] Fix: Multiple instances of notice;



### 1.0.0 (2021-05-12)
- [x] Initial code;
- [x] Test package;
- [x] Documentation;
- [ ] Bug: Event data is coming in Array;
- [ ] Bug: Multiple instances of notice;






## Credits
'notice' was created and supported by Peter Naydenov.





## License
'notice' is released under the [ISC License](https://opensource.org/licenses/ISC).