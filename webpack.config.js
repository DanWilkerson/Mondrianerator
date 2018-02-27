const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    Mondrianerator: path.resolve(__dirname, 'src', 'index.js'),
    "Mondrianerator.min": path.resolve(__dirname, 'src', 'index.js'),
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel-loader',
      test: /\.js$/,
    }]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  watchOptions: {
    ignored: 'node_modules'
  }
};
