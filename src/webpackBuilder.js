/**
 * Created by exolution on 17/1/6.
 */
const path = require('path');
const sourcer = require('sourcer');
const webpack = require('webpack');
const util = require('./utils');
const _blank = '                                                            ';
module.exports = class WebpackBuilder {
  constructor (source, dest, options = {}) {
    const root = options.root || process.cwd();
    this.sourceDef = source;
    this.source = sourcer.find(root, source, {
      recursive: true
    });
    this.base = sourcer.base(source);
    if (options.ext) {
      const reg = new RegExp('\\.(' + options.ext + ')$');
      this.source = this.source.filter(s => reg.test(path.extname(s)));
    }
    this.dest = path.resolve(dest);
    this.options = options;
  }
  build (callback) {
    this.initConfig();
    let lastHash = null;
    if (this.source.length === 0) {
      return callback('no ' + (this.options.ext || '') + ' files found in source "' + this.sourceDef + '"');
    }
    const compiler = webpack(this.config);
    compiler.run((err, stats) => {
      let result = {
        toString: () => stats.toString({
          /** Add warnings */
          warnings: false,
          /** Add webpack version information */
          version: false,
          /** Add the hash of the compilation */
          hash: false,
          /** Add asset Information */
          assets: true,
          modules: false,
          /** Add built modules information to chunk information */
          chunkModules: false,
          /** Add the origins of chunks and chunk merging info */
          chunkOrigins: false,
          children: false,
          chunks: false,  // Makes the build much quieter
          colors: true    // Shows colors in the console
        })
      }
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return callback && callback(err);
      }
    
      const info = stats.toJson();
      if (stats.hasErrors()) {
        return callback && callback(info.errors);
      }
      callback && callback(err, result, info);
      // if (jsonStats.hash && jsonStats.hash === lastHash) {
      //   return;
      // }
      // lastHash = jsonStats.hash;
      // let errorString;
      // if (jsonStats.errors.length > 0) {
      //   errorString = '[webpack errors]\n' + jsonStats.errors.join('\n');
      //   return callback && callback(errorString, null, jsonStats);
      // }
      // const sizeMap = {};
      // jsonStats.assets.forEach(e => {
      //   sizeMap[e.name.split('.')[0]] = e.size;
      // });
      // const result = Object.keys(this.config.entry).map((e) => {
      // console.log(jsonStats.assetsByChunkName[e])
      
      //   return {
      //     from: path.join(this.base, e + path.extname(this.config.entry[e].split('?')[0])),
      //     to: path.join(this.dest, typeof jsonStats.assetsByChunkName[e] === 'string' ? jsonStats.assetsByChunkName[e] : jsonStats.assetsByChunkName[e][0]),
      //     size: sizeMap[e]
      //   };
      // });
      // result.toString = function () {
      //   let fromMaxLen = 0;
      //   let toMaxLen = 0;
      //   for (let i = 0; i < this.length; i++) {
      //     const entry = this[i];
      //     fromMaxLen = entry.from.length > fromMaxLen ? entry.from.length : fromMaxLen;
      //     toMaxLen = entry.to.length > toMaxLen ? entry.to.length : toMaxLen;
      //   }
      //   return this.map((e, i) => '[' + i + ']' + e.from + _blank.substr(0, fromMaxLen - e.from.length) + '   --> ' + _blank.substr(0, fromMaxLen / 4) + e.to + ' - ' + util.resolveSizeUnit(e.size)).join('\n');
      // };
      // callback && callback(errorString, result, jsonStats);
    });
  }

};
