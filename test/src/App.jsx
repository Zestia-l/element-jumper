import React from 'react';
import ReactDOM from 'react-dom';
import '../../src/component/overlay-element.mjs';
// 测试组件1
const Header = () => {
  return <h1>测试页面标题</h1>;
};

// 测试组件2
const Content = () => {
  return (
    <div className="content">
      <p>这是一段测试文本</p>
      <button>点击按钮</button>
    </div>
  );
};

// 根组件
const App = () => {
  return (
    <div>
      <Header />
      <Content />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));