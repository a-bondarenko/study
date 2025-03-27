const obj = {
  a: 1
}

obj.__proto__.b = 2

console.log(obj.hasOwnProperty('a')) // true
console.log(obj.hasOwnProperty('b')) // false
console.log('b' in obj); // true
