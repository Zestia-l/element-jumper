class VscodeJumpPlugin {
  constructor(options = {}) {
    this.options = options;
    // 配置元素上的属性名（根据你的实际属性名调整）
    this.attrs = {
      file: 'file',
      line: 'line',
      column: 'column'
    };
  }

  apply(compiler) {
    if (compiler.options.mode !== 'development') return;
    console.log('vscode跳转插件运行中...');

    // 使用Webpack的emit钩子（资产输出前触发）
    compiler.hooks.emit.tapAsync('VscodeJumpPlugin', (compilation, callback) => {
      try {
        console.log('插件2被调用了！！！！'); // 确认钩子触发

        // 找到所有HTML资产（通常是index.html）
        const htmlAssets = Object.keys(compilation.assets).filter(filename => 
          filename.endsWith('.html')
        );

        if (htmlAssets.length === 0) {
          console.warn('未找到HTML资产，无法注入脚本');
          callback();
          return;
        }

        // 处理每个HTML文件
        htmlAssets.forEach(filename => {
          // 获取原始HTML内容
          const originalHtml = compilation.assets[filename].source();

          // 注入点击监听脚本
          const injectScript = `
            <script>
              document.addEventListener('click', (e) => {
                // 查找带目标属性的元素
                const attrNames = ['${this.attrs.file}', '${this.attrs.line}', '${this.attrs.column}'];
                const targetEl = e.target.closest(
                  attrNames.map(attr => \`[\${attr}]\`).join('')
                );
                if (!targetEl) return;

                // 提取属性信息
                const file = targetEl.getAttribute('${this.attrs.file}');
                const line = targetEl.getAttribute('${this.attrs.line}');
                const column = targetEl.getAttribute('${this.attrs.column}');

                if (!file || !line || !column) return;

                // 处理Windows路径并跳转
                const normalizedFile = file.replace(/\\\\/g, '/');
                const encodedFile = encodeURIComponent(normalizedFile);
                const vscodeUrl = \`vscode://file/\${encodedFile}:\${line}:\${column}\`;
                window.open(vscodeUrl, '_blank');
              });
            </script>
          `;

          // 将脚本插入到</body>前
          const modifiedHtml = originalHtml.replace('</body>', `${injectScript}</body>`);

          // 更新资产内容
          compilation.assets[filename] = {
            source: () => modifiedHtml,
            size: () => modifiedHtml.length
          };
        });
      } catch (e) {
        console.error('插件处理失败:', e);
      }
      callback();
    });
  }
}

module.exports = VscodeJumpPlugin;