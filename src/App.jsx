import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// 页面组件
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ToastDemo from './pages/ToastDemo';
import Notifications from './pages/Notifications';
import AdminLogin from './pages/admin/Login';
import AdminHome from './pages/admin/Home';

// 样式
import './App.css';

/**
 * 主应用组件
 * 包含路由配置和页面导航
 */
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ConfigProvider locale={zhCN}>
          <Router>
            <div className="app">
              <Routes>
                {/* 默认路由重定向到首页 */}
                <Route path="/" element={<Navigate to="/home" replace />} />

                {/* 首页路由 */}
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />

                {/* 登录页面路由 */}
                <Route path="/login" element={<Login />} />

                {/* 注册页面路由 */}
                <Route path="/register" element={<Register />} />

                {/* 忘记密码页面路由 */}
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* 管理员路由组 */}
                <Route path="/admin/*">
                    <Route index element={<AdminHome />} />
                    <Route path="login" element={<AdminLogin />} />
                </Route>
                {/* 通知页面路由 */}
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />

                {/* 404页面 - 重定向到首页 */}
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </div>
          </Router>
        </ConfigProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
