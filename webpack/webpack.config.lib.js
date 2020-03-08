const merge = require('webpack-merge');
const path = require('path');
const Visualizer = require('webpack-visualizer-plugin');

const packagejson = require('../package.json');
const BASE_CONFIG = require('./webpack.config.base');

const LIB_CONFIG = {
  mode: 'production',
  devtool: 'source-map',
  target: 'node',
  entry: {
    'jsonpath-mapper': './src/entrypoint.js',
  },
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    libraryTarget: 'umd',
  },
  externals: [...Object.keys(packagejson.dependencies), /^@babel*/],
  optimization: {
    minimize: false,
  },
  plugins: [
    new Visualizer({
      filename: `./client-stats.html`,
    }),
  ],
};
module.exports = merge({ ...BASE_CONFIG, plugins: null }, LIB_CONFIG);
