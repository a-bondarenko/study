'use strict'; // to show Error, otherwise errors will be silently ignored
const obj = {
  name: 'Alex'
}

Object.defineProperty(obj, 'age', {
  value: 34,
  writable: false,
  enumerable: false,
  configurable: false
})
console.log(obj); // { name: 'Alex' } because of enumerable: false for "age"
console.log(obj.age); // 34

// Error
obj.age = 35
// Error
delete obj.age

