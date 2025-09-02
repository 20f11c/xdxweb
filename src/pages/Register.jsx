import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button } from 'antd-mobile';
import { registerUser } from '../services/userApi';
import { Toast } from '../components/CustomToast';
import '../styles/Register.css';

/**
 * 注册页面组件
 * 提供用户注册功能，包含用户名、邮箱、密码输入和确认
 */
const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 表单数据状态
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  /**
   * 处理输入框变化
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
      throw new Error('请输入用户名');
    }
    if (formData.username.length < 3) {
      throw new Error('用户名至少需要3个字符');
    }
    if (!formData.email.trim()) {
      throw new Error('请输入邮箱地址');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      throw new Error('请输入有效的邮箱地址');
    }
    if (!formData.password) {
      throw new Error('请输入密码');
    }
    if (formData.password.length < 6) {
      throw new Error('密码至少需要6个字符');
    }
    if (formData.password !== formData.confirmPassword) {
      throw new Error('两次输入的密码不一致');
    }
  };

  /**
   * 处理注册表单提交
   * @param {Event} e - 表单提交事件
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
      // 调用API注册
      const response = await registerUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      if (response.success) {
        // 延迟跳转到登录页面，成功消息由withErrorHandler统一处理
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    } catch (error) {
      // API错误由withErrorHandler统一处理，这里不需要额外的Toast
      console.error('注册错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h1>创建账户</h1>
          <p>填写信息完成注册</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={(val) => handleInputChange('username', val)}
              placeholder="请输入用户名"
              disabled={isLoading}
              clearable
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">邮箱地址</label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(val) => handleInputChange('email', val)}
              placeholder="请输入邮箱地址"
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
              placeholder="请输入密码（至少6位）"
              disabled={isLoading}
              clearable
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(val) => handleInputChange('confirmPassword', val)}
              placeholder="请再次输入密码"
              disabled={isLoading}
              clearable
            />
          </div>

          <Button
            type="submit"
            color="primary"
            size="large"
            loading={isLoading}
            disabled={isLoading}
            block
            className="register-button"
          >
            {isLoading ? '注册中...' : '立即注册'}
          </Button>

          <div className="register-footer">
            <div className="footer-links">
              <Link to="/login">返回登录</Link>
              <Link to="/forgot-password">忘记密码？</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;