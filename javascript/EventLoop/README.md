# Event Loop
Javascript is a single-threaded language. It can execute only one task at a time. The event loop concept of an endless loop, where the JavaScript engine waits for tasks, executes them and then sleeps, waiting for more tasks.

![image](https://github.com/user-attachments/assets/9fd8f10c-b89b-4822-8955-d6fc32dcee33)


The algorithm:
Execute synchronous code until Call Stack is empty.

Then:
1. Run all Microtasks.
2. Rerender the UI (if it needs).
3. Run the oldest (one) Task from the Task Queue.
4. Repeat from step 1.

```
console.log(1); //  Sync execution

setTimeout(() => {
  console.log(4); // Run one task from the task queue

  setTimeout(() => {
    console.log(6); // Register another task in the task queue
  }, 0);

  Promise.resolve().then(() => {
    console.log(5); // Run all microtasks
  })

}, 0);

Promise.resolve().then(() => {
  console.log(3); // Run all microtasks
})

console.log(2); //  Sync execution
```

[Sand box](https://www.jsv9000.app/)

## WebAPI
A web API is an application programming interface for either a web server or a web browser. 
![image](https://github.com/user-attachments/assets/f898de52-3cad-4ea4-aca6-d9a4561665c2)

[See full](https://developer.mozilla.org/en-US/docs/Web/API)

## Heep
https://youtu.be/5OJRqkYbK-4

## Reflow/Repaint
// TODO

## Request Animation Frame
// TODO
