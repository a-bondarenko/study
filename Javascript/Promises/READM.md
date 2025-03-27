# Promises

Promises are the main tool to provide asynchronous code.

The constructor syntax for a promise object is:
```
const promise = new Promise((resolve, reject) => {
  // executor code
})
```

The promise has 3 states:
1. `pending` - until resolve callback is called
2. `fulfilled` - after resolve callback was called
3. `rejected` - after reject callback was called

![image](https://github.com/user-attachments/assets/e494e1f0-5a4b-4243-8175-20c300be8227)

> **State of a promise can be changed only once!**

## Then, Catch

Then/catch/finally are consuming function that subscribe on changing of promise state. They register an anonymous function that will be called after promise changes its state. The function will be add to microtasks queue

```
const promise = new Promise((resolve, reject) => {
  console.log(1); // synchronous

  setTimeout(() => {
    resolve(3);
  }, 5000);
})

promise.then(result => {
  console.log(result); 3
})

promise.catch(error => {  
  console.log(error);
})

promise.finally(() => {
  console.log('Promise is settled')
})

console.log(2) // synchronous
```

Every `then / catch / finally` returns a new promise.

```
.then(() => {
  return 'result'
})
```
equals to
```
.then(() => {
  return new Promise.resolve('result')
})
```

## Error handling
The code of a promise executor and promise handlers has an “invisible try..catch” around it. If an exception happens, it gets caught and treated as a rejection.

```
new Promise((resolve, reject) => {
  throw new Error("Whoops!");
}).catch(alert); // Error: Whoops!
```

The “invisible try..catch” around the executor automatically catches the error and turns it into rejected promise.

```
new Promise((resolve, reject) => {
  try {
    //
  } catch {
    reject(new Error("Whoops!");)
  }
}).catch(alert); // Error: Whoops!
```

> try..catch works synchronously so the following code won't work

```
new Promise(function(resolve, reject) {
  setTimeout(() => {
    throw new Error("Whoops!"); // To late, executor has already ended
  }, 1000);
}).catch(alert);
```

## Async/await
There’s a special syntax to work with promises in a more comfortable fashion, called “async/await”. It’s surprisingly easy to understand and use.

The word “async” before a function means one simple thing: a function always returns a promise. Other values are wrapped in a resolved promise automatically.
```
async function f() {
  return 1;
}
```
equals to:
```
function f() {
  return Promise.resolve(1);
}

f().then(console.log); // 1
```

### Await
Works only inside async functions. 

`await` as well as `then` does following things:
1. Checks if returning object `thenable` and wraps it into `Promise.resolve()`
2. Calls method `then` from the object with `resolve, reject` arguments
3. Waits until one of callbacks are executed

> `Thenable` is an object that contains `then` method

If `await` gets a non-Promise value, it just returns the value immediately

```
const thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
}

async function asyncFunc() {
  const result = await thenable
  console.log(result) // 42
}
```

## Promise API
1. `Promise.all(promises)` – waits for all promises to resolve and returns an array of their results. If any of the given promises rejects, it becomes the error of Promise.all, and all other results are ignored.
2. `Promise.allSettled(promises)` (recently added method) – waits for all promises to settle and returns their results as an array of objects with:
- status: "fulfilled" or "rejected"
- value (if fulfilled) or reason (if rejected).
3. `Promise.race(promises)` – waits for the first promise to settle, and its result/error becomes the outcome.
4. `Promise.any(promises)` (recently added method) – waits for the first promise to fulfill (and ignores rejected promises), and its result becomes the outcome. If all of the given promises are rejected, AggregateError becomes the error of AggregateError
5. `Promise.resolve(value)` – makes a resolved promise with the given value.
6. `Promise.reject(error)` – makes a rejected promise with the given error.

### Purpose of Promise.resolve() and Promise.reject()
These methods are used to quickly create resolved or rejected Promises, which can be useful for:

- Providing default resolved values
- Converting values into Promises
- Handling errors in a Promise-based flow



