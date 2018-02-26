const configs = {
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
        }
      }]
    }]
  }
}

module.exports = configs;