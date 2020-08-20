---
data: 2020-8-14
tag:
  - js
  - 手写 js 方法
author: pengpeng
location: Beijing
---

# 重新学习 手写实现 Promise

## 概念

**Promise** 对象用于表示一个异步操作的最终完成 (或失败), 及其结果值.本质上Promise是一个函数返回的对象，我们可以在它上面绑定回调函数，这样我们就不需要在一开始把回调函数作为参数传入这个函数了。

### 概念逻辑示例

假设有 `createAudioFileAsync()` 函数，它接收一些配置和两个回调函数，然后异步地生成音频文件。一个回调函数在文件成功创建时被调用，另一个则在出现异常时被调用。

 `createAudioFileAsync()` 的示例：

```js
// 成功的回调函数
function successCallback(result) {
  console.log("音频文件创建成功: " + result);
}

// 失败的回调函数
function failureCallback(error) {
  console.log("音频文件创建失败: " + error);\
}

createAudioFileAsync(audioSettings, successCallback, failureCallback)
```

现在函数返回一个 promise 对象，可以将回调函数绑定在该 promise 上：

```js
const promise = createAudioFileAsync(audioSettings); 
promise.then(successCallback, failureCallback);
```

### Promise 约定

不同于“老式”的传入回调，在使用 Promise 时，会有以下约定：

