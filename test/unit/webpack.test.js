const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'inline-source-map',
  performance: {
    hints: false
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './test/unit/tsconfig.json'
      })
    ],
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }, {
        loader: 'string-replace-loader',
          query: {
            search: 'moduleId: module.id,',
            replace: '',
            flags: 'g'
          }
        },
      {
        enforce: 'post',
        test: /\.(js|ts)$/, loader: 'sourcemap-istanbul-instrumenter-loader?force-sourcemap=true',
        include: path.resolve('src/lib/')
      }
    ]
  }
};