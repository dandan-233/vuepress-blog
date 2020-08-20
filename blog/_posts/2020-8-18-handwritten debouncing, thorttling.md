---
data: 2020-8-18
tag:
  - js
  - 手写 js 方法
  - 重新学习
author: pengpeng
location: Beijing
---

# 重新学习 手写防抖( Debouncing ) 和节流 ( Throttling )

> `scroll` 事件本身会触发页面的重新渲染，同时 `scroll` 事件的 `handler` 又会被高频度的触发, 因此事件的 `handler` 内部不应该有复杂操作，例如 `DOM` 操作就不应该放在事件处理中。 针对此类高频度触发事件问题（例如页面 `scroll` ，屏幕 `resize`，监听用户输入等），有两种常用的解决方法，防抖和节流。

## 防抖 ( Debouncing )

典型应用：

1. search搜索联想，用户在不断输入值时，用防抖来节约请求资源。
2. window触发resize的时候，不断的调整浏览器窗口大小会不断的触发这个事件，用防抖来让其只触发一次

**<span style="color: red">重新计时</span>**

> 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

## 节流 ( Throttling )

典型应用: 

1. 鼠标不断点击触发，mousedown(单位时间内只触发一次)
2. 监听滚动事件，比如是否滑到底部自动加载更多，用throttle来判断

**<span style="color: red">不会重新计时</span>**

> 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。

### 示例 

[点击查看示例](http://js.jirengu.com/viponizavo/4/) 

