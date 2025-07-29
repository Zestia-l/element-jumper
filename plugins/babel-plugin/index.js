module.exports = function({ types: t }) {
  return {
    visitor: {
      JSXElement(path, state) {
        if (process.env.NODE_ENV !== 'development') return;
        
        // 跟踪嵌套层级，只处理第一层子组件
        state.currentDepth = (state.currentDepth || 1);
        if (state.currentDepth > 1) return;
        
        const tagName = path.node.openingElement.name.name;
        // 跳过非自定义组件和特殊组件
        if (tagName[0] !== tagName[0].toUpperCase() || tagName === 'overlay-element') return;
        
        const filename = this.file.opts.filename;
        if (filename && filename.endsWith('devOverlay.jsx')) return;
        
        const loc = path.node.openingElement.loc;
        if (!loc || !loc.start) return;
        
        // 跳过根组件（被render直接调用的组件）
        if (isRootComponent(path, t)) return;
        
        const { line, column } = loc.start;
        const debugId = `cmp-${line}-${column}`;
        const program = path.findParent(p => p.isProgram());
        if (!program) return;
        
        // 导入withDevOverlay
        let hasImport = false;
        program.node.body.forEach(node => {
          if (t.isImportDeclaration(node) && node.source.value === './devOverlay') {
            hasImport = true;
          }
        });
        if (!hasImport) {
          program.node.body.unshift(
            t.importDeclaration(
              [t.importSpecifier(t.identifier('withDevOverlay'), t.identifier('withDevOverlay'))],
              t.stringLiteral('./devOverlay')
            )
          );
        }
        
        const overlayVarName = `OverlayWrapper_${line}_${column}`;
        const wrapperCall = t.callExpression(
          t.identifier('withDevOverlay'),
          [
            t.identifier(tagName),
            t.objectExpression([
              t.objectProperty(t.identifier('debugId'), t.stringLiteral(debugId)),
              t.objectProperty(t.identifier('file'), t.stringLiteral(filename)),
              t.objectProperty(t.identifier('line'), t.numericLiteral(line)),
              t.objectProperty(t.identifier('column'), t.numericLiteral(column)),
            ])
          ]
        );
        
        // 替换JSX元素为包装组件
        path.replaceWith(
          t.jsxElement(
            t.jsxOpeningElement(t.jsxIdentifier(overlayVarName), path.node.openingElement.attributes),
            t.jsxClosingElement(t.jsxIdentifier(overlayVarName)),
            path.node.children,
            path.node.selfClosing
          )
        );
        
        // 创建包装器变量声明
        const overlayVar = t.variableDeclaration('const', [
          t.variableDeclarator(t.identifier(overlayVarName), wrapperCall)
        ]);
        
        // 核心修改：确保OverlayWrapper在App组件之前声明
        const appComponentIndex = findAppComponentIndex(program.node.body, t);
        
        // 如果找到App组件，在其之前插入；否则在文件末尾插入
        const insertIndex = appComponentIndex !== -1 ? appComponentIndex : program.node.body.length;
        
        // 避免重复插入
        const hasDuplicate = program.node.body.some(node => 
          t.isVariableDeclaration(node) && 
          node.declarations.some(decl => decl.id.name === overlayVarName)
        );
        
        if (!hasDuplicate && insertIndex !== undefined && insertIndex >= 0) {
          program.node.body.splice(insertIndex, 0, overlayVar);
        }
        
        // 跳过子节点处理
        state.currentDepth++;
        path.traverse({ JSXElement(childPath) { childPath.skip(); } });
        state.currentDepth--;
      }
    }
  };
};

// 查找App组件的位置
function findAppComponentIndex(bodyNodes, t) {
  for (let i = 0; i < bodyNodes.length; i++) {
    const node = bodyNodes[i];
    
    // 查找变量声明形式的App组件 (var App = ...)
    if (t.isVariableDeclaration(node)) {
      const hasAppDeclaration = node.declarations.some(decl => 
        decl.id.name === 'App' && 
        (t.isFunctionExpression(decl.init) || t.isArrowFunctionExpression(decl.init))
      );
      if (hasAppDeclaration) return i;
    }
    
    // 查找函数声明形式的App组件 (function App() { ... })
    if (t.isFunctionDeclaration(node) && node.id.name === 'App') {
      return i;
    }
  }
  
  return -1; // 未找到App组件
}

// 判断是否是根组件（被render直接调用的组件）
function isRootComponent(path, t) {
  const parent = path.parentPath;
  if (parent.isCallExpression()) {
    const callee = parent.node.callee;
    if (t.isMemberExpression(callee) && callee.property.name === 'render') {
      return true;
    }
  }
  return false;
}