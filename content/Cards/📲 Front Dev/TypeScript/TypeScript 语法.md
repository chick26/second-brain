---
title: TypeScript 语法
creation date: 2022-05-25 22:12 
status: done
tags:
- Development/Frontend/JavaScript/typeScript
---
up:: [[Cards/📲 Front Dev/• TOC for Frontend|• TOC for Frontend]]

# 1. 简介

Javascript的超集，特点：扩展语法、面向对象、静态类型。

## 全局安装typescript

```powershell
yarn global add typescript
```

## 编译执行TS文件

```powershell
tsc demo.ts
node demo.js
```

## ts-node的安装和使用

```powershell
npm i -g ts-node
ts-node demo.ts
```

# 2. 静态类型

## 定义静态类型

```typescript
const count: number = 1;
```
定义后count只能是数字类型，不可以改变，赋值其他类型会报错。定义后count变量可以使用number类型上的所有属性和方法。

## 自定义静态类型

```typescript
interface Person {
  uname: string;
  age: number
}
const xiaoming: Person = {
  uname: "小明",
  age: 18
}
```
如果使用了静态类型，不仅意味着变量的类型不可改变，还意味着类型的属性和方法也跟着确定了。这个特点大大提高了程序的健壮性，并且编辑器会给你很好的语法提示，加快开发效率。

# 3. 基础静态类型和对象类型

## 基础静态类型

在声明变量后加`:`号，然后加上对应的类型，`number, string, boolean, null, undefined, symbol, void, any`是最常用的基础数据类型。

## 对象类型

- 对象类型
```typescript
const xiaoming: {
  uname: string;
  age: number
} = {
  uname: "小明",
  age: 18
}
```

- 数组类型
```typescript
const persons: string[] = ["小明", "小红"]
```

- 类类型
```typescript
class Person {}
const xiaoming: Person = new Person();
```

- 函数类型
```typescript
const print: () => string = () => {
  return "小明";
}
```

# 4. 类型注解和类型推断

## type annotation 类型注解

```typescript
let count: number;
count = 123;
```
用`:`加类型显式地告诉代码，count是一个数字类型，这叫类型注解。

## type inference 类型推断

```typescript
let count = 123;
```
这里并没有显式地告诉代码count是一个数字类型，但ts会通过代码自动去尝试分析变量的类型，并自动把count注释为数字类型，这叫类型推断。

## 工作使用问题

- 如果ts能自动分析变量类型，那什么也不需要做
- 如果ts无法分析变量类型的情况，我们就需要手动加上类型注解

每个变量的类型都应该是固定的，如果能推断就让它推断，推断不出来的时候要进行注解，这是一个重要的原则。
不用写类型注解的例子：

```typescript
const one = 1;
const two = 2;
const three = one + two;
```

此时one, two, three的类型都是确定的。
需要写类型注解的例子：

```typescript
function getTotal(one: number, two: number) {
	return one + two;
}
const total = getTotal(1, 2);
```

如果getTotal的传参没有类型注解，那默认就是any类型，这是不建议的。每个变量都应该有固定的类型，但ts无法自动推断，所以one和two需要类型注解。当one和two的类型固定为number，返回值赋予total的类型就会自动固定，所以total无需注解。

# 5. 数组类型的定义

## 一般类型数组的定义

直接放几个例子：
```typescript
const numberArr = [1, 2, 3];  // 类型推断
const stringArr: string[] = ["小明", "小红"];  // 类型注解
const arr: (number | string)[] = [1, "string", 2];  // 多种类型

```

## 对象类型数组的定义（配合使用type/class）

```typescript
type Person = { name: string, age: number };  // type，用类型别名（type alias）定义一个对象
const persons: Person[] = [
  {name: '小明', age: 18},
  {name: '小红', age: 16}
];
```
除了用类型别名type，这里用interface/class来定义也是可以的。

# 6. 元祖和类型约束

## 元祖的基本应用

ts提供了`元祖`的概念，这在js中是没有的，元祖的目的是数组的加强，更好的控制规范集合里元素的类型。
如果定义了数组`const arr: (string | number) = ["小明", "小红", 18]`，那我们再给`arr`做以下赋值是没问题的：`arr: (string | number) = ["小明", 18, "小红"]`，也就是说数组的类型注解只能限制集合中出现哪些类型，但不能控制到集合中每个元素的类型是什么。而元祖的作用就是限制集合中每个元素的类型：
```typescript
const arr: [string, number, string][] = ["小明", 18, "小红"];
```
这个时候，arr的第1个元素只能是string类型，第2个元素只能是number类型，如此类推。

