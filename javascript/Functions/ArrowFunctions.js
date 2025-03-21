const outerArrFunc = () => {
  console.log(this);
}

const obj = {
  name: 'foo',
  outerArrFunc,
  innerArrFunc: () => {
    console.log(this)
  },
  callArrFunc: function () {
    // No matter how you call it, it will always point to the Lexical Environment of a function where it was defined (!!!)
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
