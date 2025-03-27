# Objects
Objects are associative arrays with several special features.

## Operator "new"
We can create an object using `new` operator

```
function User(name) {
  this.name  = name
}

сonst user = new User('Alex')
```

**What's happening here?**
1. A new object is being created, that has `[[Prototype]]` will be set as `User.prototype`
2. The method `User.prototype.constructor` is calling
3. The constructor returns the object from point 1

```
console.log(user)
{
  name: "Alex"
  [[Prototype]]: {
    constructor: ƒ User(name)
    [[Prototype]]: Object
  }
}
```

### Ordered properties
JavaScript sorts an object`s properties in case they can be converted into integer. Others appear in creation order.

```
const obj = {
  'C': 1,
  '2': 1,
  '1': 1,
  'B': 1,
  'A': 1
}

console.log(Object.keys(obj)); // [ '1', '2', 'C', 'B', 'A' ]
```

### Cloning and merging

### Shallow
The` Object.assign()` static method copies all enumerable own properties from one or more source objects to a target object. It returns the modified target object.
**It does not copy property descriptors**

```
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// Expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget === target);
// Expected output: true
```

We can also use the spread syntax `clone = {...user}`.

**To clone properties with descriptors we can use**
`Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));`


### Deep
For deep cloning is used [the structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) method of the Window interface that creates a deep clone of a given value using the structured clone algorithm.
**It does not copy property descriptors**
```
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

let clone = structuredClone(user);

console.log(user.sizes === clone.sizes); // false, different objects
```

The structuredClone method can clone most data types, such as objects, arrays, primitive values including circular references, when an object property references the object itself. But it doesn't clone methods of the object, whereas `_.cloneDeep()` of `lodash` does

```
const o = {
  a: 1,
  f: () => {
    return 'Hello'
  }
}

// error
const clone1 = structuredClone(o);

// Ok
const clone2 = _.cloneDeep(o)
console.log(clone2.f())
```

## Object to primitive conversion
When we try coerce objects to a primitive types (E.g. (obj + 'str') or (+obj)) the following algorithm happens:

1. Call `obj[Symbol.toPrimitive](hint)` if the method exists,
2. Otherwise if hint is "`string`"
try calling `obj.toString()` or `obj.valueOf()`, whatever exists.
3. Otherwise if hint is "`number`" or "`default`"
try calling `obj.valueOf()` or `obj.toString()`, whatever exists.

```
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
```

or we can just rewrite `toString` and `valufeOf` methods. The algorithm is the same above
```
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
```


## Property flags and descriptors
Object properties, besides a value, have three special attributes (so-called “flags”):

- `writable` – if true, the value can be changed, otherwise it’s read-only.
- `enumerable` – if true, then listed in loops, otherwise not listed.
- `configurable` – if true, the property can be deleted and these attributes can be modified, otherwise not.

```
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
```

### Methods
`Object.getOwnPropertyDescriptors(obj)`

`Object.getOwnPropertyDescriptor(obj, propertyName)`

`Object.defineProperty(obj, propertyName, descriptor)`

```
Object.defineProperties(obj, {
  prop1: descriptor1,
  prop2: descriptor2
})
```

### Sealing an object globally
Property descriptors work at the level of individual properties.

There are also methods that limit access to the whole object:

`Object.preventExtensions(obj)`
Forbids the addition of new properties to the object.

`Object.seal(obj)`
Forbids adding/removing of properties. Sets configurable: false for all existing properties.

`Object.freeze(obj)`
Forbids adding/removing/changing of properties. Sets configurable: false, writable: false for all existing properties.

And also there are tests for them:

`Object.isExtensible(obj)`
Returns false if adding properties is forbidden, otherwise true.

`Object.isSealed(obj)`
Returns true if adding/removing properties is forbidden, and all existing properties have configurable: false.

`Object.isFrozen(obj)`
Returns true if adding/removing/changing properties is forbidden, and all current properties are configurable: false, writable: false.

### Accessors (get/set)
Accessors also have their own descriptors but they are a bit different:

- `get` – a function without arguments, that works when a property is read,
- `set` – a function with one argument, that is called when the property is set,
- `enumerable` – same as for data properties,
- `configurable` – same as for data properties.

We can also create an accessor with using `Object.defineProperty`

```
Object.defineProperty(user, 'fullName', {
  get() {
    return `${this.name} ${this.surname}`;
  },

  set(value) {
    [this.name, this.surname] = value.split(" ");
  }
});
```

### Garbage collector
The main concept of memory management in JavaScript is reachability.

Values, that cannot be deleted for obvious reasons.

1. **Roots**
- The currently executing function, its local variables and parameters.
- Other functions on the current chain of nested calls, their local variables and parameters.
- Global variables.
2. Any other value is considered reachable if it’s reachable from a root by a reference or by a chain of references.

#### Basic algorithm
The basic garbage collector algorithm is called **mark-and-sweep**

- Mark all roots
- Mark all references from roots
- Mark all references from step 2 (and so on until every reachable (from the roots) references are visited)
- Remove all values that wasn't marked (they are not reachable)

![image](https://github.com/user-attachments/assets/ebe164a9-eead-4f54-9333-3556de64d761)

Some of the optimizations:

- **Generational collection** - objects are split into two sets new ones and old ones. Garbage collector tracks the new ones at first, if they survive for long enough, become “old” and are examined less often.
- **Incremental collection** -  engine splits the whole set of existing objects into multiple parts. And then clear these parts one after another. There are many small garbage collections instead of a total one.
- **Idle-time collection** – the garbage collector tries to run only while the CPU is idle, to reduce the possible effect on the execution.


## Prototypal inheritance
All object has a hidden propery `[[Prototype]]`. It can be eaither another object or `null`. 

> When we read a property from object, and it’s missing, JavaScript automatically takes it from the prototype. In programming, this is called “prototypal inheritance”. 


We can set or access `[[Prototype]]` in different ways.

1. **Using the `prototype` property of a constructor function**  
The prototype property of a constructor function has worked since very ancient times. It’s the oldest way to create objects with a given prototype.

```
function User (name) {
  this.name = name;
}

User.prototype.sayHello = function () {
  console.log('Hello, I am ' + this.name);
}

const user = new User('John');
user.sayHello(); // Hello, I am John
```

2. **Using `Object.create()`**  
Later, in the year 2012, Object.create appeared in the standard. It gave the ability to create objects with a given prototype.

```
const byCreateMethod = Object.create({
  sayHello: function () {
    console.log('Hello world');
  },
});

byCreateMethod.sayHello() // Hello world'
```

3. **Using getter/setter `__proto__`**  
Some browsers implemented the non-standard __proto__ accessor that allowed the user to get/set a prototype at any time, to give more flexibility to developers.

```
const byProto = {};
byProto.__proto__ = {
  sayHello: function () {
    console.log('Hello world');
  },
};

byProto.sayHello(); // Hello world
```

4. **Using `Object.setPrototypeOf` and `Object.getPrototypeOf`**  
Later, in the year 2015, Object.setPrototypeOf and Object.getPrototypeOf were added to the standard, to perform the same functionality as __proto__

```
Object.getPrototypeOf(byProto).sayHello(); // Hello world

Object.setPrototypeOf(byProto, {
  sayHello2: function () {
    console.log('Hello world 2');
  },
});
```

### for…in loop
The for..in loop iterates over inherited properties too. The operator `in` checks if a property exists in an object and its prototypes.

```
const obj = {
  a: 1
}

obj.__proto__.b = 2

console.log(obj.hasOwnProperty('a')) // true
console.log(obj.hasOwnProperty('b')) // false
console.log('b' in obj); // true
```
