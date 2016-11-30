const pkg = require('./package.json');
var webpack = require('webpack');  
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var InlineChunkWebpackPlugin = require('html-webpack-inline-chunk-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var noop = function(){};
var isProd = (process.env.NODE_ENV === 'production');

console.log("Building in " + (isProd?"Production":"Developerment") + " mode");

module.exports = {  
  entry: {
    app:'./src/index.ts',
    vendor: Object.keys(pkg.dependencies)
  },
  output: {
    path: 'dist',
    filename: isProd ? '[name].[chunkhash].js' : '[name].js', //prod we will hash the file names
  },
  externals:{

  },
  // Turn on sourcemaps
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  // Add minification
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': process.env.NODE_ENV
      }
    }),
    isProd ? new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}) : noop, //uglify slows down dev builds
    new webpack.optimize.CommonsChunkPlugin({names: ["vendor","manifest"]}),
    new HtmlWebpackPlugin(),
    new CopyWebpackPlugin([{ from: 'src/assets', to:'assets' }]),
    new InlineChunkWebpackPlugin({
        inlineChunks: ['manifest']
    })
  ],
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}