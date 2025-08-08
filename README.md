# element - jumper - 浏览器组件到 VSCode 源码调试跳转工具

## 一、简介
element - jumper 是一款为前端开发者打造的实用工具，通过 Babel 插件、Webpack 插件和组件的协同工作，实现浏览器中 DOM 元素到 VSCode 对应源码位置（精确到行列）的快速跳转，同时搭配遮罩组件辅助开发调试，优化前端调试工作流。

## 二、功能特性


源码精准跳转：借助 Babel 插件注入调试标识、Webpack 插件注入跳转逻辑，点击浏览器中特定组件 DOM 元素，可直接打开 VSCode 并定位到对应源码行列。


开发环境遮罩辅助：提供 OverlayElement 组件，hover 时组件样式会变深，方便开发者快速识别和调试目标组件。


低使用成本：通过合理的包配置，用户只需简单几步配置，即可集成 Babel 插件、Webpack 插件和调试组件功能。
## 三、安装
使用 npm 进行安装：

```bash
npm install element - jumper --save - dev
```
## 四、使用说明

### 1. Babel 插件配置
在项目的 Babel 配置文件（如 .babelrc 或 babel.config.js）中添加插件引用：
```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": [
    "element-jumper/babel-plugin"
  ]
}
```
该 Babel 插件会在开发环境为组件注入调试标识，用于后续跳转逻辑识别。
### 2. Webpack 插件配置
在 webpack.config.js 中引入并配置 Webpack 插件：
```js
const ElementJumperWebpackPlugin = require('element - jumper/webpack - plugin');

module.exports = {
  plugins: [
    new ElementJumperWebpackPlugin()
  ]
};
```

此 Webpack 插件会注入全局变量和 VSCode 跳转脚本，为组件调试跳转提供基础环境。
### 3. 使用调试组件
在和app组件同级目录中引入并使用 OverlayElement 组件包裹目标内容，示例如下：
```jsx
import React from 'react';
import '../../src/component/overlay-element.mjs';
export function withDevOverlay(Component, options) {
  if (!Component) {
    console.error('withDevOverlay 接收的 Component 为 undefined');
    return () => <div>Component missing</div>;
  }
  if (process.env.NODE_ENV !== 'development') {
    return Component;
  }

  const OverlayWrapper = (props) => (
    <overlay-element
      debug-id={options.debugId}
      file={options.file}
      line={options.line}
      column={options.column}
    >
      <Component {...props} />
    </overlay-element>
  );

  OverlayWrapper.displayName = `Overlay(${Component?.displayName || Component?.name})`;
  return OverlayWrapper;
}
```

OverlayElement 组件在 hover 时会改变样式（默认变深），方便开发者识别，点击可触发跳转到 VSCode 对应源码位置的操作。

## 五、原理说明
1. Babel 插件：在编译过程中，为符合条件的组件注入调试标识（如组件所在文件路径、行列信息等），这些标识会嵌入到生成的代码中，用于后续识别和跳转。
2. Webpack 插件：一方面注入全局变量标识开发环境，另一方面注入 VSCode 跳转逻辑脚本，监听浏览器点击事件，解析调试标识并构建 vscode:// 协议链接，实现跳转。
3. OverlayElement 组件：通过监听 hover 和点击事件，配合上述插件注入的逻辑，实现可视化的调试辅助和跳转触发。
## 六、注意事项
1. 环境限制：功能主要针对开发环境，生产环境需做好配置区分，避免不必要的性能损耗和逻辑执行。
2. 路径与兼容性：确保项目路径解析、vscode:// 协议在你的开发环境中能正常工作，不同操作系统（如 Windows、MacOS）对路径和协议的支持可能存在差异，需做好测试。
3. 依赖版本：项目中依赖的相关包（如 @babel/core、webpack 等）版本可能会影响工具功能，若出现问题，可尝试调整依赖版本或提交 issue 反馈。


通过以上步骤，你就可以在自己的前端项目中集成 element - jumper 工具，享受更便捷的组件调试和源码跳转体验啦！
