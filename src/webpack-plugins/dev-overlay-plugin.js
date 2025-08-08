// webpack-dev-overlay-plugin.js
class DevOverlayPlugin {
  apply(compiler) {
    if (compiler.options.mode !== 'development') return;
    console.log('DevOverlayPlugin 已加载');

    // 使用 Webpack 的 emit 钩子（所有资产生成后触发）
    compiler.hooks.emit.tap('DevOverlayPlugin', (compilation) => {
      console.log('正在处理资产...');
      
      // 查找 HTML 资产（可能是 index.html 或其他名称）
      const htmlAssets = Object.keys(compilation.assets).filter(
        (assetName) => assetName.endsWith('.html')
      );
      
      console.log('找到 HTML 资产:', htmlAssets);
      
      htmlAssets.forEach((assetName) => {
        // 获取原始 HTML 内容
        const originalHtml = compilation.assets[assetName].source();
        
        // 注入调试按钮和脚本
        const modifiedHtml = originalHtml
          .replace('</body>', `
            <div id="__dev_overlay_panel" style="position:fixed; bottom:20px; right:20px; z-index:9999;">
              <button id="__toggle_overlay">开启代码定位功能</button>
            </div>
            </body>
          `)
          .replace('</body>', `
            <script>
              window.__DEV_OVERLAY_ACTIVE = false;
              document.getElementById('__toggle_overlay').addEventListener('click', () => {
                window.__DEV_OVERLAY_ACTIVE = !window.__DEV_OVERLAY_ACTIVE;
                window.dispatchEvent(new Event('dev-overlay-active-change'));
                document.getElementById('__toggle_overlay').textContent = 
                  window.__DEV_OVERLAY_ACTIVE ? '关闭代码定位功能' : '开启代码定位功能';
              });
            </script>
            </body>
          `);
        
        // 更新资产内容
        compilation.assets[assetName] = {
          source: () => modifiedHtml,
          size: () => modifiedHtml.length
        };
        
        console.log(`已修改 ${assetName}`);
      });
    });
  }
}

module.exports = DevOverlayPlugin;