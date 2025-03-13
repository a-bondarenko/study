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
We can user methods of primitives as if they were objects. 

For example:
```
let str = "Hello";

alert( str.toUpperCase() ); // HELLO
```

The process looks like:
1. JavaScript create a corresponding wrapper objects (`new String('Hello')`)
2. JavaScript call the method `.toUpperCase()`
3. Javascript destroys the object leaving the value as a primitive

`new String('Hello')` and `String('Hello')` are not the same. In case of using `new` you literally create a new object and the function returns the instance of it. 

```
alert( typeof Number(0) ); // "number"

alert( typeof new Number(0) ); // "object"!
```

## Typeof operator

Returned values
| Value                  | `typeof` Result |
|------------------------|----------------|
| `undefined`           | `"undefined"`   |
| `null`                | `"object"` (a bag) |
| `true` or `false`     | `"boolean"`     |
| `42`, `3.14`, `NaN`   | `"number"`      |
| `BigInt(123)`         | `"bigint"`      |
| `"Hello"`            | `"string"`      |
| `Symbol("id")`        | `"symbol"`      |
| `function() {}`       | `"function"`    |
| `{}` (object)        | `"object"`      |
| `[]` (array)         | `"object"`      |
| `new Date()`         | `"object"`      |

`typeof` works by checking low-level type tags in memory

| Type       | Internal Representation                | `typeof` Output  |
|-----------|----------------------------------------|------------------|
| `undefined` | Special internal tag for `undefined`  | `"undefined"`    |
| `null`      | Special pointer value (`0x00` in many JS engines) | `"object"` (legacy bug) |
| `boolean`   | Internally represented as `1` (true) or `0` (false) | `"boolean"` |
| `number`    | Stored as 64-bit IEEE floating-point  | `"number"`       |
| `bigint`    | A special type for arbitrarily large integers | `"bigint"` |
| `string`    | Stored as UTF-16 sequence            | `"string"`       |
| `symbol`    | A unique value with an internal reference | `"symbol"` |

Each JavaScript engine implements typeof differently, but in V8 (used in Chrome & Node.js), the implementation roughly follows these steps:

1. Check if the value is undefined
- If so, return `undefined`.
2. Check for null
- If the value is a reference with a zeroed-out pointer, return `object` (due to historical reasons).
3. Check if it's a function
 - If the value has a [[Call]] internal slot (indicating it's callable), return `function`.
4. Check for primitive types
 - If the value is a primitive (boolean, number, string, symbol, bigint), return the corresponding type.
5. If none of the above, return `object`
 - This is the fallback case, which is why arrays, objects, and new Date() all return `object`.


## Type Conversion
There are two types of types conversion in JavaScript: explicit (Type Casting) or implicit (Type Coercion)

```
console.log("Hello" + 5) // implicit
console.log(Number("123")); // explicit
```

| **Conversion Type**        | **Method / Operator**     | **Example**        | **Result**         |
|---------------------------|--------------------------|--------------------|--------------------|
| **Implicit (Coercion)**   | `"string" + value`       | `"10" + 2`        | `"102"` (String)   |
|                           | `"string" - value`       | `"10" - 2`        | `8` (Number)       |
|                           | `Boolean(value)` (in conditions) | `if ("Hello")` | `true`            |
| **Explicit (Casting)**    | `String(value)`          | `String(123)`     | `"123"`            |
|                           | `value.toString()`       | `(123).toString()` | `"123"`           |
|                           | `Number(value)`          | `Number("10")`    | `10`               |
|                           | `parseInt(value)`        | `parseInt("10.5")` | `10`              |
|                           | `parseFloat(value)`      | `parseFloat("10.5")` | `10.5`          |
|                           | `Boolean(value)`         | `Boolean(1)`      | `true`             |
| **Special Cases**         | `==` (Loose comparison)  | `5 == "5"`        | `true` (Type coercion) |
|                           | `===` (Strict comparison) | `5 === "5"`      | `false` (Different types) |
|                           | Unary `+` operator      | `+"10"`           | `10` (Number)      |
|                           | Unary `+` operator      | `+true`           | `1`                |
|                           | Unary `+` operator      | `+false`          | `0`                |
|                           | Unary `+` operator      | `+null`           | `0`                |
|                           | Unary `+` operator      | `+undefined`      | `NaN`              |


### Math Operators (+, -, *, /, **, %)
All math operators (except `+`) coerces values to a number. In case of using `+` if one of types is a string, the other coerces to a string.

```
null -> 0
undefined -> NaN
true/false -> 1/0
'' -> 0
'10' -> number
'string' -> NaN
```

### Logical Operators (||, &&, !, !!)
They coerce types to a boolean type.

```
0, null, undefined, NaN, '' => false
the others => true
```

### Comparison Operators (>, <, <=, >=, ==)
If we compare two different types both coerce to numbers (except NaN, null and undefined), if we compare strings to Unicode

```
true == 0 // true
```

#### Strict comparison
In case of using `===` none of types coerce

```
true === 0 // false
```


## Iterables
When we use loops like `for..of` JavaScript checks if an object (or a primetime conversed to wrapper object) has the `Symbol.iterator`. So we can change the loop or add this `Symbol.iterator` to objects

```
const obj = {
  name: 'Alex',
  age: 34,

  [Symbol.iterator]: function() {
    const self = this
    const keys = Object.keys(this)

    let index = 0
    return {
      next() {
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
```

> **Iterables and array-likes**
> 
> Two official terms look similar, but are very different. Please make sure you understand them well to avoid the confusion.
> 
> Iterables are objects that implement the Symbol.iterator method, as described above.
Array-likes are objects that have indexes and length, so they look like arrays.


## Map / Set
TODO

## WeekMap / WeekSet
TODO