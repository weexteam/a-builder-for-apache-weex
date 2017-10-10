/**
 * Created by exolution on 17/1/6.
 */
const WebpackBuilder = require('./WebpackBuilder')
const fs = require('fs')
const pathTool = require('path')
const webpack = require('webpack')
const BannerPlugin = require('../plugin/WebpackBannerPlugin')
const ext2framework = {
  '.vue': 'Vue',
  '.we': 'Weex',
  '.js': 'Vue'
}
let defaultExt = ['we', 'vue', 'js']
class WeexBuilder extends WebpackBuilder {
  constructor(source, dest, options = {}) {
    if (options.ext && typeof options.ext === 'string') {
      options.ext = options.ext.split(/,|\|/).filter(e => defaultExt.indexOf(e) === -1).concat(defaultExt).join('|')
    } else {
      options.ext = defaultExt.join('|')
    }
    super(source, dest, options)
  }
  loadModulePath(moduleName, extra) {
    try {
      let path = require.resolve(pathTool.join(moduleName, extra || ''))
      return path.slice(0, path.lastIndexOf(moduleName) + moduleName.length)
    } catch (e) {
      return moduleName
    }
  }
  initConfig() {
    super.initConfig()
    let weexLoader = this.loadModulePath('weex-loader')
    let vueLoader = this.loadModulePath('vue-loader')
    let bannerPlugin = new BannerPlugin(function (file) {
        let ext = pathTool.extname(file)
        return '// { "framework": "' + ext2framework[ext] + '" }'
      })
      // webpack entry config
    this.config.entry = this.source.map(s => s + '?entry=true')
      // webpack watch config
    this.config.watch = this.options.watch || false
      // webpack devtool config
    this.config.devtool = this.options.devtool || ''
      // webpack module config
    this.config.module.loaders.push({
      test: /\.js(\?[^?]+)?$/,
      loader: this.loadModulePath('babel-loader'),
      exclude: /node_modules/
    })
    this.config.module.loaders.push({
      test: /\.we(\?[^?]+)?$/,
      loader: weexLoader
    })
    if (this.options.web) {
      this.config.module.loaders.push({
        test: /\.vue(\?[^?]+)?$/,
        loader: vueLoader
      })
    } else {
      this.config.module.loaders.push({
        test: /\.vue(\?[^?]+)?$/,
        loader: weexLoader
      })
    }
    // webpack resolve config
    this.config.resolveLoader = {
      root: pathTool.dirname(weexLoader)
    }
    this.config.resolve = {
      alias: {
        'babel-runtime': this.loadModulePath('babel-runtime', 'core-js'),
        'babel-polyfill': this.loadModulePath('babel-polyfill'),
      }
    }

    this.config.babel = {
      presets: [this.loadModulePath('babel-preset-es2015'), this.loadModulePath('babel-preset-stage-0')],
      plugins: [
        this.loadModulePath('babel-plugin-transform-runtime'),
        this.loadModulePath('babel-plugin-add-module-exports')
      ], 
      babelrc: true
    }

    // webpack plugins config
    if (this.options.min) {
      this.config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }))
    }
    this.config.plugins.push(bannerPlugin)
    if (this.options.onProgress) {
      this.config.plugins.push(new webpack.ProgressPlugin(this.options.onProgress))
    }
  }
}
module.exports = WeexBuilder
