# webpack-mini

从零实现一个 JS 模块打包器

## 如何使用

```bash
git clone https://github.com/daweilv/webpack-mini.git

cd webpack-mini

npm i

git checkout step1
```

## 实现

### 一、实现一个 es6 module 打包功能

该分支实现了对 es6 module，即 import/export 语法代码的打包。执行 `node webpack-mini/index.js` 把 `src` 下的代码打包成一个 `bundle.js` 。
代码见[分支 step1](https://github.com/daweilv/webpack-mini/tree/step1)，详细分析请[查看文章](https://daweilv.com/2019/08/20/从零实现一个JS模块打包器/)。

### 二、支持 commonjs 打包
有了 es6 module 都已经啃下来了，commonjs 的 module.exports/require 就很简单了。
代码见[分支 step1](https://github.com/daweilv/webpack-mini/tree/step2)

### 三、优化
todo