# Async Stream Generator  Problem

## Context

Assume there is a *data stream* that is producing values.
There is a factory function available that takes a handler function
```
async function makeStream(handler) {
    ...
}
```

The handle function will provide a payload representing a value produced from the stream.
```
var handler = function(payload){
}
```

## The Goal
We want to consume the stream data event in a generator used in transformation pipeline.

## Background
One form of a generators is the following
```
var generator = async function* () {
    var value
    while(true){
        value = await new Promise((resolve)=>{
                value = ... // some functionality
                resolve(value)
        })
        yield value
    }
}
```

## The Problem

For the stream  we need to provide a callback.
For the generator we need to resolve the promise when the handler is invoked.
We want to be able to write code something like the following:
```
function makeCallbackGenerator() {
    var handler
    var generator = async function* test() {
        while(true){
            var value = await new Promise((resolve)=>{
                handler = function(payload){
                    resolve(payload)
                }
            })
            yield value
        }
    }
    return {
        handler,
        generator
    }
}
```
This is a factory function
which produces
- a generator
- a callback

The callback is needed to be passed into the stream.
The generator is required to pass into the transformation pipeline.

But this declaration isnt right.
We dont want to define the function on each iteration of the promise, instead we want to use the function to resolve the promise on each iteration.

The fundamental problem is how to define the callback within the promise so that the stream can be coupled to the generator.

But how can we do this???

----
A work around is to use a buffer between the stream and the generator.
```
function makeCallbackGenerator() {
    var buffer = []
    var handler = function(payload){
        buffer.push(payload)
        return 1//consumed
    }
    var start = async function* () {
        while(true){
            if(buffer.length>0){
                var next = buffer.pop()
                debug("Generator yield")
                yield next
            }else {
                await new Promise((resolve)=>{
                    setTimeout(()=>resolve(),1000)
                })
            }
        }
    }
    return {
        handler, start
    }
}
```
Is there a simpler way to achieve this without a buffer?

-----

The working workaround code is committed into this repository and can be run with
```npm start```
