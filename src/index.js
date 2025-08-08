import OverlayElement from './components/overlay-element.mjs';

module.exports = {
  // Babel 预设（用户配置到 .babelrc）
  babelPreset: require('./babel-preset'),
  
  // Webpack 插件（用户配置到 webpack.config.js）
  webpackPlugin: require('./webpack-plugins'),

  //遮罩组件
  OverlayElement,
};