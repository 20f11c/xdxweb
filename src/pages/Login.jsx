import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Form } from 'antd-mobile';
import { useAuth } from '../contexts/auth';
import { loginUser } from '../services/userApi';
import { Toast } from '../components/CustomToast';
import '../styles/Login.css';

/**
 * 登录页面组件
 * 提供用户登录功能，包含用户名/邮箱和密码输入
 */
const Login = () => {
  // 表单状态管理
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * 处理输入框变化并清除错误信息
   * @param {string} field - 字段名
   * @param {string} value - 输入值
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // 清除错误信息已由全局错误处理器管理
  };

  /**
   * 表单验证
   * @throws {Error} 验证失败时抛出错误
   */
  const validateForm = () => {
    if (!formData.username.trim()) {
      throw new Error('请输入用户名或邮箱');
    }

    if (!formData.password) {
      throw new Error('请输入密码');
    }

    if (formData.password.length < 6) {
      throw new Error('密码至少需要6个字符');
    }
  };

  /**
   * 处理表单提交
   * @param {Event} e - 提交事件
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 先进行表单验证
    try {
      validateForm();
    } catch (validationError) {
      // 表单验证错误直接显示Toast
      Toast.error(validationError.message);
      return;
    }

    setIsLoading(true);

    try {
      // 调用API登录
      const response = await loginUser({
        username: formData.username.trim(),
        password: formData.password
      });

      if (response.success) {
        // 更新认证上下文
        login(response.data.user, response.data.token);

        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 1000);
      }
    } catch (error) {
      // API错误由withErrorHandler统一处理，这里不需要额外的Toast
      console.error('登录错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>用户登录</h1>
          <p>欢迎回来，请登录您的账户</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名/邮箱</label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={(val) => handleInputChange('username', val)}
              placeholder="请输入用户名或邮箱"
              disabled={isLoading}
              clearable
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(val) => handleInputChange('password', val)}
              placeholder="请输入密码"
              disabled={isLoading}
              clearable
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>记住我</span>
            </label>
          </div>

          <Button
            type="submit"
            color="primary"
            size="large"
            loading={isLoading}
            disabled={isLoading}
            block
            className="login-button"
          >
            {isLoading ? '登录中...' : '登录'}
          </Button>

          <div className="login-footer">
            <div className="footer-links">
              <Link to="/register">立即注册</Link>
              <Link to="/forgot-password" className="forgot-password">忘记密码？</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;