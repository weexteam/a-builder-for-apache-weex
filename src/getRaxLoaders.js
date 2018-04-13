'use strict';


function getLoaders() {
    let loaders = [];
    // css 、less 配置
    let _cssLoader = 'stylesheet-loader';

    let _lessLoader = 'stylesheet-loader?transformDescendantCombinator!less-loader';

    loaders.push({ test: /\.css$/,loader: _cssLoader });
    loaders.push({ test: /\.less$/, loader: _lessLoader});


        loaders.push({
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
            loader: 'file-loader?name=[name]-[hash].[ext]'
        });


    let jsLoaders = [];

    // babel-loader 配置
    let query = {};
    let presets = [require.resolve('babel-preset-es2015'), require.resolve('babel-preset-rax')];
    let raxPlugins = [];

    raxPlugins.push(require.resolve('babel-plugin-add-module-exports'));
    raxPlugins.push(require.resolve('babel-plugin-transform-decorators-legacy'));
    // raxPlugins.push(require.resolve('@ali/babel-plugin-page-mod-limit')); // 本地路径关闭检测
    // raxPlugins.push([ require.resolve('@ali/babel-plugin-page-tms-module-analyse'), {savePath: path.join(process.cwd(), '.pagedata.json')}])




    query = Object.assign(query, {
        presets: presets,
        plugins: raxPlugins,
        babelrc: false
        // ,cacheDirectory: true
    });

    let babelLoader = 'babel-loader' + '?' + JSON.stringify(query);

    jsLoaders.push(babelLoader);



    if (jsLoaders.length > 0) {
        loaders.push({
            test: /\.js$/,
            loader: jsLoaders.join('!')
        });
    }

    return loaders;
}

module.exports = getLoaders;