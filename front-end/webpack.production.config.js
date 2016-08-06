const webpack = require('webpack');  // eslint-disable-line
const path = require('path');
const loaders = require('./webpack.loaders');
const CopyWebpackPlugin = require('copy-webpack-plugin');  // eslint-disable-line

module.exports = {
  entry: [
    'babel-polyfill',
    './src/index.jsx' // Your appʼs entry point
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './index.html' }
    ]),
  ]
};
