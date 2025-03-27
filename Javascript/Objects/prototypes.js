///
function User(name) {
  this.name = name;
}

User.prototype.sayHello = function () {
  console.log('Hello, I am ' + this.name);
};

const user = new User('John');
user.sayHello(); // Hello, I am John

///===================================

const byCreateMethod = Object.create({
  sayHello: function () {
    console.log('Hello world');
  },
});

byCreateMethod.sayHello() // Hello world'

/////==================================

const byProto = {};
byProto.__proto__ = {
  sayHello: function () {
    console.log('Hello world');
  },
};

byProto.sayHello(); // Hello world

/////==================================

Object.getPrototypeOf(byProto).sayHello(); // Hello world

Object.setPrototypeOf(byProto, {
  sayHello2: function () {
    console.log('Hello world');
  },
});