## 元祖的使用

工作中不常会使用到元祖，因为元祖完全可以使用对象来代替，但一些老系统可能会用到一种数据源是csv（类似excel表格）：
```json
[
  ["xiaoming", "teacher", 28],
  ["xiaohong", "teacher", 26],
  ["xiaowang", "student", 18]
]
```
这个时候我们就会把列表赋值给一个元祖：`const persons: [string, string, number][] = [...];`

# 7. 函数参数和返回类型定义

## 函数返回类型定义

```typescript
function getTotal(one: number, two: number): number {
	return one + two;
}
const total = getTotal(1, 2);
```

## 无返回值（void）

```typescript
function sayHello: void {
	console.log("Hello World");
}
```

## never返回值类型

如果一个函数不能执行到底（比如中途抛出错误），或者有死循环，返回值类型就位never。

```typescript
// 永远也执行不完
function errorFn(): never {
	throw new Error();
  console.log("Hello World");
}

// 死循环
function forNever(): never {
	while(true) {}
  console.log("Hello World");
}
```

## 函数参数为对象（解构）时

```typescript
function add({ one, two }: { one: number, two: number }): number {
  return one + two;
}
const three = add({ one: 1, two: 2 });
```

# 8. interface接口

interface的定义跟type相似，interface更常用。接口只是对开发的约束，比如帮我们做语法校验，但编译成正式的js后不会在js中体现出来。
在面向对象编程中，一般使用接口定义行为（方法），而不用来定义属性。

```typescript
interface Person {
	name: string;  // 千万注意这里是分号
  age: number;
}
const getResume = (person: Person) => {
  console.log(person.name, person.age);
}
```

## 接口和类型别名的区别

类型别名可以给基础类型定义别名，比如`type StringAlias = string;`，而接口必须是对象。

## 接口中非必选值的定义

```typescript
interface Person {
	name: string;  // 千万注意这里是分号
  age: number;
  phone?: string;  // 非必选
}
```

## 允许加入任意属性

```typescript
interface Person {
	name: string;  // 千万注意这里是分号
  age: number;
  phone?: string;  // 非必选
  [propname: string]: any;  // 允许加入任意属性，写法固定
}
```
`[propname: string]: any;`的意思是，key是string类型，value可以是任何类型。

## 接口里加入方法

接口里不仅可以存属性，也可以存方法。
```typescript
interface Person {
	name: string;  // 千万注意这里是分号
  age: number;
  phone?: string;  // 非必选
  [propname: string]: any;  // 允许加入任意属性，写法固定
  sayHello(): string;  // 加入方法
}
const xiaoming = {  // 类型推断
  name: "小明",
  age: 18,
  sex: "男",
  sayHello(): {
    return "Hello";
  }
}
```

## 类和接口的继承

```typescript
class Xiaoming implements Person {  // implements要写全接口下的属性和方法
  name: "小明";
  age: 18;
  sayHello(): {
    return "Hello";
  }
}
```

## 接口间的继承

```typescript
interface Teacher extends Person {  // extends只用写新增的属性和方法
	teach(): string;
}
```

# 9. 类的使用

ts中类的概念和es6中大部分相同，类的基础用法这里不再阐述，只对一些关键点和新的特性进行说明。

## super关键字的使用

```typescript
class Person {
	sayHello() {
    return "hello";
  }
}
class Student extends Person {
  sayHello() {	// 重写覆盖父类方法
    return super.sayHello() + " 你好";	// super调用父类方法
  }
}
```

## 类的访问类型

> public：允许在类的内部和外部访问
> private：只允许在类的内部访问，外部不允许访问
> protected：允许在类的内部和子类的内部访问

```typescript
class Person {
	name: string;  // 不对访问属性进行定义，就会默认是public访问属性
  public sex: string;  
  private age: number;
  protected heritage: number;
}
```

## 类的构造函数

```typescript
class Person {
  constructor(public name: string) {}  // 简写写法，在构造函数参数中同时定义属性name
}
const xiaoming = new Person("xiaoming");

// 在子类中写构造函数时，必须用super()调用父类的构造函数，即使父类只有默认空的构造函数
class Teacher extends Person {
  constructor(public name: string, public age: number) {
    super(name);
  }
}
const xiaohong = new Teacher("xiaohong", 18);
```

## Getter和Setter

