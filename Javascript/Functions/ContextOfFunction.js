function fn () {
  console.log(this)
}

fn() // Window

const obj = {
  name: 'foo',
  method: fn
}

console.log(obj.method()) // { name: 'foo', method: [Function: fn] }


const instance = new fn()
console.log(instance) // fn {}