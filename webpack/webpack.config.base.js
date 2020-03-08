const path = require('path');

const ASSET_PATH = '/';

module.exports = {
  output: {
    publicPath: ASSET_PATH,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '~': path.resolve(__dirname, '../src/app'),
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'eslint-loader' }],
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve('src'),
          // These dependencies have es6 syntax which ie11 doesn't like.
          path.resolve('node_modules/contensis-delivery-api'),
          path.resolve('node_modules/zengenti-isomorphic-base'),
        ],
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
