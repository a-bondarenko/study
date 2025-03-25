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
