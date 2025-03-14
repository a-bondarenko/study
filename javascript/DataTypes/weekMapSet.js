let obj = {name: 'Alex'}

const map = new Map().set(obj, 'some value')

obj = undefined

console.log(obj) // undefined
console.log(map.keys()) // { { name: 'Alex' } }

let obj2 = {name: 'Alex'}

const weekMap = new WeakMap().set(obj2, 'some value')

obj2 =  undefined

console.log(weekMap.get(obj2)); // undefined

