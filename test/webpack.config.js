const path = require('path');

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
            ].filter(Boolean)
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
    hot: true
  },
  plugins: [
    new (require('webpack').DefinePlugin)({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
};