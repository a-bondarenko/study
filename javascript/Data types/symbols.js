// Basic usage of Symbol
const id = Symbol('id');
const id2 = Symbol('id');

console.log(id === id2); // false

const user = {
  name: 'John',
  [id]: 123 // not just "id: 123"
};

console.log(user); // { name: 'John', [Symbol(id)]: 123 }

// Well-known symbols
const obj = {
  [Symbol.toStringTag]: 'MyObject'
};

console.log(obj.toString()); // [object MyObject]


obj[Symbol.toPrimitive] = function(hint) {
  return 'hello world';
}

console.log(String(obj)); // hello world


// Global symbols
const test = require('./globalSym.js');
const globalSym = Symbol.for('myGlobalSym') // Get a global symbol by key from global registry
console.log(globalSym === test.globalSym); // true
