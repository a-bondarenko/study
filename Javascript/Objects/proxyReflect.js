const o = {
  a: 1
}

const p = new Proxy(o, {
  get(target, prop) {
    console.log(`Hello world`)
    return target[prop]
  }
})

p.a // Hello world