```typescript
// 配合private属性使用
class Xiaoming {
	constructor(pricate _age: number){}
  get age() {
    return this._age;  // 可以在getter中对返回值进行处理
  }
  set age(age: number) {
  	this._age = age;  // 可以在setter中对赋值进行校验
  }
}
```

## 静态修饰符static、只读属性readonly

```typescript
class Person {
  public readonly name;  // 只读属性，不能修改
	static sayHello() {  // 静态方法
  	return 'Hello';
  }
}
Person.sayHello();  // 类的静态方法可直接调用
```

# 10. 高级类型

基于基础类型和类/接口，类型声明中还有一些高级用法。

## 交叉类型（&）

交叉类型就是将多个类型合并成一个类型，语法规则和逻辑 “与” 的符号一致。
```typescript
T & U
```
假如现在有两个类，一个按钮，一个超链接，现在需要一个带有超链接的按钮，就可以使用交叉类型来实现。
```typescript
interface Button {
  type: string
  text: string
}
interface Link {
  alt: string
  href: string
}
const linkBtn: Button & Link = {
  type: 'danger',
  text: '跳转到百度',
  alt: '跳转到百度',
  href: 'http://www.baidu.com'
}
```

## 联合类型（|）

联合类型的语法规则和逻辑 “或” 的符号一致，表示其类型为连接的多个类型中的任意一个。

```typescript
T | U
```

例如之前的 Button 组件，如果 type 属性只能指定固定的几种字符串：

```typescript
interface Button {
  type: 'default' | 'primary' | 'danger'
  text: string
}
const btn: Button = {
  type: 'primary',
  text: '按钮'
}
```

## 类型别名（type）

交叉类型和联合类型如果有多个地方需要使用，可以通过类型别名的方式，给这两种类型声明一个别名。类型别名与声明变量的语法类似，只需要把 `const`、`let` 换成 `type` 关键字即可。

```typescript
type Alias = T | U
```

```typescript
type InnerType = 'default' | 'primary' | 'danger'
interface Button {
  type: InnerType
  text: string
}
interface Alert {
  type: ButtonType
  text: string
}
```

## 类型索引（keyof）

`keyof` 类似于 `Object.keys` ，用于获取一个接口中 Key 的联合类型。

```typescript
interface Button {
    type: string
    text: string
}
type ButtonKeys = keyof Button
// 等效于
type ButtonKeys = "type" | "text"
```

## 类型约束（extends）

这里的 `extends` 关键词不同于在 class 后使用 `extends` 的继承作用，泛型内使用的主要作用是对泛型加以约束。我们用我们前面写过的 copy 方法再举个例子：

```typescript
type BaseType = string | number | boolean
// 这里表示 copy 的参数
// 只能是字符串、数字、布尔这几种基础类型
function copy<T extends BaseType>(arg: T): T {
  return arg
}
```

