---
title: "Promise 常用方法"
date: 2022-01-24 14:41
status: done
tags:
- Development/Frontend/JavaScript
- Development/Frontend/JavaScript/Promise
---
up:: [[Cards/📲 Front Dev/• TOC for Frontend|• TOC for Frontend]]

# Promise 中的三兄弟 .all(), .race(), .allSettled()

从 ES6 开始，我们大都使用的是 `Promise.all()`和`Promise.race()`，`Promise.allSettled()` 提案已经到第4阶段，因此将会成为`ECMAScript 2020`的一部分。

## 1. 概述

`Promise.all<T>(promises: Iterable<Promise<T>>): Promise<Array<T>>`

*   **Promise.all(iterable)** 方法返回一个 `Promise` 实例，此实例在 `iterable` 参数内所有的 `promise` 都“完成（resolved）”或参数中不包含 `promise` 时回调完成（resolve）；如果参数中 `promise` 有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败 `promise` 的结果

`Promise.race<T>(promises: Iterable<Promise<T>>): Promise<T>`

*   **Promise.race(iterable)** 方法返回一个 `promise`，一旦迭代器中的某个`promise`解决或拒绝，返回的 `promise`就会解决或拒绝。

`Promise.allSettled<T>(promises: Iterable<Promise<T>>):Promise<Array<SettlementObject<T>>>`

*   **Promise.allSettled()** 方法返回一个`promise`，该`promise`在所有给定的`promise`已被解析或被拒绝后解析，并且每个对象都描述每个`promise`的结果。

## 2. 回顾: Promise 状态

给定一个返回`Promise`的异步操作，以下这些是`Promise`的可能状态：
*   pending: 初始状态，既不是成功，也不是失败状态。
*   fulfilled: 意味着操作成功完成。
*   rejected: 意味着操作失败。
*   Settled： `Promise` 要么被完成，要么被拒绝。`Promise`一旦达成，它的状态就不再改变。

## 3. 什么是组合

又称部分-整体模式，将对象整合成树形结构以表示“部分整体”的层次结构。组合模式使得用户对单个对象和组合对象的使用具有一致性，它基于两种函数：

*   基元函数(简短:基元)创建原子块。
*   组合函数（简称：组合）将原子和/或复合件组合在一起以形成复合件。

对于 JS 的 Promises 来说

*   基元函数包括:`Promise.resolve()`、`Promise.reject()`
*   组合函数：`Promise.all()`, `Promise.race()`, `Promise.allSettled()`

## 4.  Promise.all()

`Promise.all()`

> `Promise.all <T>(promises: Iterable<Promise<T>>): Promise<Array<T>>`

- **完成（Fulfillment）：**  
	- 如果传入的可迭代对象为空，`Promise.all` 会同步地返回一个已完成（`resolved`）状态的`promise`。  
	- 如果所有传入的 `promise` 都变为完成状态，或者传入的可迭代对象内没有 `promise`，`Promise.all` 返回的 `promise` 异步地变为完成。  
	- 在任何情况下，`Promise.all` 返回的 `promise` 的完成状态的结果都是一个数组，它包含所有的传入迭代参数对象的值（也包括非 promise 值）。

- **失败/拒绝（Rejection）：**  
	- 如果传入的 `promise` 中有一个失败（`rejected`），`Promise.all` 异步地将失败的那个结果给失败状态的回调函数，而不管其它 `promise` 是否完成。

- 来个例子：
```js
const promises = [
  Promise.resolve('a'),
  Promise.resolve('b'),
  Promise.resolve('c'),
];
Promise.all(promises)
  .then((arr) => assert.deepEqual(
    arr, ['a', 'b', 'c']
  ));
```

如果其中的一个 promise 被拒绝，那么又是什么情况：

```js
const promises = [
  Promise.resolve('a'),
  Promise.resolve('b'),
  Promise.reject('ERROR'),
];
Promise.all(promises)
  .catch((err) => assert.equal(
    err, 'ERROR'
  ));
```

### 异步 .map() 与 Promise.all()

数组转换方法，如`.map()`、`.filter()`等，用于同步计算。例如

```js
function timesTwoSync(x) {
  return 2 * x;
}
const arr = [1, 2, 3];
const result = arr.map(timesTwoSync);
assert.deepEqual(result, [2, 4, 6]);
```

