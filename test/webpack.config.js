const path = require('path');
const DevOverlayPlugin = require('../plugins/webpack-dev-overlay-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VscodeJumpPlugin = require('../plugins/webpack-vscode-jump-plugin');


module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/App.jsx', // 入口文件路径
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, 'src')
        ],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
                '@babel/preset-react',
                ['@babel/preset-env',{ modules: false }]
              ],
            plugins: [
            process.env.NODE_ENV === 'development' && require('../plugins/babel-plugin/index'), 
            ].filter(Boolean),
            sourceType: "module",
            overrides: [
              {
                // 精确匹配 overlay-element.js
                test: /overlay-element\.js$/,
                sourceType: "module", // 强制对该文件启用模块模式
                presets: [
                  '@babel/preset-react',
                  ['@babel/preset-env', { modules: false }] // 再次强调禁用转换
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
  mode: process.env.NODE_ENV || 'development',
  plugins: [
    new (require('webpack').DefinePlugin)({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html' 
    }),
    new DevOverlayPlugin(),
    new VscodeJumpPlugin(),
  ].filter(Boolean)
};