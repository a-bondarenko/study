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