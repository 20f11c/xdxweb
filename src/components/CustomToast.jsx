import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircleOutline, CloseCircleOutline } from 'antd-mobile-icons';
import '../styles/CustomToast.css';

/**
 * 自定义Toast组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.visible - 是否显示
 * @param {string} props.type - 类型：'success' | 'error'
 * @param {string} props.message - 显示消息
 * @param {number} props.duration - 显示时长（毫秒），默认3000
 * @param {Function} props.onClose - 关闭回调
 */
const CustomToast = ({ visible, type, message, duration = 3000, onClose }) => {
  const [show, setShow] = useState(false);
  const [animating, setAnimating] = useState(false);

  /**
   * 处理关闭动画
   */
  const handleClose = useCallback(() => {
    setAnimating(false);
    // 等待动画完成后隐藏组件
    setTimeout(() => {
      setShow(false);
      onClose && onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      setShow(true);
      setAnimating(true);

      // 设置自动关闭定时器
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, handleClose]);

  /**
   * 获取图标组件
   */
  const getIcon = () => {
    if (type === 'success') {
      return <CheckCircleOutline className="toast-icon success" />;
    } else if (type === 'error') {
      return <CloseCircleOutline className="toast-icon error" />;
    }
    return null;
  };

  if (!show) return null;

  return (
    <div className={`custom-toast-overlay ${animating ? 'show' : 'hide'}`}>
      <div className={`custom-toast ${type} ${animating ? 'slide-in' : 'slide-out'}`}>
        {getIcon()}
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
};

/**
 * Toast工具类
 */
class ToastManager {
  constructor() {
    this.toastContainer = null;
    this.currentToast = null;
  }

  /**
   * 确保Toast容器存在
   */
  ensureContainer() {
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.id = 'custom-toast-container';
      document.body.appendChild(this.toastContainer);
    }
  }

  /**
   * 显示Toast
   * @param {string} type - 类型：'success' | 'error'
   * @param {string} message - 消息内容
   * @param {number} duration - 显示时长
   */
  show(type, message, duration = 3000) {
    this.ensureContainer();

    // 如果有正在显示的Toast，先清除
    if (this.currentToast) {
      this.hide();
    }

    // 创建新的Toast
    const toastElement = document.createElement('div');
    this.toastContainer.appendChild(toastElement);

    const handleClose = () => {
      if (toastElement && this.toastContainer.contains(toastElement)) {
        this.toastContainer.removeChild(toastElement);
      }
      this.currentToast = null;
    };

    // 使用React渲染Toast
    import('react-dom/client').then(({ createRoot }) => {
      const root = createRoot(toastElement);
      root.render(
        <CustomToast
          visible={true}
          type={type}
          message={message}
          duration={duration}
          onClose={handleClose}
        />
      );
      this.currentToast = { element: toastElement, root };
    });
  }

  /**
   * 显示成功Toast
   * @param {string} message - 消息内容
   * @param {number} duration - 显示时长
   */
  success(message, duration) {
    this.show('success', message, duration);
  }

  /**
   * 显示错误Toast
   * @param {string} message - 消息内容
   * @param {number} duration - 显示时长
   */
  error(message, duration) {
    this.show('error', message, duration);
  }

  /**
   * 隐藏当前Toast
   */
  hide() {
    if (this.currentToast) {
      const { element, root } = this.currentToast;
      if (element && this.toastContainer.contains(element)) {
        root.unmount();
        this.toastContainer.removeChild(element);
      }
      this.currentToast = null;
    }
  }
}

// 创建全局Toast实例
const Toast = new ToastManager();

export default CustomToast;
export { Toast };