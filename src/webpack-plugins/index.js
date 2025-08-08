const DevOverlayPlugin = require('./dev-overlay-plugin');
const VSCodeJumpPlugin = require('./vscode-jump-plugin');

class ReactDevOverlayWebpackPlugin {
  apply(compiler) {
    // 自动注入 2 个 Webpack 插件逻辑
    new DevOverlayPlugin().apply(compiler);
    new VSCodeJumpPlugin().apply(compiler);
  }
}

module.exports = ReactDevOverlayWebpackPlugin;