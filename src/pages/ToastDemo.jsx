import React from 'react';
import { Button, Space } from 'antd-mobile';
import { Toast } from '../components/CustomToast';
import '../styles/ToastDemo.css';

/**
 * Toast演示页面
 */
const ToastDemo = () => {
  /**
   * 显示成功Toast
   */
  const showSuccessToast = () => {
    Toast.success('操作成功！这是一个成功提示消息。');
  };

  /**
   * 显示错误Toast
   */
  const showErrorToast = () => {
    Toast.error('操作失败！这是一个错误提示消息。');
  };

  /**
   * 显示长文本Toast
   */
  const showLongTextToast = () => {
    Toast.success('这是一个比较长的成功提示消息，用来测试Toast组件在显示长文本时的表现效果。');
  };

  /**
   * 显示短时间Toast
   */
  const showShortToast = () => {
    Toast.error('短时间提示', 1500);
  };

  /**
   * 显示长时间Toast
   */
  const showLongToast = () => {
    Toast.success('长时间提示，5秒后消失', 5000);
  };

  return (
    <div className="toast-demo-container">
      <div className="toast-demo-content">
        <h1>自定义Toast演示</h1>
        <p>点击下面的按钮测试不同类型的Toast效果</p>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            color="primary"
            size="large"
            block
            onClick={showSuccessToast}
          >
            显示成功Toast
          </Button>

          <Button
            color="danger"
            size="large"
            block
            onClick={showErrorToast}
          >
            显示错误Toast
          </Button>

          <Button
            color="primary"
            fill="outline"
            size="large"
            block
            onClick={showLongTextToast}
          >
            显示长文本Toast
          </Button>

          <Button
            color="warning"
            size="large"
            block
            onClick={showShortToast}
          >
            显示短时间Toast (1.5秒)
          </Button>

          <Button
            color="success"
            size="large"
            block
            onClick={showLongToast}
          >
            显示长时间Toast (5秒)
          </Button>
        </Space>

        <div className="demo-info">
          <h3>Toast特性</h3>
          <ul>
            <li>✅ 成功提示使用绿色图标</li>
            <li>❌ 错误提示使用红色图标</li>
            <li>📱 响应式设计，适配移动端</li>
            <li>🎭 页面居中显示，向上消失动画</li>
            <li>⏱️ 可自定义显示时长</li>
            <li>🎨 支持深色模式和高对比度模式</li>
            <li>♿ 支持减少动画模式</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ToastDemo;