const obj = {
  name: 'Alex'
}
function fn () {
  console.log(this)
}

const newFn = fn.bind(obj)

newFn() // {name: alex}

fn.call(obj, 'arg1', 'arg2') // {name: alex}
fn.apply(obj, ['arg1', 'arg2']) // {name: alex}