`extends` 经常与 `keyof` 一起使用，例如我们有一个函数用来获取对象某个key的值，但是这个key的类型并不确定，我们就可以使用 `extends` 和 `keyof` 进行约束。 

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
const obj = { a: 1 }
const a = getValue(obj, 'a')
```

这里的 getValue 方法就能根据传入的参数 obj 来约束 key 的值。

## 类型映射（in）

`in` 关键词的作用主要是做类型的映射，遍历已有接口的 key 或者是遍历联合类型。下面使用内置的泛型接口 `Readonly` 来举例：

```typescript
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
interface Obj {
  a: string
  b: string
}
type ReadOnlyObj = Readonly<Obj>
```

首先 `keyof Obj` 得到一个联合类型 `'a' | 'b'`。

```typescript
interface Obj {
    a: string
    b: string
}
type ObjKeys = 'a' | 'b'
type ReadOnlyObj = {
    readonly [P in ObjKeys]: Obj[P];
}
```

然后 `P in ObjKeys` 相当于执行了一次 forEach 的逻辑，遍历 `'a' | 'b'`

```typescript
type ReadOnlyObj = {
    readonly a: Obj['a'];
    readonly b: Obj['b'];
}
```

最后就可以得到一个新的接口。

```typescript
interface ReadOnlyObj {
    readonly a: string;
    readonly b: string;
}
```

## 条件类型（U ? X : Y）

条件类型的语法规则和三元表达式一致，经常用于一些类型不确定的情况。

```typescript
T extends U ? X : Y
```

上面的意思就是，如果 T 是 U 的子集，就是类型 X，否则为类型 Y。下面使用内置的泛型接口 `Extract` 来举例。

```typescript
type Extract<T, U> = T extends U ? T : never;
```

如果 T 中的类型在 U 存在，则返回，否则抛弃。假设两个类有三个公共的属性，可以通过 Extract 提取这三个公共属性。

```typescript
interface Worker {
  name: string
  age: number
  email: string
  salary: number
}
interface Student {
  name: string
  age: number
  email: string
  grade: number
}
type CommonKeys = Extract<keyof Worker, keyof Student>
// 'name' | 'age' | 'email'
```

# 11. 联合类型和类型保护

这一节对联合类型进行进一步的使用说明，如果函数的传参为联合类型，也就是传参类型在声明时可能为多种，那在函数体中就需要对参数类型进行判断后再使用，这叫做联合类型的类型保护。

## 联合类型

一个变量可能有两种或两种以上的类型，就叫联合类型。

```typescript
interface Waiter {
  isWaiter: boolean;
  serve: () => {};
}
interface Teacher {
  isWaiter: boolean;
  teach: () => {};
}
// 这个函数不能准确地判断person具体是哪个类型的实例
function guessWho(person: Waiter | Teacher) {} 
```

## 类型保护 - 类型断言

```typescript
function guessWho(person: Waiter | Teacher) {
	if (person.isWaiter) {  // 通过person的一个属性值来进行区分
    (person as Waiter).serve();  // person as Waiter叫做断言语法，把person当做Waiter类型来处理
  } else {
  	(person as Teacher).teach();
  }
}
```

## 类型保护 - in语法

```typescript
function guessWho(person: Waiter | Teacher) {
	if ("serve" in person) {  // 通过判断person是否具有某个属性或方法来进行区分
    person.serve();
  } else {
  	person.teach();
  }
}
```

## 类型保护 - typeof语法

```typescript
function add (one: string | number, two: string | number) {
	if (typeof one === 'string' || typeof two === 'string') {
      return `${one}${two}`;
  }
  return one + two;
}
```

## 类型保护 - instanceof语法

```typescript
class NumberObj {
	count: number;
}
function addObj(one: object | NumberObj, two: object | NumberObject) {
  if (one instanceof NumberObj && two instanceof NumberObj) {
    return one.count + two.count;
  }
  return 0;
}
```

# 12. 泛型 - 重点

泛型是强类型语言中比较重要的一个概念，合理的使用泛型可以提升代码的可复用性，让系统更加灵活。

> 泛型允许程序员在强类型程序设计语言中编写代码时使用一些以后才指定的类型，在实例化时作为参数指明这些类型。

泛型通过一对尖括号来表示(`<>`)，尖括号内的字符被称为_类型变量_，这个变量用来表示类型。

```typescript
function copy<T>(arg: T): T {
  if (typeof arg === 'object') {
    return JSON.parse(
      JSON.stringify(arg)
    )
  } else {
    return arg
  }
}
```

这个类型 T，在没有调用 copy 函数的时候并不确定，只有调用 copy 的时候，我们才知道 T 具体代表什么类型。

```typescript
const str = copy<string>('my name is typescript')
```

我们在调用 copy 的时候也可以省略尖括号，通过 TS 的类型推导来确定 T 为 string 。
```typescript
const str = copy('my name is typescript')
```
除了定义函数，在定义class/interface/type的时候也能使用泛型。

# 13. 工具泛型

内置的泛型在 TypeScript 内置的 `lib.es5.d.ts` 中都有定义，所以不需要任何依赖，可以直接使用，以下是常用的一些工具泛型，包括上一节已经提过的Readonly和Extract。

## Readonly

```typescript
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

`Readonly`用于将一个接口的所有属性设置为只读，首先通过 `keyof T`，取出类型变量 `T` 的所有属性，然后通过 `in` 进行遍历，最后在属性前加上`readonly`。

```typescript
interface Obj {
  a: string
  b: string
}
type ReadOnlyObj = Readonly<Obj>
```

## Partial

```typescript
type Partial<T> = {
    [P in keyof T]?: T[P]
}
```
`Partial` 用于将一个接口的所有属性设置为可选状态，首先通过 `keyof T`，取出类型变量 `T` 的所有属性，然后通过 `in` 进行遍历，最后在属性后加上一个 `?`。

## Required

```typescript
type Required<T> = {
    [P in keyof T]-?: T[P]
}
```
`Required` 的作用刚好与  `Partial` 相反，就是将接口中所有可选的属性改为必须的，区别就是把 `Partial` 里面的 `?` 替换成了 `-?`。

