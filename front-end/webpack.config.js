const webpack = require('webpack');  // eslint-disable-line
const path = require('path');
const loaders = require('./webpack.loaders');
const CopyWebpackPlugin = require('copy-webpack-plugin');  // eslint-disable-line

module.exports = {
  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://0.0.0.0:5001', // WebpackDevServer host and port
    'webpack/hot/only-dev-server',
    './src/index.jsx' // Your appʼs entry point
  ],
  devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
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
  devServer: {
    contentBase: './public',
    noInfo: true, //  --no-info option
    hot: true,
    inline: true,
    historyApiFallback: {
      index: '/index.html'
    },
    stats: 'errors-only'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.NoErrorsPlugin(),
    new CopyWebpackPlugin([
      { from: './index.html' }
    ]),
  ]
};
