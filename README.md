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
代码见[分支 step1](https://github.com/daweilv/webpack-mini/tree/step1)，详细分析请[查看文章](https://www.lvdawei.com/post/build-your-own-js-packer)。

### 二、支持 commonjs 打包

es6 module 都已经啃下来了，commonjs 的 module.exports/require 就很简单了。
代码见[分支 step2](https://github.com/daweilv/webpack-mini/tree/step2)

### 三、优化

- [x] 模块缓存
- [x] 循环依赖
- [x] 省略后缀的文件查找

代码见[分支 step3](https://github.com/daweilv/webpack-mini/tree/step3)

nodejs 官网经典依赖的[例子测试](https://nodejs.org/api/modules.html#modules_cycles)
```
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```
