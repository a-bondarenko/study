# Classes
We have two ways to create an object using operator `new`, through `function` or `class`. 
Basically a class is a syntax sugar for a function, but there are a couple of differences:

1. Class cannot be called without `new`
2. It has a special property `[[IsClassConstructor]]: true`
3. All properties of a class are not enumerable.
4. Classes always use strict. All code inside the class construct is automatically in strict mode.

```
class User {
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    alert(this.name);
  }
}
class Child extends User {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
  sayAge() {
    alert(this.age);
  }
}
```
equals to: 
```
function User(name) {
  this.name = name;
}

User.prototype.sayHi = function () {
  alert(this.name);
};

function Child(name, age) {
  User.call(this, name); // Call the parent constructor
  this.age = age;
}

Child.prototype = Object.create(User.prototype); // Inherit from User
Child.prototype.constructor = Child;

Child.prototype.sayAge = function () {
  alert(this.age);
};
```


## Overriding constructor
According to the specification, if a class extends another class and has no constructor, then the following “empty” constructor is generated:

```
class Animal {
  constructor(name) {
    this.name = name;
  }
  walk() {
    alert("I walk: " + this.name);
  }
}
class Rabbit extends Animal {
  jump() {
    alert("I jump: " + this.name);
  }
}
```

Under the hood class `Rabbit` call parent's constructor using `super`

```
class Rabbit extends Animal {
  constructor(...args) {
    super(...args);
  }
  ....
}
```

### Losing this
In JavaScript, there’s a distinction between a constructor function of an inheriting class (so-called “derived constructor”) and other functions. A derived constructor has a special internal property `[[ConstructorKind]]:"derived"`. That’s a special internal label.

That label affects its behavior with new.

1. When a regular function is executed with new, it creates an empty object and assigns it to this.
2. But when a derived constructor runs, it doesn’t do this. It expects the parent constructor to do this job.

```
class Animal {

  constructor(name) {
    this.speed = 0;
    this.name = name;
  }

  // ...
}

class Rabbit extends Animal {

  constructor(name, earLength) {
    super(name);
    this.earLength = earLength;
  }

  // ...
}
```

## Static properties and methods
Usually, static methods are used to implement functions that belong to the class as a whole, but not to any particular object of it.

```
class MyClass {
  static property = ...;

  static method() {
    ...
  }
}
```

equals to:
```
MyClass.property = ...
MyClass.method = ...
```

## Protected properties and methods
There’s a finished JavaScript proposal, almost in the standard, that provides language-level support for private properties and methods.

Privates should start with #. They are only accessible from inside the class.

For instance, here’s a private #waterLimit property and the water-checking private method #fixWaterAmount:

```
class CoffeeMachine {
  #waterLimit = 200;

  #fixWaterAmount(value) {
    if (value < 0) return 0;
    if (value > this.#waterLimit) return this.#waterLimit;
  }

  setWaterAmount(value) {
    this.#waterLimit = this.#fixWaterAmount(value);
  }

}

let coffeeMachine = new CoffeeMachine();

// can't access privates from outside of the class
coffeeMachine.#fixWaterAmount(123); // Error
coffeeMachine.#waterLimit = 1000; // Error
```


