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

/// Thenable object
const thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
}

async function asyncFunc() {
  const result = await thenable
  console.log(result) // 42
}

asyncFunc()

// Unhandled promise rejection
new Promise((resolve, reject) => {
  reject(new Error('Error'));
})

// Callback to promise
function fetchData(callback) {
  setTimeout(() => {
    callback(null, 'Data loaded');
  }, 1000);
}

async function fetchDataAsync() {
  return new Promise((resolve, reject) => {
    fetchData((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// Multiple promises
const multiple = new Promise((resolve, reject) => {
  resolve(1);
})

multiple.then(result => console.log(result)) // 1
multiple.then(result => console.log(result)) // 1
multiple.then(result => console.log(result)) // 1

// Promise chaining
multiple.then(result => result + 1)
  .then(result => result + 1)
  .then(result => console.log(result)) // 3
