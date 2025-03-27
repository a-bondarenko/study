const obj = {
  name: 'Alex',
  age: 34,

  [Symbol.toPrimitive](hint) {
    console.log('hint:', hint)

    switch (hint) {
      case 'string':
        return this.name
      case 'number':
        return this.age
      case 'default':
        return 'default'
    }
  }
}

console.log(String(obj)); // Alex (string hint)
console.log(+obj); // 34 (number hint)
console.log(obj + 1); // default (default hint)

const obj2 = {
  name: 'Alex',
  age: 34,

  toString() {
    return this.name
  },

  valueOf() {
    return this.age;
  }
}

console.log(String(obj2)); // Alex (use toString())
console.log(+obj2); // 34 (use valueOf())
console.log(obj2 + 1); //35 (use valueOf())
