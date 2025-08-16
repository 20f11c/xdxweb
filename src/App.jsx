import React from 'react';
import { ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';

// 页面组件
import Home from './pages/Home';

// 样式
import './App.css';

/**
 * 主应用组件
 * 只包含Home页面
 */
function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="app">
        <Home />
      </div>
    </ConfigProvider>
  );
}

export default App;
