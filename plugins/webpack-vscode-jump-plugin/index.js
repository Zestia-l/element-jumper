// webpack-vscode-jump-plugin.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
class VscodeJumpPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    if (compiler.options.mode !== 'development') return;
    
    compiler.hooks.compilation.tap('VscodeJumpPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tap(
        'VscodeJumpPlugin',
        (data) => {
          console.log('插件2被调用了！！！！');
          // 注入VSCode跳转逻辑
          data.html = data.html.replace('</body>', `
            <script>
              // 监听组件选择事件
              document.addEventListener('component-selected', (e) => {
                const { file, line, column, debugId } = e.detail;
                
                // 更新信息面板
                const panel = document.getElementById('__dev_overlay_panel');
                if (panel) {
                  const infoDiv = panel.querySelector('#__overlay_info') || document.createElement('div');
                  infoDiv.id = '__overlay_info';
                  infoDiv.style = 'margin-top:10px; font-size:12px;';
                  infoDiv.textContent = \`File: \${file.split('/').pop()} Line:\${line} Column:\${column}\`;
                  panel.appendChild(infoDiv);
                }
                
                // 保存当前选中的组件
                window.__CURRENT_SELECTED_COMPONENT = debugId;
                
                // 发送消息到VSCode
                if (window.__VSCODE_JUMP_ENABLED) {
                  sendMessageToVSCode({ file, line, column });
                }
              });
              
              // 与VSCode通信的函数
              function sendMessageToVSCode(message) {
                try {
                  // 通过自定义协议发送消息
                  window.open(\`vscode://file/\${message.file}:\${message.line}:\${message.column}\`, '_blank');
                } catch (e) {
                  console.error('无法连接到VSCode:', e);
                }
              }
            </script>
            ${data.html}
          `);
          
          return data;
        }
      );
    });
  }
}

module.exports = VscodeJumpPlugin;