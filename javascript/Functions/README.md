# Functions

## Function are objects
All function are objects in JavaScript

```
function fn (a) {
  console.log('Hello world')
}

console.dir(fn)

//
arguments: null
caller: null
length: 1
name: "fn"
prototype: {
  constructor: fn (a)
}
[[FunctionLocation]]: VM265:1
[[Prototype]]: ƒ ()
[[Scopes]]: Scopes[1]
```

> NOTE
> All function and classes have the `prototype` property that has a method `constructor`. The method equals to the function itself
```
fn.proto.constructor === fn // true
```

## Rest parameters
We can access rest parameters of a function using by using rest operator `...` at the end of arguments. The dots literally mean “gather the remaining parameters into an array”.

```
function rest (...args) {
  console.log(args); // [ 1, 2, 3 ]
}

rest(1, 2, 3)
```

## The “arguments” variable
There is also a special array-like object named arguments that contains all arguments by their index.
```
function argums () {
  console.log(arguments.length); // 3 (length)
  console.log(arguments[0]); // 1
  console.log(arguments[1]); // 2
  console.log(arguments[2]); // 3
}

argums(1, 2, 3)
```

> In old times, rest parameters did not exist in the language, and using arguments was the only way to get all arguments of the function. And it still works, we can find it in the old code.


> **NOTE**
> Arrow functions do not have "arguments"

## Spread syntax
Spread syntax does the opposite to `rest`. It spreads an array to different elements.

```
const arr = [1, 2, 3]
console.log(...arr); //1, 2, 3

// use in functions
argums(...arr)
```

## LE, Scope, Clojure 
**Lexical Environment** is a special object that contains local variables and reference to parental Lexical Environment.

Lexical Environment contains:

- `Environment Record` - variables, arguments of the function, this
- `[[OuterEnv]]` - reference to parental LE

LE creates when:

1. Running a script (Global Lexical Environment)
```
let x = 10;
function foo() {}

-----------------
Environment Record: { x: 10, foo: <function> }
[[OuterEnv]]: null
```

2. Execution of a function (Function Lexical Environment)
```
function outer() {
    let a = 10;
    function inner() {
        let b = 20;
        console.log(a); // finding in [[OuterEnv]]
    }
    inner();
}
outer();

---------------
Global Lexical Environment:
{ outer: <function> }
[[OuterEnv]] → null

Lexical Environment (outer):
{ a: 10, inner: <function> }
[[OuterEnv]] → Global Lexical Environment

Lexical Environment (inner):
{ b: 20 }
[[OuterEnv]] → Lexical Environment (outer)

```
This when we call `outer()` we create one LE for `outer()` and another one for `inner()` 

3. Calling a block `{..}` (Block Lexical Environment)
```
{
    let a = 50;
}
console.log(y); // ReferenceError: y is not defined

-------------
Global Lexical Environment:
[[OuterEnv]] → null

Lexical Environment:
{ a: 10 }
[[OuterEnv]] → Global Lexical Environment
```

> **NOTE**
> Since ECMAScript2021 the LexicalEnvironment component and VariableEnvironment components of an execution context are always Environment Records. [ref](https://stackoverflow.com/questions/69288356/difference-between-lexical-environments-and-environment-records-in-modern-ecmasc)

### [[Environment]] 
is a special property that keeps the reference to the Lexical Environment where the function was **created**. It's set once and forever at function **creation time**. So a function got the property, before execution. It allows it to remembers where it was created, no matter where it’s called.

### Clojure
A closure is a function that remembers its outer variables and can access them. All functions in JavaScript are closures.


## new Function
We can create a function with `new Function` syntax. The main difference is we create it from a `string`

```
let sayHi = new Function('alert("Hello")')
sayHi(); // Hello
```

As we create it as a string its `[[Environment]]` is set to reference not the current Lexical Environment, but the global one.

```
function getFunc() {
  let value = "test";

  let func = new Function('alert(value)');

  return func;
}

getFunc()(); // error: value is not defined
```

## THIS
`this` is a context of functions. It's being set each time during the calling. So the same function can have different value of `this`.

It depends on a way of calling

1. Normal calling
In this case `this` points to `Global object`

```
function fn () {
  console.log(this)
}

fn() // Window
```

2. As a method of an object
`this` points to the object

```
const obj = {
  name: 'foo',
  method: fn
}

console.log(obj.method()) // { name: 'foo', method: [Function: fn] }
```

3. Inside a constructor
`this` points to the objects that's being created

```
const instance = new fn()
console.log(instance) // fn {}
```

## Arrow functions
1. Don't have `this`
2. Don't have `arguments`
3. Can’t be called with `new`
4. Don’t have super

> NOTE
> When we use `this` inside of an arrow function it always point to `this` of the parent function where it was **created** (to `window` scope for example)
```
const outerArrFunc = () => {
  console.log(this);
}

const obj = {
  outerArrFunc,
  innerArrFunc: () => {
    console.log(this)
  },
  callArrFunc: function () {
    // No matter how we call it, it will always point to the Lexical Environment of a function where it was defined (!!!)
    outerArrFunc() // Window
    this.outerArrFunc() // Window
    this.innerArrFunc() // Window
  },
  callNormalFunc: function () {
    // As we create an arrow function inside a method, it will point to the Lexical Environment of the function
    const arrFunc = () => {
      console.log(this)
    }
    arrFunc() // obj
  }
}
```

## Bind, call, apply

### Bind
Create a new function and sets `this`

```
function fn () {
  console.log(this)
}

const newFn = fn.bind({name: 'Alex'})

newFn() // {name: alex}
```

### Call, apply
Call a function with arguments and a `this`

```
const obj = {
  name: 'Alex'
}
function fn () {
  console.log(this)
}

const newFn = fn.bind(obj)

newFn() // {name: alex}

fn.call(obj, 'arg1', 'arg2') // {name: alex}
fn.apply(obj, ['arg1', 'arg2']) // {name: alex}
```
