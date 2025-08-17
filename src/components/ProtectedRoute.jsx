import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import '../styles/ProtectedRoute.css';

/**
 * 路由保护组件
 * 检查用户登录状态，未登录用户重定向到登录页面
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 需要保护的子组件
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 如果正在加载认证状态，显示加载界面
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>正在验证登录状态...</p>
      </div>
    );
  }

  // 如果未登录，重定向到登录页面，并保存当前路径
  if (!isAuthenticated()) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // 如果已登录，渲染子组件
  return children;
};

export default ProtectedRoute;