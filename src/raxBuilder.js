/**
 * Created by exolution on 17/1/6.
 */
const WebpackBuilder = require('./webpackBuilder');
const webpack = require('webpack');
const defaultExt = ['jsx', 'js'];
const path = require('path');
const utils = require('./utils');
const RaxPlugin = require('rax-webpack-plugin');
const getLoaders = require('./getRaxLoaders')

class WeexBuilder extends WebpackBuilder {
    constructor(source, dest, options = {}) {
        if (!(options.ext && typeof options.ext === 'string')) {
            options.ext = defaultExt.join('|');
        }

        super(source, dest, options);
    }

    initConfig() {
        const destExt = path.extname(this.dest);
        const sourceExt = path.extname(this.sourceDef);
        let dir;
        let filename;

        const plugins = [
            new RaxPlugin({
                // Target format: `bundle`, `cmd`, `umd` or `factory`(build for builtin module format), default is umd
                target: 'bundle',
                // Only for `bundle` target, default is '// {"framework" : "Rax"}'
                frameworkComment: '// {"framework" : "Rax"}',
                // component mode build config
                moduleName: 'rax',
                globalName: 'Rax',
                // Enable external builtin modules, default is false
                externalBuiltinModules: true,
                // Config which builtin modules should external, default config is define in `RaxPlugin.BuiltinModules`
                builtinModules: RaxPlugin.BuiltinModules,
                // Enable include polyfill files
                includePolyfills: false,
                // Config which polyfill should include, defaut is empty
                polyfillModules: [],
                // Check duplicate dependencies, default is ['rax']
                duplicateCheck: ['rax']
            })
        ];
        if (this.options.filename) {
            filename = this.options.filename;
        }
        else {
            filename = '[name].js';
        }
        // Call like: ./bin/weex-builder.js test/index.vue dest/test.js
        // Need to rename the filename of
        if (destExt && this.dest[this.dest.length - 1] !== '/' && sourceExt) {
            dir = path.dirname(this.dest);
            filename = path.basename(this.dest);
        }
        else {
            dir = this.dest;
        }

        if (this.options.onProgress) {
            plugins.push(new webpack.ProgressPlugin(this.options.onProgress));
        }
        if (this.options.min) {
            /*
                  * Plugin: UglifyJsPlugin
                  * Description: Minimize all JavaScript output of chunks.
                  * Loaders are switched into minimizing mode.
                  *
                  * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
                  */
            plugins.unshift(new webpack.optimize.UglifyJsPlugin({
                minimize: true,
                sourceMap: !!this.options.devtool
            }));
        }
        const webpackConfig = () => {
            const entrys = {};
            this.source.forEach(s => {
                let file = path.relative(path.resolve(this.base), s);
                file = file.replace(/\.\w+$/, '');
                if (!this.options.web) {
                    s += '?entry=true';
                }
                entrys[file] = s;
            });
            const configs = {
                entry: entrys,
                output: {
                    path: dir,
                    filename: filename
                },
                watch: this.options.watch || false,
                devtool: this.options.devtool || false
            }
            configs.module = {};
            configs.module.loaders = getLoaders();
            configs.resolveLoader = {
                modules: [
                    path.join(__dirname, '../node_modules'),
                    path.resolve('node_modules')
                ]
            };
            configs.resolve = {
                modules: [path.join(__dirname, '../node_modules'), path.resolve('node_modules'), this.options.resolve],
                mainFields: ['loader', 'main'],
                moduleExtensions: ['-loader'],
                extensions: [".js", ".jsx"]
            };
            configs.plugins = plugins

            let resultConfig = [];

            resultConfig = RaxPlugin.MultiplePlatform(configs, {
                platforms: ['web', 'weex'],
                name: ['universal-env', '@ali/universal-env'],
                exclude: /(bower_components)/
            });

            let config = resultConfig[this.options.web ? 1 : 2];
            if (config.module.preLoaders) {
                config.module.loaders = config.module.preLoaders.concat(config.module.loaders)
                delete config.module.preLoaders
            }
            return config
        };
        this.config = webpackConfig();
    }
}

module.exports = WeexBuilder;
