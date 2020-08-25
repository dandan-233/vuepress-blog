---
data: 2020-8-25
tag:
  - react
  - react-app-rewired
  - viewport
  - 移动端
author: pengpeng
location: Beijing
---

# create-react-app构建react,使用react-app-rewired配置viewport移动端适配
## create-react-app构建react项目
### 安装 create-react-app

```bash
yarn add create-react-app
```

### 构建项目

```bash
create-react-app 项目名称
```

**<span style="color:red">不使用 eject</span>**

## 使用 react-app-rewired 配置

### 安装相关依赖包

 react-app-rewired@2.x需要 customize-cra

```bash
yarn add react-app-rewired customize-cra -D
```

### 添加相关配置文件

在根目录下创建名为  config-overrides.js 的相关配置文件,配置内容如下

```js
const { override, fixBabelImports } = require('customize-cra');
module.exports = override();
```

### 修改 package.json 启动命令

``` json
"scripts": {
-    "start": "react-scripts start",
+    "start": "react-app-rewired start",
-    "build": "react-scripts build",
+    "build": "react-app-rewired build",
-    "test": "react-scripts test",
+    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  },
```



## 添加viewport移动端自适应方案

### 安装相关依赖包

```bash
yarn add postcss-aspect-ratio-mini postcss-px-to-viewport postcss-write-svg postcss-cssnext postcss-viewport-units cssnano cssnano-preset-advanced
```

### 在 config-overrides.js中添加配置

```js
const { override} = require('customize-cra');
const rewireLess = require('react-app-rewire-less');
const addCustomize = () => config => {
  require('react-app-rewire-postcss')(config, {
        plugins: loader => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
                autoprefixer: {
                    flexbox: 'no-2009',
                },
                stage: 3,
            }),
            require('postcss-aspect-ratio-mini')({}),
            require('postcss-px-to-viewport')({
                viewportWidth: 750, // (Number) The width of the viewport.
                viewportHeight: 1334, // (Number) The height of the viewport.
                unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
                viewportUnit: 'vw', // (String) Expected units.
                selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
                minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
                mediaQuery: false // (Boolean) Allow px to be converted in media queries.
            }),
            require('postcss-write-svg')({
                utf8: false
            }),
            require('postcss-viewport-units')({}),
            require('cssnano')({
                preset: "advanced",
                autoprefixer: false,
                "postcss-zindex": false
            })
        ]
    });
  return config;
}

module.exports = override(
  addCustomize(),
);
```

### 引入阿里cdn

在 index.html中'<head>'标签添加

```html
<script src="//g.alicdn.com/fdilab/lib3rd/viewport-units-buggyfill/0.6.2/??viewport-units-buggyfill.hacks.min.js,viewport-units-buggyfill.min.js"></script>
```

在body中添加 js

```html
<script>
  window.onload = function () {
    window.viewportUnitsBuggyfill.init({
      hacks: window.viewportUnitsBuggyfillHacks
    });
  }
</script>
```

## 添加 less 预处理器

### 安装依赖

```bash
yarn add less less-loader
```

### 在 config-overrides.js 添加配置

> 注意: less-loader 版本6.0 之前与之后配置方式不同
>
> 可能引发一下错误:
>
> ValidationError: Invalid options object. Less Loader has been initialized using an options object that does not match the API schema

``` js
const { override, addLessLoader } = require('customize-cra');
module.exports = override(
  addLessLoader({
    // javascriptEnabled: true, less-loader 6.0 之前
    lessOptions: {
      javascriptEnabled: true,
    },
  }),
  addCustomize(),
);
```