如果`.map()`的回调是基于`Promise`的函数会发生什么？ 使用这种方式 `.map()`返回的的结果是一个`Promises`数组。

`Promises`数组不是普通代码可以使用的数据，但我们可以通过`Promise.all()`来解决这个问题：它将Promises数组转换为`Promise`，并使用一组普通值数组来实现。

```js
function timesTwoAsync(x) {
  return new Promise(resolve => resolve(x * 2));
}
const arr = [1, 2, 3];
const promiseArr = arr.map(timesTwoAsync);
Promise.all(promiseArr)
  .then(result => {
    assert.deepEqual(result, [2, 4, 6]);
  });
```

### 更实际工作上关于 .map()示例

接下来，咱们使用`.map()`和`Promise.all()`从`Web`下载文件。 首先，咱们需要以下帮助函数：

```javascript
function downloadText(url) {
  return fetch(url)
    .then((response) => { // (A)
      if (!response.ok) { // (B)
        throw new Error(response.statusText);
      }
      return response.text(); // (C)
    });
}
```

`downloadText()`使用基于`Promise`的fetch API 以字符串流的方式下载文件：

*   首先，它异步检索响应（第A行）。
*   response.ok（B行）检查是否存在“找不到文件”等错误。
*   如果没有错误，使用`.text()`(第C行)以字符串的形式取回文件的内容。

在下面的示例中，咱们 下载了两个文件

```arcade
const urls = [
  'http://example.com/first.txt',
  'http://example.com/second.txt',
];

const promises = urls.map(
  url => downloadText(url));

Promise.all(promises)
  .then(
    (arr) => assert.deepEqual(
      arr, ['First!', 'Second!']
    ));
```

### Promise.all()的一个简版实现

```javascript
function all(iterable) {
  return new Promise((resolve, reject) => {
    let index = 0;
    for (const promise of iterable) {
      // Capture the current value of `index`
      const currentIndex = index;
      promise.then(
        (value) => {
          if (anErrorOccurred) return;
          result[currentIndex] = value;
          elementCount++;
          if (elementCount === result.length) {
            resolve(result);
          }
        },
        (err) => {
          if (anErrorOccurred) return;
          anErrorOccurred = true;
          reject(err);
        });
      index++;
    }
    if (index === 0) {
      resolve([]);
      return;
    }
    let elementCount = 0;
    let anErrorOccurred = false;
    const result = new Array(index);
  });
}
```

## 5. Promise.race()

`Promise.race()`

> `Promise.race<T>(promises: Iterable<Promise<T>>): Promise<T>`

**Promise.race(iterable)** 方法返回一个 `promise`，一旦迭代器中的某个`promise`解决或拒绝，返回的 `promise`就会解决或拒绝。来几个例子，瞧瞧：

### Example 1

```js
const promises = [
  new Promise((resolve, reject) =>
    setTimeout(() => resolve('result'), 100)), // (A)
  new Promise((resolve, reject) =>
    setTimeout(() => reject('ERROR'), 200)), // (B)
];
Promise.race(promises)
  .then((result) => assert.equal( // (C)
    result, 'result'));
```

在第 `A` 行，`Promise` 是完成状态 ，所以 第 `C` 行会执行（尽管第 `B` 行被拒绝）。

### Example 2

如果 Promise 被拒绝首先执行，在来看看情况是嘛样的：

```coffeescript
const promises = [
  new Promise((resolve, reject) =>
    setTimeout(() => resolve('result'), 200)),
  new Promise((resolve, reject) =>
    setTimeout(() => reject('ERROR'), 100)),
];
Promise.race(promises)
  .then(
    (result) => assert.fail(),
    (err) => assert.equal(
      err, 'ERROR'));
```

注意，由于 `Promse` 先被拒绝，所以 `Promise.race()` 返回的是一个被拒绝的 `Promise`。 这意味着`Promise.race（[]）`的结果永远不会完成。

### Expample 3

Promise.race() 在 Promise 超时下的情况

在本节中，我们将使用`Promise.race()`来处理超时的 `Promise`。 以下辅助函数:

```js
function resolveAfter(ms, value=undefined) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(value), ms);
  });
}
```