- 在本轮 [事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop#执行至完成) 运行完成之前，回调函数是不会被调用的。
- 即使异步操作已经完成（成功或失败），在这之后通过 [`then()` ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)添加的回调函数也会被调用。
- 通过多次调用 `then()` 可以添加多个回调函数，它们按照插入顺序执行。

Promise 的链式调用**（**chaining）。

### 链式调用**（**chaining）

连续执行两个或者多个异步操作(并行任务)是一个常见的需求，在上一个操作执行成功之后(异步执行完成之后)，开始下一个的操作(依赖上个操作异步返回的结果)，并带着上一步操作所返回的结果。我们可以通过创造一个 **Promise 链**来实现这种需求。

**`then()` 函数返回的结果是新的 Promise**：

```js
const promise = doSomething();
const promise2 = promise.then(successCallback, failureCallback);
```

`promise2` 不仅表示 `doSomething()` 函数的完成，也代表了你传入的 `successCallback` 或者 `failureCallback` 的完成，promise2 是(`successCallback` 或者 `failureCallback` )最后返回的 Promise 对象，从而形成另一个异步操作，这样的话，在 `promise2` 上新增的回调函数会排在这个 Promise 对象的后面。

基本上，每一个 Promise 都代表了链中另一个异步过程的完成。

在过去，做多重的异步操作，会导致经典的回调地狱：

```js
doSomething(function(result) {
  doSomethingElse(result, function(newResult) {
    doThirdThing(newResult, function(finalResult) {
      console.log('Got the final result: ' + finalResult);
    }, failureCallback);
  }, failureCallback);
}, failureCallback);
```

现在，我们可以把回调绑定到返回的 Promise 上，形成一个 Promise 链：

```js
doSomething().then(function(result) {
  return doSomethingElse(result);
})
.then(function(newResult) {
  return doThirdThing(newResult);
})
.then(function(finalResult) {
  console.log('Got the final result: ' + finalResult);
})
.catch(failureCallback);
```

then里的参数是可选的，`catch(failureCallback)` 是 `then(null, failureCallback)` 的缩略形式。如下所示，我们也可以用[箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)来表示：

```js
doSomething()
.then(result => doSomethingElse(result))
.then(newResult => doThirdThing(newResult))
.then(finalResult => {
  console.log(`Got the final result: ${finalResult}`);
})
.catch(failureCallback);
```

> **注意：**一定要有返回值，否则，callback 将无法获取上一个 Promise 的结果。(如果使用箭头函数，`() => x` 比 `() => { return x; }` 更简洁一些，但后一种保留 `return` 的写法才支持使用多个语句）。

### Catch 的后续链式操作

有可能会在一个回调失败之后继续使用链式操作，即 使用一个 `catch`，这对于在链式操作中抛出一个失败之后，再次进行新的操作很有用：

```js
new Promise((resolve, reject) => {
    console.log('初始化');
    resolve();
})
.then(() => {
    throw new Error('有哪里不对了');
    console.log('执行「这个」”');
})
.catch(() => {
    console.log('执行「那个」');
})
.then(() => {
    console.log('执行「这个」，无论前面发生了什么');
});
// 输出
初始化
执行「那个」
执行「这个」，无论前面发生了什么
```

> 因为抛出了错误 有哪里不对了，所以前一个 执行「这个」 没有被输出。

### 错误传递

通常，一遇到异常抛出，浏览器就会顺着promise链寻找下一个 `onRejected` 失败回调函数或者由 `.catch()` 指定的回调函数。

同步代码异常捕获

```js
try {
  let result = syncDoSomething();
  let newResult = syncDoSomethingElse(result);
  let finalResult = syncDoThirdThing(newResult);
  console.log(`Got the final result: ${finalResult}`);
} catch(error) {
  failureCallback(error);
}
```

在 ECMAScript 2017 标准的 `async/await` 语法糖中

```js
async function foo() {
  try {
    const result = await doSomething();
    const newResult = await doSomethingElse(result);
    const finalResult = await doThirdThing(newResult);
    console.log(`Got the final result: ${finalResult}`);
  } catch(error) {
    failureCallback(error);
  }
}
```

### Promise 拒绝事件

当 Promise 被拒绝时，会有下文所述的两个事件之一被派发到全局作用域（通常而言，就是[`window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)；如果是在 web worker 中使用的话，就是 [`Worker`](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker) 或者其他 worker-based 接口）。这两个事件如下所示：

[`rejectionhandled`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/rejectionhandled_event)

当 Promise 被拒绝、并且在 `reject` 函数处理该 rejection 之后会派发此事件。

[`unhandledrejection`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/unhandledrejection_event)

当 Promise 被拒绝，但没有提供 `reject` 函数来处理该 rejection 时，会派发此事件。

以上两种情况中，[`PromiseRejectionEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/PromiseRejectionEvent) 事件都有两个属性，一个是 [`promise`](https://developer.mozilla.org/zh-CN/docs/Web/API/PromiseRejectionEvent/promise) 属性，该属性指向被驳回的 Promise，另一个是 [`reason`](https://developer.mozilla.org/zh-CN/docs/Web/API/PromiseRejectionEvent/reason) 属性，该属性用来说明 Promise 被驳回的原因。

因此，我们可以通过以上事件为 Promise 失败时提供补偿处理，也有利于调试 Promise 相关的问题。在每一个上下文中，该处理都是全局的，因此不管源码如何，所有的错误都会在同一个handler中被捕捉处理。

一个特别有用的例子：当你使用 [Node.js](https://developer.mozilla.org/zh-CN/docs/Glossary/Node.js) 时，有些依赖模块可能会有未被处理的 rejected promises，这些都会在运行时打印到控制台。你可以在自己的代码中捕捉这些信息，然后添加与 [`unhandledrejection`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/unhandledrejection_event) 相应的 handler 来做分析和处理，或只是为了让你的输出更整洁。举例如下：

```js
window.addEventListener("unhandledrejection", event => {
  /* 你可以在这里添加一些代码，以便检查
     event.promise 中的 promise 和
     event.reason 中的 rejection 原因 */

  event.preventDefault();
}, false);
```

调用 event 的 [`preventDefault()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault) 方法是为了告诉 JavaScript 引擎当 promise 被拒绝时不要执行默认操作，默认操作一般会包含把错误打印到控制台。

理想情况下，在忽略这些事件之前，我们应该检查所有被拒绝的 Promise，来确认这不是代码中的 bug。

## 创建 Promise

### Promise

- **解决（fulfill）**：指一个 promise 成功时进行的一系列操作，如状态的改变、回调的执行。虽然规范中用 `fulfill` 来表示解决，但在后世的 promise 实现多以 `resolve` 来指代之。
- **拒绝（reject）**：指一个 promise 失败时进行的一系列操作。
- **终值（eventual value）**：所谓终值，指的是 promise 被**解决**时传递给解决回调的值，由于 promise 有**一次性**的特征，因此当这个值被传递时，标志着 promise 等待态的结束，故称之终值，有时也直接简称为值（value）。
- **据因（reason）**：也就是拒绝原因，指在 promise 被**拒绝**时传递给拒绝回调的值。

---

Promise 表示一个异步操作的最终结果，与之进行交互的方式主要是 `then` 方法，该方法注册了两个回调函数，用于接收 promise 的终值或本 promise 不能执行的原因。

#### 状态

* pending(等待)
* fulfilled(成功执行结果)
* rejected(失败拒绝原因)

#### then方法

promise 必须提供一个 then 方法访问其当前的终值 和 拒因

promise 的 `then` 方法接受两个参数：

```
promise.then(onFulfilled, onRejected)
```

### 参数可选

`onFulfilled` 和 `onRejected` 都是可选参数。

- 如果 `onFulfilled` 不是函数，其必须被忽略
- 如果 `onRejected` 不是函数，其必须被忽略

### `onFulfilled` 特性

如果 `onFulfilled` 是函数：

- 当 `promise` 执行结束后其必须被调用，其第一个参数为 `promise` 的终值
- 在 `promise` 执行结束前其不可被调用
- 其调用次数不可超过一次

### `onRejected` 特性

如果 `onRejected` 是函数：

- 当 `promise` 被拒绝执行后其必须被调用，其第一个参数为 `promise` 的据因
- 在 `promise` 被拒绝执行前其不可被调用
- 其调用次数不可超过一次

### 调用时机

`onFulfilled` 和 `onRejected` 只有在[执行环境](http://es5.github.io/#x10.3)堆栈仅包含**平台代码**时才可被调用 

### 调用要求

`onFulfilled` 和 `onRejected` 必须被作为函数调用（即没有 `this` 值）

### 多次调用

`then` 方法可以被同一个 `promise` 调用多次

- 当 `promise` 成功执行时，所有 `onFulfilled` 需按照其注册顺序依次回调
- 当 `promise` 被拒绝执行时，所有的 `onRejected` 需按照其注册顺序依次回调

### 返回

`then` 方法必须返回一个 `promise` 对象 

```
promise2 = promise1.then(onFulfilled, onRejected);
```

- 如果 `onFulfilled` 或者 `onRejected` 返回一个值 `x` ，则运行下面的 **Promise 解决过程**：`[[Resolve]](promise2, x)`
- 如果 `onFulfilled` 或者 `onRejected` 抛出一个异常 `e` ，则 `promise2` 必须拒绝执行，并返回拒因 `e`
- 如果 `onFulfilled` 不是函数且 `promise1` 成功执行， `promise2` 必须成功执行并返回相同的值
- 如果 `onRejected` 不是函数且 `promise1` 拒绝执行， `promise2` 必须拒绝执行并返回相同的据因

**译者注：** 理解上面的“返回”部分非常重要，即：**不论 `promise1` 被 reject 还是被 resolve 时 `promise2` 都会被 resolve，只有出现异常时才会被 rejected**。

### 代码实现

```js
// promise的状态枚举
const STATUS = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2
}

class Promise {
  constructor(task) {    
    // promise初始状态
    this.status = STATUS.PENDING;
    // resolve时返回的数据
    this.resolveData = null;
    // reject时返回的数据
    this.rejectData = null;

    // resolve和reject时执行的回调队列
    // promise的resolve和reject为异步响应时，即调用then时promise为
    // pending状态，则将传入then的函数加入该队列，等待promise resolve或
    // reject时执行该队列
    this.onFulfilledList = [];
    this.onRejectedList = [];

    /**
    * promise成功，执行onFulfilledList回调
    * @param {*} data 
    */
    this.onResolve = (data) => {
      if(this.status === STATUS.PENDING) {
        this.status = STATUS.FULFILLED;
        this.resolveData = data;
        this.onFulfilledList.forEach(fn => {
          fn(this.resolveData)
        })
      }
    }

    /**
    * promise失败，执行onRejectedList回调
    * @param {*} err 
    */
    this.onReject = (err) => {
      if(this.status === STATUS.PENDING) {
        this.status = STATUS.REJECTED;
        this.rejectData = err;
        this.onRejectedList.forEach(fn => {
          fn(this.rejectData)
        })
      }
    }
    
    /**
    * promise解析, 根据then 返回数据类型不同封装不同的promise
    * 返回，以便实现then的链式调用及Promise的thenable特性 
    * @param {*当前then return数据} data 
    * @param {*当前then的resolve} resolve 
    * @param {*当前then的reject} reject 
    */
    this.resolvePromise = (data, resolve, reject) => {
      // then return 的数据是一个promise
      if(data instanceof Promise) {
        if(data.status === STATUS.PENDING) {
          data.then((val) => {
            this.resolvePromise(val, resolve, reject);
          }, reject)
        } else if (data.status === STATUS.FULFILLED) {
          resolve(data.resolveData)
        } else {
          reject(data.rejectData)
        }
      } 

      // then return的是一个对象,若对象具有then方法，则可使用此方法作为新的then
      // Promise的thenable特性基于此
      else if(data !== null && data instanceof Object) {
        try {
          let then = data.then
          if(then instanceof Function) {
            then.call(data, (val) => {
              this.resolvePromise(val, resolve, reject);
            }, reject)
          } else {
            resolve(data)
          }
        } catch (err) {
          reject(err)
        }
      }

      // then return 的是基本数据或undefined
      else {
        resolve(data)
      }
    }

    // 执行传入的任务task
    try {
      task(this.onResolve.bind(this), this.onReject.bind(this))
    } catch (err) {
      this.onReject(err)
    }
  }

  /**
  * then回调，返回一个promise
  * 说明：传入then的参数不是函数的话，直接忽略，及在返回的新promise中直接resolve或reject目前
  * promise的数据，传入then的参数是函数的话，则直接已目前promise的数据为参数执行该函数，并
  * 根据函数返回值情况确定新promise的状态
  * @param {*成功} onFulfilled 
  * @param {*失败} onRejected 
  */

  then(onFulfilled, onRejected) {
    let promise;
    // pending状态下将传入then的函数加入promise对应的回调队列
    // 等待promise状态改变后执行
    if(this.status === STATUS.PENDING) {
      promise = new Promise((resolve, reject) => {
        this.onFulfilledList.push(() => {
          // 传入then的参数不是函数则忽略
          if(!(onFulfilled instanceof Function)) {
            resolve(this.resolveData)
          } else {
            let data = onFulfilled(this.resolveData)
            this.resolvePromise(data, resolve, reject)
          }
        })
        this.onRejectedList.push(() => {
          // 传入then的参数不是函数则忽略
          if(!(onRejected instanceof Function)) {
            reject(this.rejectData)
          } else {
            let data = onRejected(this.rejectData)
            this.resolvePromise(data, resolve, reject)
          } 
        })
      })
    }

    // fulfilled状态下以promise的resolveData为参数执行传入then的
    // 成功回调函数，再根据此函数的返回值封装新的promise返回
    else if (this.status === STATUS.FULFILLED) {
      promise = new Promise((resolve, reject) => {
        // 传入then的参数不是函数则忽略，直接resolve
        if(!(onFulfilled instanceof Function)) {
          resolve(this.resolveData)
        } else {
          let data = onFulfilled(this.resolveData)
          this.resolvePromise(data, resolve, reject)
        }      
      })
    }
    // rejected状态类似fulfilled状态
    else {
      promise = new Promise((resolve, reject) => {
        // 传入then的参数不是函数则忽略，直接reject
        if(!(onRejected instanceof Function)) {
          reject(this.rejectData)
        } else {
          let data = onRejected(this.rejectData)
          this.resolvePromise(data, resolve, reject)
        }        
      })
    }
    return promise
  }

  /**
  * catch方法
  * @param {*reject函数} rejectFn 
  */
  catch(rejectFn) {
    //不是函数直接返回
    if(!(rejectFn instanceof Function)) {
      return
    }
    if(this.status === STATUS.PENDING) {  
      this.onRejectedList.push(() => {
        // 没有错误信息则不执行catch中的函数
        if(this.rejectData !== null) {
          rejectFn(this.rejectData)
        } 
      })
    } else if (this.status = STATUS.REJECTED) {
      // 没有错误信息则不执行catch中的函数
      if(this.rejectData !== null) {
        rejectFn(this.rejectData)
      }    
    }      
  }

  /**
  * resolve方法，
  * value为promise直接返回返回一个以value为resolveData的完成态promise
  * @param {*} value 
  */
  static resolve(value) {
    if(value instanceof Promise) {
      return value
    }
    return new Promise((resolve, reject) => {    
      resolve(value)
    })
  }

  /**
  * reject方法，类似resolve方法
  * @param {*} value 
  */
  static reject(value) {
    if(value instanceof Promise) {
      return value
    }
    return new Promise((resolve, reject) => {    
      reject(value)
    })
  }

  /**
  * all方法，返回一个新的promise
  * 参数为promise数组
  * 成功的时候返回的是一个结果数组，而失败的时候则返回最先被reject失败状态的值。
  * @param {*} promiseArray
  */

  static all(promiseArray) {
    if(!(promiseArray instanceof Array)) {
      throw new TypeError("parameter must be array")
    }
    let result = []
    let i = 0
    return new Promise((resolve, reject) => {
      if(promiseArray.length === 0) {
        resolve(result)
      } else {
        promiseArray.forEach((item, index) => {
          if(item instanceof Promise) {
            item.then(res => {
              result[index] = res
              i++
              if(i === promiseArray.length) {
                resolve(result)
              }
            }, err => {
              reject(err)
            })
          } 

          // 如果传入的不是promise，则直接作为结果填入结果数组中
          else {
            result[index] = item
            i++
            if(i === promiseArray.length) {
              resolve(result)
            }
          }
        })
      }
    })  
  }

  /**
  * race方法，返回一个新的promise
  * 参数为promise数组
  * 返回最先执行完的promise的结果，不论resolve还是reject
  * @param {*} promiseArray 
  */
  static race(promiseArray) {
    if(!(promiseArray instanceof Array)) {
      throw new TypeError("parameter must be array")
    }
    // 标识符，有一个promise执行完成设为true，返回结果
    let flag = false
    return new Promise((resolve, reject) => {
      promiseArray.forEach((item) => {
        if(item instanceof Promise) {
          item.then(res => {
            if(!flag) {
              flag = true
              resolve(res)
            }
          }, err => {
            if(!flag) {
              flag = true
              reject(err)
            }          
          })
        } 

        // 如果传入的不是promise，则直接作为结果
        else {
          if(!flag) {
            flag = true
            resolve(item)
          }
        }
      })
    })
  }
}

```





