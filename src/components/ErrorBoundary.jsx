import React from 'react';
import { Button, Card } from 'antd-mobile';
import { handleComponentError } from '../utils/errorHandler';
import '../styles/ErrorBoundary.css';

/**
 * 错误边界组件
 * 捕获子组件中的JavaScript错误，显示友好的错误界面
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * 捕获错误时调用
   * @param {Error} error - 错误对象
   * @returns {Object} 新的state
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  /**
   * 错误被捕获后调用
   * @param {Error} error - 错误对象
   * @param {Object} errorInfo - 错误信息
   */
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // 调用全局错误处理
    handleComponentError(error, errorInfo);
  }

  /**
   * 重置错误状态
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  /**
   * 刷新页面
   */
  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;

      // 如果提供了自定义的fallback组件，使用它
      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onReset={this.handleReset}
            onRefresh={this.handleRefresh}
          />
        );
      }

      // 默认的错误界面
      return (
        <div className="error-boundary-container">
          <Card className="error-boundary-card">
            <div className="error-boundary-content">
              <div className="error-icon">⚠️</div>
              <h2 className="error-title">页面出现错误</h2>
              <p className="error-message">
                抱歉，页面遇到了一些问题。请尝试刷新页面或联系技术支持。
              </p>

              {/* 开发环境下显示详细错误信息 */}
              {import.meta.env.DEV && this.state.error && (
                <details className="error-details">
                  <summary>错误详情（开发模式）</summary>
                  <pre className="error-stack">
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="error-actions">
                <Button
                  color="primary"
                  size="large"
                  onClick={this.handleRefresh}
                  className="error-button"
                >
                  刷新页面
                </Button>
                <Button
                  fill="outline"
                  size="large"
                  onClick={this.handleReset}
                  className="error-button"
                >
                  重试
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    // 没有错误时正常渲染子组件
    return this.props.children;
  }
}

export default ErrorBoundary;