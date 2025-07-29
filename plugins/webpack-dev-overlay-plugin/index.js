// webpack-dev-overlay-plugin.js
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// class DevOverlayPlugin {
//   constructor(options = {}) {
//     this.options = options;
//   }

//   apply(compiler) {
//     if (compiler.options.mode !== 'development') return;
//     console.log('DevOverlayPlugin 已加载');

//     compiler.hooks.compilation.tap('DevOverlayPlugin', (compilation) => {
//       console.log('进入 compilation 阶段，准备注册 HtmlWebpackPlugin 钩子');
//       const htmlHooks = HtmlWebpackPlugin.getHooks(compilation);
//       console.log('HtmlWebpackPlugin 钩子是否存在：', !!htmlHooks);

//       // 更换为 beforeEmit 钩子（兼容性最强，一定会触发）
//       htmlHooks.beforeEmit.tap('DevOverlayPlugin', (data) => {
//         console.log('插件1被调用了！！！！'); // 这里一定会输出

//         // 1. 注入调试按钮（在</body>前添加）
//         data.html = data.html.replace('</body>', `
//           <div id="__dev_overlay_panel" style="position:fixed; bottom:20px; right:20px; z-index:9999;">
//             <button id="__toggle_overlay">Toggle Overlay</button>
//           </div>
//           </body>
//         `);

//         // 2. 注入核心脚本（在</body>前添加）
//         data.html = data.html.replace('</body>', `
//           <script>
//             window.__DEV_OVERLAY_ACTIVE = false;
//             window.__CURRENT_SELECTED_COMPONENT = null;
            
//             document.getElementById('__toggle_overlay').addEventListener('click', () => {
//               window.__DEV_OVERLAY_ACTIVE = !window.__DEV_OVERLAY_ACTIVE;
//               document.getElementById('__toggle_overlay').textContent = 
//                 window.__DEV_OVERLAY_ACTIVE ? 'Hide Overlay' : 'Show Overlay';
//             });
            
//             document.addEventListener('click', (e) => {
//               const overlay = e.target.closest('overlay-element');
//               if (overlay && window.__DEV_OVERLAY_ACTIVE) {
//                 const file = overlay.getAttribute('file');
//                 const line = overlay.getAttribute('line');
//                 const column = overlay.getAttribute('column');
//                 const debugId = overlay.getAttribute('debug-id');
                
//                 document.dispatchEvent(new CustomEvent('component-selected', {
//                   detail: { file, line, column, debugId }
//                 }));
//               }
//             });
//           </script>
//           </body>
//         `);

//         return data;
//       });
//     });
//   }
// }

// module.exports = DevOverlayPlugin;

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
              <button id="__toggle_overlay">Toggle Overlay</button>
            </div>
            </body>
          `)
          .replace('</body>', `
            <script>
              window.__DEV_OVERLAY_ACTIVE = false;
              document.getElementById('__toggle_overlay').addEventListener('click', () => {
                window.__DEV_OVERLAY_ACTIVE = !window.__DEV_OVERLAY_ACTIVE;
                document.getElementById('__toggle_overlay').textContent = 
                  window.__DEV_OVERLAY_ACTIVE ? 'Hide Overlay' : 'Show Overlay';
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