`resolveAfter()` 主要做的是在指定的时间内，返回一个状态为 `resolve` 的 `Promise`，值为为传入的 `value`

调用上面方法：

```js
function timeout(timeoutInMs, promise) {
  return Promise.race([
    promise,
    resolveAfter(timeoutInMs,
      Promise.reject(new Error('Operation timed out'))),
  ]);
}
```

`timeout()` 返回一个`Promise`，该 `Promise` 的状态取决于传入 `promise` 状态 。

其中 `timeout` 函数中的 `resolveAfter(timeoutInMs, Promise.reject(new Error('Operation timed out'))` ，通过 `resolveAfter` 定义可知，该结果返回的是一个被拒绝状态的 `Promise`。

再来看看`timeout(timeoutInMs, promise)`的运行情况。如果传入`promise`在指定的时间之前状态为完成时，`timeout` 返回结果就是一个完成状态的 `Promise`,可以通过`.then`的第一个回调参数处理返回的结果。

```js
timeout(200, resolveAfter(100, 'Result!'))
  .then(result => assert.equal(result, 'Result!'));
```

相反，如果是在指定的时间之后完成，刚 `timeout` 返回结果就是一个拒绝状态的 `Promise`,从而触发`catch`方法指定的回调函数。

```js
timeout(100, resolveAfter(2000, 'Result!'))
  .catch(err => assert.deepEqual(err, new Error('Operation timed out')));
```

重要的是要了解“Promise 超时”的真正含义：

1.  如果传入入`Promise` 较到的得到解决，其结果就会给返回的 `Promise`。
2.  如果没有足够快得到解决，输出的 `Promise` 的状态为拒绝。

也就是说，超时只会阻止传入的Promise，影响输出 Promise（因为Promise只能解决一次）， 但它并没有阻止传入`Promise`的异步操作。

### Promise.race() 的一个简版实现

以下是 `Promise.race()`的一个简化实现(它不执行安全检查)

```javascript
function race(iterable) {
  return new Promise((resolve, reject) => {
    for (const promise of iterable) {
      promise.then(
        (value) => {
          if (settlementOccurred) return;
          settlementOccurred = true;
          resolve(value);
        },
        (err) => {
          if (settlementOccurred) return;
          settlementOccurred = true;
          reject(err);
        });
    }
    let settlementOccurred = false;
  });
}
```

## 6.Promise.allSettled()

`promise.allsettle()`

> `Promise.allSettled<T>(promises: Iterable<**Promise**<T>>): Promise<Array<SettlementObject<T>>>`

它返回一个`Array`的`Promise`，其元素具有以下类型特征：

```ts
type SettlementObject<T> = FulfillmentObject<T> | RejectionObject;

interface FulfillmentObject<T> {
  status: 'fulfilled';
  value: T;
}

interface RejectionObject {
  status: 'rejected';
  reason: unknown;
}
```

`Promise.allSettled()`方法返回一个promise，该promise在所有给定的promise已被解析或被拒绝后解析，并且每个对象都描述每个promise的结果。

举例说明, 比如各位用户在页面上面同时填了3个独立的表单, 这三个表单分三个接口提交到后端, 三个接口独立, 没有顺序依赖, 这个时候我们需要等到请求全部完成后给与用户提示表单提交的情况

在多个`promise`同时进行时咱们很快会想到使用`Promise.all`来进行包装, 但是由于`Promise.all`的短路特性, 三个提交中若前面任意一个提交失败, 则后面的表单也不会进行提交了, 这就与咱们需求不符合.

`Promise.allSettled`跟`Promise.all`类似, 其参数接受一个`Promise`的数组, 返回一个新的`Promise`, 唯一的不同在于, 其不会进行短路, 也就是说当`Promise`全部处理完成后我们可以拿到每个`Promise`的状态, 而不管其是否处理成功.

### Promise.allSettled() 例子

这是`Promise.allSettled()` 使用方式快速演示示例

```javascript
Promise.allSettled([
  Promise.resolve('a'),
  Promise.reject('b'),
])
.then(arr => assert.deepEqual(arr, [
  { status: 'fulfilled', value:  'a' },
  { status: 'rejected',  reason: 'b' },
]));
```

