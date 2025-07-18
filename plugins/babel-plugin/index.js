// babel-plugin.js
//导出babel插件函数，接收 Babel API 对象，解构出类型工具集
module.exports = function({ types: t }) {
    return {
      //定义visitor对象，包含对各种节点类型的处理函数
      visitor: {
        //当访问到 JSXElement 节点时执行此函数
        JSXElement(path) {
          if (process.env.NODE_ENV !== 'development') return;
          
          //文件名
          const filename = this.file.opts.filename;
          //行列信息
          const { line, column } = path.node.openingElement.loc.start;
          //调试id
          const debugId = `cmp-${line}-${column}-${Date.now()}`;
          //新的jsx元素用于替换
          const overlayElement = t.jsxElement(
            //开始标签
            t.jsxOpeningElement(
              //标签名
              t.jsxIdentifier('overlay-element'),
              [
                //标签属性
                t.jsxAttribute(t.jsxIdentifier('debug-id'), t.stringLiteral(debugId)),
                t.jsxAttribute(t.jsxIdentifier('file'), t.stringLiteral(filename)),
                t.jsxAttribute(t.jsxIdentifier('line'), t.stringLiteral(line.toString())),
                t.jsxAttribute(t.jsxIdentifier('column'), t.stringLiteral(column.toString())),
                t.jsxAttribute(
                  t.jsxIdentifier('active'),
                  t.jsxExpressionContainer(
                    t.memberExpression(
                      t.identifier('window'),
                      t.identifier('__DEV_OVERLAY_ACTIVE')
                    )
                  )
                )
              ]
            ),
            //结束标签
            t.jsxClosingElement(t.jsxIdentifier('overlay-element')),
            //原始的jsx元素作为子元素
            [path.node]
          );
          //替换
          path.replaceWith(overlayElement);
        }
      }
    };
  };