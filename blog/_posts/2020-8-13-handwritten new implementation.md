---
data: 2020-8-13
tag:
  - js
  - 手写 js 方法
author: pengpeng
location: Beijing
---
# 手写实现 new

> 创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

## new 做了哪些事

1. 第一个参数为构造函数，其他参数传给构造函数
2. 实例对象需要访问构造函数的属性，所以我们通过原型链将两者联系起来。使用Object.create返回一个新对象
3. 调用构造函数，将this指向新创建的对象obj,并且传入剩余的参数
4. 判断构造函数返回值是否为对象，如果为对象就使用构造函数返回的值，否则返回 `obj`

> 补充:
>
> **`Object.create()`**方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`。

## 手写实现

```js
function new0(){
    // 取参数的第一项为构造函数fn,这里可以写(arguments,1)也可以直接(arguments)，都是代表参数的第一项，取构造函数
    let constructor = [].shift.call(arguments);

    // 将obj.__proto__连接到构造函数fn的原型
    // obj.__proto__ = constructor.prototype;
    //连接原型链,obj.__proto__ 不标准
    obj = Object.create(constructor.prototype)  //Object.create返回对象的属性__proto__,指向传入的对象
    // result接收构造函数执行后的返回结果
    let result = constructor.apply(obj, arguments);
    // 如果构造函数返回一个对象，则将该对象返回，否则返回步骤1创建的对象
    return result instanceof Object ? result : obj;
}
```

### 原型链

![原型链](./../.vuepress/public/202008/prototype-chain.png)