# Data types in JavaScript

## Types
There are 7 primitive types in JavaScript

- **number** for numbers of any kind: integer or floating-point, integers are limited by ±(253-1).
- **bigint** for integer numbers of arbitrary length.
- **string** for strings. A string may have zero or more characters, there’s no separate single-character type.
- **boolean** for true/false.
- **null** for unknown values – a standalone type that has a single value null.
- **undefined** for unassigned values – a standalone type that has a single value undefined.
- **symbol** for unique identifiers.

And one non-primitive type
- **object**

### Bigint
In JavaScript a value more then `2^53-1 (9,007,199,254,740,991)` cannot be stored as a number type. This is called `Number.MAX_SAFE_INTEGER`. Numbers use the [IEEE 754 double-precision floating-point format](https://orkhan-huseyn.github.io/2019/12/07/ieee754-single-and-double-precision-formats-explained/) which allows 64 bit to store a number. But you can use only 53 of them. The remaining bits are used for the exponent and sign. So 53 bits can fit only `9,007,199,254,740,991`

For the cases you need to use a bigger integer there is a special type bigint. You need to append the `n` suffix to the end of an integer or to use `BigInt()` function.

```
const bigint = 1234567890123456789012345678901234567890n;

const sameBigint = BigInt("1234567890123456789012345678901234567890");

const bigintFromNumber = BigInt(10); // same as 10n
```
When you add an n at the end of a number, JavaScript switches from floating-point arithmetic to arbitrary-precision integer arithmetic.

- Instead of storing the value using floating-point representation, JavaScript stores it as an arbitrary-length integer.
- The BigInt type uses a completely different representation and logic for arithmetic operations.

[See more](https://javascript.info/bigint)


### Symbol
You can use only two primitive types as a key of an object:
- `string`
- `Symbol`

Other types will be converted to a string `true => 'true'`, `1 => '1'`.

A “symbol” represents a unique identifier.

```
const id = Symbol('id'); // 'id' is just a description, not the symbol

const user = {
  name: 'John',
  [id]: 123 // not just "id: 123"
};

console.log(user); // { name: 'John', [Symbol(id)]: 123 }
```

It's useful in cases:
- you need to add a property that cannot be changed or removed without the specific Symbol (to safe them in other parts of code)
- hide some properties from `for .. in` loop. Symbols properties are not iterable.

#### Well-known symbols
Well-known symbols allows to change a standard behavior of JavaScript object ([see more](https://tc39.es/ecma262/#sec-well-known-symbols))

```
const obj = {
  [Symbol.toStringTag]: 'MyObject'
};

console.log(obj.toString()); // [object MyObject]


obj[Symbol.toPrimitive] = function(hint) {
  return 'hello world';
}

console.log(String(obj)); // hello world
```

#### Global Symbols
We can create global Symbols via `Symbol.for()`. To achieve that, there exists a global symbol registry. We can create symbols in it and access them later, and it guarantees that repeated accesses by the same name return exactly the same symbol.

```
// read from the global registry
let id = Symbol.for("id"); // if the symbol did not exist, it is created
```

##### What the Global Registry is
> And "global" means even more global than a global scope, the global symbol registry does span all realms of your engine. In a browser, the web page, an iframe, and web worker would all have their own realm with own global objects, but they could share symbols via this global registry

## Autoboxing
TODO

## Typeof operator
TODO how it works


