const _sizeUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

exports.resolveSizeUnit = function resolveSizeUnit (size, i = 0) {
  if (isNaN(size)) {
    return '';
  }
  if (size < 1000) {
    return size.toFixed(2).replace(/\.?0+$/, '') + _sizeUnits[i];
  }
  else {
    return resolveSizeUnit(size / 1024, i + 1);
  }
};

exports.cssLoaders = function (options) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  // generate loader string to be used with extract text plugin
  const generateLoaders = (loader, loaderOptions) => {
    const loaders = options.useVue ? [cssLoader] : [];
    if (options.usePostCSS) {
      loaders.push(postcssLoader);
    }
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }
    if (options.useVue) {
      return ['vue-style-loader'].concat(loaders);
    }
    else {
      return loaders;
    }
  };

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  };
};
