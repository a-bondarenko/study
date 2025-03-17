# Functions

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

### **Clojure**
A closure is a function that remembers its outer variables and can access them. All functions in JavaScript are closures.





TODO
What is THIS
What is constructor, which part it is?

bind, call, apply
arrow functions

How does operator "new" work
https://javascript.info/constructor-new