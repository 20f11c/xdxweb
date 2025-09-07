import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, Form } from "antd-mobile";
import { Toast } from "../../components/CustomToast";
import "../../styles/admin/Login.css";

/**
 * 管理员登录页面组件
 * 提供管理员登录功能，包含用户名和密码输入
 */
const Login = () => {
  // 表单状态管理
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * 处理输入框变化
   * @param {string} field - 字段名
   * @param {string} value - 输入值
   */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * 表单验证
   * @throws {Error} 验证失败时抛出错误
   */
  const validateForm = () => {
    if (!formData.username.trim()) {
      throw new Error("请输入管理员用户名");
    }

    if (!formData.password) {
      throw new Error("请输入管理员密码");
    }

    if (formData.password.length < 6) {
      throw new Error("密码长度不能少于6位");
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
      Toast.error(validationError.message);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 调用管理员登录API
      // const response = await adminLoginUser({
      //   username: formData.username.trim(),
      //   password: formData.password,
      // });

      // 模拟登录成功
      Toast.success("管理员登录成功！");
      
      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        navigate("/admin/dashboard", { replace: true });
      }, 1000);
    } catch (error) {
      console.error("管理员登录错误:", error);
      Toast.error("登录失败，请检查用户名和密码");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <div className="admin-logo">
            <div className="admin-icon">🛡️</div>
          </div>
          <h1>管理员登录</h1>
          <p>请使用管理员账号登录后台管理系统</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">管理员用户名</label>
            <Input
              id="username"
              type="text"
              placeholder="请输入管理员用户名"
              value={formData.username}
              onChange={(value) => handleInputChange("username", value)}
              disabled={isLoading}
              clearable
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">管理员密码</label>
            <Input
              id="password"
              type="password"
              placeholder="请输入管理员密码"
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            block
            className="admin-login-button"
          >
            {isLoading ? "登录中..." : "登录管理后台"}
          </Button>

          <div className="admin-login-footer">
            <div className="footer-links">
              <Link to="/login">返回用户登录</Link>
              <span className="admin-note">仅限管理员使用</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;