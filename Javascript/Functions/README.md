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

### Losing this
When we call a method separately from the object, we lose `this`

```
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(user.sayHi, 1000); // Hello, undefined!
```

To solve it we can use either a `wrapper` or method `.bind()`

```
const user = {
  name: 'John',
  sayHi() {
    alert(this.name);
  }
};

setTimeout(user.sayHi, 1000); // Error!
// The error occurs because setTimeout requires a function and not a method.
// So, the method loses the context this.
// To fix it, you can use a wrapper function that calls the method with the right context:
setTimeout(() => user.sayHi(), 1000); // John
// Or use bind:
setTimeout(user.sayHi.bind(user), 1000); // John
```

#### Reference Type
The things is JavaScript uses a special `Reference Type` to store methods in an object. 
The value of Reference Type is a three-value combination (base, name, strict), where:

1. base is the object.
2. name is the property name.
3. strict is true if use strict is in effect.
```
// Reference Type value
(user, "sayHi", true)
```

When parentheses `()` are called on the `Reference Type`, they receive the full information about the object and its method, and can set the right this (user in this case). 
But when any other operation like assignment `hi = user.sayHi` discards the reference type as a whole, takes the value of user.hi (a function) and passes it on. So any further operation “loses” this.  
So, as the result, the value of this is only passed the right way if the function is called directly using a dot `obj.method()` or square brackets `obj['method']()` syntax (they do the same here). There are various ways to solve this problem such as `func.bind()`.

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

## Generators
Generators in JavaScript are special functions that allow you to pause and resume execution, making them useful for handling asynchronous operations, lazy evaluation, and iterators.

```
function* simpleGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

const gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

### When to Use Generators
1. When you need on-demand execution (lazy evaluation).
2. When implementing custom iterators.
3. When handling sequences of async operations.
4. When you want pause/resume functionality in execution.

### Usage of generators

1. Implementing Iterators
```
function* countDown(start) {
    while (start > 0) {
        yield start--;
    }
}

const counter = countDown(5);
console.log([...counter]); // [5, 4, 3, 2, 1]
```

2. Lazy Evaluation
```
function* infiniteNumbers() {
    let num = 1;
    while (true) {
        yield num++;
    }
}

const numbers = infiniteNumbers();
console.log(numbers.next().value); // 1
console.log(numbers.next().value); // 2

```

3. Fetching stream data
For instance, GitHub allows us to retrieve commits in the same, paginated fashion:

- We should make a request to fetch in the form https://api.github.com/repos/#{repo}/commits.
- It responds with a JSON of 30 commits, and also provides a link to the next page in the Link header.
- Then we can use that link for the next request, to get more commits, and so on.

```
async function* fetchCommits(repo) {
  let url = `https://api.github.com/repos/${repo}/commits`;

  while (url) {
    const response = await fetch(url, { // (1)
      headers: {'User-Agent': 'Our script'}, // github needs any user-agent header
    });

    const body = await response.json(); // (2) response is JSON (array of commits)

    // (3) the URL of the next page is in the headers, extract it
    let nextPage = response.headers.get('Link').match(/<(.*?)>; rel="next"/);
    nextPage = nextPage?.[1];

    url = nextPage;

    for(let commit of body) { // (4) yield commits one by one, until the page ends
      yield commit;
    }
  }
}

for await (let commit of fetchCommits("username/repository")) {
  // process commit
}
```

## Currying
Currying is a transformation of functions that translates a function from callable as f(a, b, c) into callable as f(a)(b)(c).

```
function curry(f) { // curry(f) does the currying transform
  return function(a) {
    return function(b) {
      return f(a, b);
    };
  };
}

// usage
function sum(a, b) {
  return a + b;
}

let curriedSum = curry(sum);

alert( curriedSum(1)(2) ); // 3
```

### Why Use Currying?
1. Partial Application  
You can create reusable functions with preset arguments.
```
const multiply = a => b => a * b;
const double = multiply(2);
console.log(double(5)); // Output: 10

```

2. Function Composition  
Currying helps in composing multiple functions together, making the code more modular and reusable.
3. Avoiding Repetition  
If certain arguments remain the same across function calls, you can partially apply the function.
```
const greet = greeting => name => `${greeting}, ${name}!`;
const sayHello = greet("Hello");
console.log(sayHello("Alex")); // Output: Hello, Alex!

```
4. Improved Readability and Maintainability  
When dealing with higher-order functions, currying makes the logic more readable and expressive.
5. Useful in Functional Programming & Middleware  
Currying is often used in Redux (middleware), Ramda, Lodash for functional composition.