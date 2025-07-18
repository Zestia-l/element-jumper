// webpack-dev-overlay-plugin.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

class DevOverlayPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    if (compiler.options.mode !== 'development') return;
    
    compiler.hooks.compilation.tap('DevOverlayPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tap(
        'DevOverlayPlugin',
        (data) => {
          // 注入调试按钮
          data.html = data.html.replace('</body>', `
            <div id="__dev_overlay_panel" style="position:fixed; bottom:20px; right:20px; z-index:9999;">
              <button id="__toggle_overlay">Toggle Overlay</button>
            </div>
            ${data.html}
          `);
          
          // 注入核心脚本（不包含VSCode跳转逻辑）
          data.html = data.html.replace('</body>', `
            <script>
              // 全局状态管理
              window.__DEV_OVERLAY_ACTIVE = false;
              window.__CURRENT_SELECTED_COMPONENT = null;
              
              // 切换overlay显示状态
              document.getElementById('__toggle_overlay').addEventListener('click', () => {
                window.__DEV_OVERLAY_ACTIVE = !window.__DEV_OVERLAY_ACTIVE;
                document.getElementById('__toggle_overlay').textContent = 
                  window.__DEV_OVERLAY_ACTIVE ? 'Hide Overlay' : 'Show Overlay';
              });
              
              // 组件点击事件（不包含跳转逻辑）
              document.addEventListener('click', (e) => {
                const overlay = e.target.closest('overlay-element');
                //获取相关信息
                if (overlay && window.__DEV_OVERLAY_ACTIVE) {
                  const file = overlay.getAttribute('file');
                  const line = overlay.getAttribute('line');
                  const column = overlay.getAttribute('column');
                  const debugId = overlay.getAttribute('debug-id');
                  
                  // 触发自定义事件，由VSCode插件监听
                  document.dispatchEvent(new CustomEvent('component-selected', {
                    detail: { file, line, column, debugId }
                  }));
                }
              });
            </script>
            ${data.html}
          `);
          
          return data;
        }
      );
    });
  }
}

module.exports = DevOverlayPlugin;