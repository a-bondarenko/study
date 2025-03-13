const obj = {
  name: 'Alex',
  age: 34,

  [Symbol.iterator]: function() {
    const self = this
    const keys = Object.keys(this)

    let index = 0
    return {
      next() {
        console.log(index);
        if (index < keys.length) {
          const value = self[keys[index]]
          index++
          return { done: false, value }
        } else {
          return { done: true }

        }
      }
    }
  }
}

for (const item of obj) {
  console.log('item:', item)
}
// item: Alex
// item: 34