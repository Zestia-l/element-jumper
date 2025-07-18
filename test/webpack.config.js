const path = require('path');
const DevOverlayPlugin = require('../plugins/webpack-dev-overlay-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VscodeJumpPlugin = require('../plugins/webpack-vscode-jump-plugin');


module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/App.js', // 入口文件路径
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
                '@babel/preset-react',
                '@babel/preset-env'
              ],
            plugins: [
            process.env.NODE_ENV === 'development' && require('../plugins/babel-plugin/index'), 
            ].filter(Boolean),
            overrides: [
              {
                plugins: [
                  ["@babel/plugin-transform-unicode-escapes", false] // 强制禁用
                ]
              }
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true
  },
  plugins: [
    new (require('webpack').DefinePlugin)({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    process.env.NODE_ENV === 'development' && new DevOverlayPlugin(),
    process.env.NODE_ENV === 'development' && new VscodeJumpPlugin(),
  ].filter(Boolean)
};