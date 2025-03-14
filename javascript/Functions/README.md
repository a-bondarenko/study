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


TODO
What is THIS
What is constructor, which part it is?
What is LE, Scope, Clojure 
https://stackoverflow.com/questions/69288356/difference-between-lexical-environments-and-environment-records-in-modern-ecmasc

bind, call, apply
arrow functions

How does operator "new" work
https://javascript.info/constructor-new