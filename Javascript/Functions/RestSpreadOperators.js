function rest (...args) {
  console.log(args); // [ 1, 2, 3 ]
}

rest(1, 2, 3)

function argums () {
  console.log(arguments.length); // 3 (length)
  console.log(arguments[0]); // 1
  console.log(arguments[1]); // 2
  console.log(arguments[2]); // 3
}

argums(1, 2, 3)

const arr = [1, 2, 3]
console.log(...arr); //1, 2, 3

// use in functions
argums(...arr)


