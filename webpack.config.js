const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: __dirname,
  entry: [
    path.resolve(__dirname, 'src', 'index.js')
  ],
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel-loader',
      test: /\.js$/,
    }]
  },
  output: {
    filename: 'Mondrianerator.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  watchOptions: {
    ignored: 'node_modules'
  }
};