## Record

```typescript
type Record<K extends keyof any, T> = {
    [P in K]: T
}
```
`keyof any`是`string|number|symbol`，`Record` 生成的类型具有`string|number|symbol`类型的键，值为类型 T。
我们在业务代码中经常会构造某个对象的数组，但是数组不方便索引，所以我们有时候会把对象的某个字段拿出来作为索引，然后构造一个新的对象。假设有个商品列表的数组，要在商品列表中找到商品名为 「每日坚果」的商品，我们一般通过遍历数组的方式来查找，比较繁琐，为了方便，我们就会把这个数组改写成对象。

```typescript
interface Goods {
  id: string
  name: string
  price: string
  image: string
}
const goodsMap: Record<string, Goods> = {}
const goodsList: Goods[] = await fetch('server.com/goods/list')
goodsList.forEach(goods => {
  goodsMap[goods.name] = goods
})
```

## Extract

```typescript
type Extract<T, U> = T extends U ? T : never;
```
如果 T 中的类型在 U 存在，则返回，否则抛弃。假设两个接口有三个公共的属性，可以通过 Extract 提取这三个公共属性。

```
interface Worker {
  name: string
  age: number
  email: string
  salary: number
}
interface Student {
  name: string
  age: number
  email: string
  grade: number
}
type CommonKeys = Extract<keyof Worker, keyof Student>
// 'name' | 'age' | 'email'
```

## Exclude

```typescript
type Exclude<T, U> = T extends U ? never : T
```
`Exclude` 的作用与 `Extract` 刚好相反，如果 T 中的类型在 U 不存在，则返回，否则抛弃。现在我们拿之前的两个类举例，看看 `Exclude` 的返回结果。

```
interface Worker {
  name: string
  age: number
  email: string
  salary: number
}
interface Student {
  name: string
  age: number
  email: string
  grade: number
}
type ExcludeKeys = Exclude<keyof Worker, keyof Student>
// 'salary'
```

## Pick

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P]
}
```

`Pick` 主要用于提取接口的某几个属性。

```typescript
interface Todo {
  title: string
  completed: boolean
  description: string
}
type TodoPreview = Pick<Todo, "title" | "completed">
const todo: TodoPreview = {
  title: 'Clean room',
  completed: false
}
```

## Omit

```typescript
type Omit<T, K extends keyof any> = Pick<
  T, Exclude<keyof T, K>
>
```
`Omit` 的作用和 Pick 相反，先通过 `Exclude<keyof T, K>` 先取出类型 T 中存在，但是 K 不存在的属性，然后再由这些属性构造一个新的类型。还是通过上面的 Todo 为例，TodoPreview 类型只需要排除接口的 description 属性即可，写法上比之前 Pick 精简了一些。
```typescript
interface Todo {
  title: string
  completed: boolean
  description: string
}
type TodoPreview = Omit<Todo, "description">
const todo: TodoPreview = {
  title: 'Clean room',
  completed: false
}
```

# 14. 配置文件tsconfig.json

## 生成tsconfig.json编译配置文件，注意配置文件中不支持单引号

```powershell
tsc --init
```
用tsc命令（不接文件名）才会让编译配置文件生效，使用ts-node filename直接执行时也能使用编译配置文件。

## include/exclude/files

include属性用来指定要编译的文件，files属性的效果跟include类似，exclude属性用来指定不要编译的文件。
```json
{
	"include": ["demo.ts"],
	"files": ["demo1.ts"],
	"exclude": ["demo2.ts"]
}
```

## compilerOptions配置项

常用属性说明

```md
removeComments: true  // 去掉注释
strict: true  // 编译和书写规范按照ts最严格的规范来写
noImplicitAny: true  // 就算变量类型或方法返回值是any，也要显式地写:any注解，如果为false则不用显式地写
strictNullChecks: false  // 不强制检查NULL类型，null可以赋值给所有类型的变量
rootDir  // 指定ts文件存放目录
outDir  // 指定编译生成的js文件存放目录
allowJs: true  // 使用es6语法，并编译es6到es5
sourceMap  // 把注释去掉，在打包过程中就会生成sourceMap文件，sourceMap是一个信息文件，里面储存着转换后代码所对应的转换前代码的位置，当出错时，除错工具将直接显示原始代码，而不是转换后的代码，给开发者带来方便
noUnusedLocals: true  // 开发时提示哪些变量有定义但没有使用
noUnusedParameters: true  // 开发时提示哪些函数有定义但没有使用
```



