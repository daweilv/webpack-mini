const fs = require('fs')
const path = require('path')
const { transformFileSync } = require('@babel/core')

/**
 * 读取资源文件，修改 import 语句，ES6 import/export 语法转换成 require/exports 的形式，并生成依赖图
 * @param {string} filePath - 资源文件路径
 */
function createGraph (filePath, moduleMap = {}) {
  if (moduleMap[filePath]) return moduleMap[filePath]

  const module = moduleMap[filePath] = {}
  const dirPath = path.dirname(filePath)
  const dependencies = []

  const visitor = {
    // 我们要修改的节点是 import 声明节点。
    ImportDeclaration ({ node }) {
      node.source.value = resolveFileName(dirPath, node.source.value)
      dependencies.push(createGraph(node.source.value, moduleMap))
    },

    // 添加 require() 语法支持
    CallExpression ({ node }) {
      if (node.callee.name === 'require') {
        node.arguments[0].value = resolveFileName(dirPath, node.arguments[0].value)
        dependencies.push(createGraph(node.arguments[0].value, moduleMap))
      }
    }
  }

  const { code } = transformFileSync(filePath, {
    presets: ['@babel/env'],
    plugins: [{
      // babel 提供的访问者模式
      visitor
    }]
  })

  module.filePath = filePath
  module.code = code
  module.dependencies = dependencies
  return module
}

/**
 * 递归遍历，将依赖图展开成平级的数组
 * @param {object} graphItem - 依赖图
 * @param {array} modules - 展开后的数组
 */
function flattenGraph (graphItem, modules = []) {
  if (graphItem._visited) return modules
  graphItem._visited = true
  // 这里将文件的绝对路径作为 module 的 id
  modules.push({ id: graphItem.filePath, code: graphItem.code })
  if (graphItem.dependencies.length) {
    graphItem.dependencies.forEach(o => {
      flattenGraph(o, modules)
    })
  }
  return modules
}

/**
 * 生成入口文件，拼接模块数组
 * @param {array} modules 模块数组
 */
function createBundle (modules) {
  return `(function (modules) {
    let cachedModules = {};
    function require(moduleId) {
        if(cachedModules[moduleId]) return cachedModules[moduleId].exports;
        let module = cachedModules[moduleId] =  {
          exports:{}
        };
        modules[moduleId].call(module.exports, module, module.exports, require);
        return module.exports;
    }
    require("${modules[0].id}")
})({${modules.map(module =>
    (`"${module.id}":${generateModuleTemplate(module.code)}`))}})`
}

function generateModuleTemplate (code) {
  return `function (module, exports, require) {
    ${code}
}`
}

function generateFile (str) {
  fs.writeFileSync('./dist/bundle.js', str)
}

function resolveFileName (dirname, filePath) {
  // 补全绝对路径
  if (!path.isAbsolute(filePath)) filePath = path.resolve(dirname || __dirname, filePath)
  // 自动添加 .js ，支持不带 .js 后缀引用文件
  return path.extname(filePath) ? filePath : filePath + '.js'
}

function webpackMini (fileEntry) {
  const graph = createGraph(resolveFileName(__dirname, fileEntry))
  // console.log(graph);
  const modules = flattenGraph(graph)
  // console.log(modules);
  const bundle = createBundle(modules)
  // console.log(bundle);
  generateFile(bundle)
}

webpackMini('../src/index.js')
