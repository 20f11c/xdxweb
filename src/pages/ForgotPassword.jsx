import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from 'antd-mobile';
import { resetPassword } from '../services/userApi';
import { Toast } from '../components/CustomToast';
import '../styles/ForgotPassword.css';

/**
 * 忘记密码页面组件
 * 提供密码重置功能，通过用户名和邮箱验证进行密码重置
 */
const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 表单数据状态
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    newPassword: '',
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
    if (!formData.email.trim()) {
      throw new Error('请输入邮箱地址');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      throw new Error('请输入有效的邮箱地址');
    }
    if (!formData.newPassword) {
      throw new Error('请输入新密码');
    }
    if (formData.newPassword.length < 6) {
      throw new Error('新密码至少需要6个字符');
    }
    if (formData.newPassword !== formData.confirmPassword) {
      throw new Error('两次输入的密码不一致');
    }
  };

  /**
   * 处理密码重置表单提交
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
      // 调用API重置密码
      const response = await resetPassword({
        username: formData.username.trim(),
        email: formData.email.trim(),
        newPassword: formData.newPassword
      });

      if (response.success) {
        setIsSubmitted(true);
      }
    } catch (error) {
      // API错误由withErrorHandler统一处理，这里不需要额外的Toast
      console.error('密码重置错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 重新重置密码
   */
  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      username: '',
      email: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <div className="forgot-password-header">
          <h1>重置密码</h1>
          <p>
            {isSubmitted
              ? '密码重置成功'
              : '请输入您的用户名、邮箱和新密码来重置密码'
            }
          </p>
        </div>

        {!isSubmitted ? (
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={(val) => handleInputChange('username', val)}
                placeholder="请输入您的用户名"
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
                placeholder="请输入您的邮箱地址"
                disabled={isLoading}
                clearable
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">新密码</label>
              <Input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={(val) => handleInputChange('newPassword', val)}
                placeholder="请输入新密码（至少6位）"
                disabled={isLoading}
                clearable
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">确认新密码</label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(val) => handleInputChange('confirmPassword', val)}
                placeholder="请再次输入新密码"
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
              className="reset-button"
            >
              {isLoading ? '重置中...' : '重置密码'}
            </Button>

            <div className="forgot-password-footer">
              <div className="footer-links">
                <Link to="/login">返回登录</Link>
                <Link to="/register">立即注册</Link>
              </div>
            </div>
          </form>
        ) : (
          <div className="success-content">
            <div className="success-message">
              密码重置成功！您现在可以使用新密码登录了。
            </div>

            <div className="success-actions">
              <Button
                type="button"
                color="primary"
                size="large"
                block
                className="login-button"
                onClick={() => window.location.href = '/login'}
              >
                立即登录
              </Button>

              <p className="reset-text">
                需要重新重置？
                <Button
                  type="button"
                  fill="none"
                  size="small"
                  className="reset-again-button"
                  onClick={handleReset}
                >
                  重新重置
                </Button>
              </p>

              <div className="footer-links">
                <Link to="/register">立即注册</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;