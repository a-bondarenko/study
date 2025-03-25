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


class Animal {
  constructor(name) {
    this.name = name;
  }
  walk() {
    alert("I walk: " + this.name);
  }
}
class Rabbit extends Animal {
  walk() {
    alert("I jump: " + this.name);
  }
}