### Promise.allSettled() 较复杂点的例子

这个示例类似于`.map()`和`Promise.all()`示例(我们从其中借用了`downloadText()`函数):我们下载多个文本文件，这些文件的`url`存储在一个数组中。但是，这一次，咱们不希望在出现错误时停止，而是希望继续执行。`Promise.allSettled()`允许咱们这样做：

```js
const urls = [
  'http://example.com/exists.txt',
  'http://example.com/missing.txt',
];

const result = Promise.allSettled(
  urls.map(u => downloadText(u)));
result.then(
  arr => assert.deepEqual(
    arr,
    [
      {
        status: 'fulfilled',
        value: 'Hello!',
      },
      {
        status: 'rejected',
        reason: new Error('Not Found'),
      },
    ]
));
```

### Promise.allSettled() 的简化实现

这是`promise.allsettle()`的简化实现(不执行安全检查)

```javascript
function allSettled(iterable) {
  return new Promise((resolve, reject) => {
    function addElementToResult(i, elem) {
      result[i] = elem;
      elementCount++;
      if (elementCount === result.length) {
        resolve(result);
      }
    }

    let index = 0;
    for (const promise of iterable) {
      // Capture the current value of `index`
      const currentIndex = index;
      promise.then(
        (value) => addElementToResult(
          currentIndex, {
            status: 'fulfilled',
            value
          }),
        (reason) => addElementToResult(
          currentIndex, {
            status: 'rejected',
            reason
          }));
      index++;
    }
    if (index === 0) {
      resolve([]);
      return;
    }
    let elementCount = 0;
    const result = new Array(index);
  });
}
```

## 7.  短路特性

`Promise.all()` 和 `romise.race()` 都具有 短路特性

* **Promise.all()**： 如果参数中 `promise` 有一个失败（rejected），此实例回调失败（reject）
- **Promise.race()**：如果参数中某个`promise`解决或拒绝，返回的 promise就会解决或拒绝。

## 8. 并发性和 Promise.all()

### 顺序执行与并发执行

考虑下面的代码：

```js
asyncFunc1()
  .then(result1 => {
    assert.equal(result1, 'one');
    return asyncFunc2();
  })
  .then(result2 => {
    assert.equal(result2, 'two');
  });
```

使用`.then()`顺序执行基于`Promise`的函数：只有在 `asyncFunc1()`的结果被解决后才会执行`asyncFunc2()` 。

而 `Promise.all()` 是并发执行的

```js
Promise.all([asyncFunc1(), asyncFunc2()])
  .then(arr => {
    assert.deepEqual(arr, ['one', 'two']);
  });
```

### 并发技巧：关注操作何时开始

确定并发异步代码的技巧:关注异步操作何时启动，而不是如何处理它们的**Promises**。

例如，下面的每个函数都同时执行`asyncFunc1()`和`asyncFunc2()`，因为它们几乎同时启动。

```js
function concurrentAll() {
  return Promise.all([asyncFunc1(), asyncFunc2()]);
}

function concurrentThen() {
  const p1 = asyncFunc1();
  const p2 = asyncFunc2();
  return p1.then(r1 => p2.then(r2 => [r1, r2]));
}
```

另一方面，以下两个函数依次执行`asyncFunc1()`和`asyncFunc2()`: `asyncFunc2()`仅在`asyncFunc1()`的解决之后才调用。

```js
function sequentialThen() {
  return asyncFunc1()
    .then(r1 => asyncFunc2()
      .then(r2 => [r1, r2]));
}

function sequentialAll() {
  const p1 = asyncFunc1();
  const p2 = p1.then(() => asyncFunc2());
  return Promise.all([p1, p2]);
}
```

### Promise.all() 与 Fork-Join 分治编程

`Promise.all()` 与并发模式“fork join”松散相关。重温一下咱们前面的一个例子：

```js
Promise.all([
    // (A) fork
    downloadText('http://example.com/first.txt'),
    downloadText('http://example.com/second.txt'),
  ])
  // (B) join
  .then(
    (arr) => assert.deepEqual(
      arr, ['First!', 'Second!']
    ));
```

*   Fork：在`A`行中，分割两个异步任务并同时执行它们。
*   Join：在`B`行中，对每个小任务得到的结果进行汇总。
