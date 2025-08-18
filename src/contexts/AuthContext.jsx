import React, { useState, useEffect } from 'react';
import AuthContext from './auth';
import { logoutUser, getUserInfo } from '../services/userApi';

/**
 * 认证状态提供者组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 检查本地存储中的登录状态并验证token有效性
   */
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          // 验证token有效性，获取用户信息
          const response = await getUserInfo();

          if (response.success) {
            setUser(response.data.user);
          } else {
            // token无效，清除本地存储
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
        // 清除可能损坏的数据
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * 用户登录
   * @param {Object} userData - 用户数据
   * @param {string} token - JWT token
   */
  const login = (userData, token) => {
    // 保存到本地存储
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);
  };



  /**
   * 用户登出
   */
  const logout = async () => {
    try {
      // 调用API登出
      await logoutUser();
    } catch (error) {
      console.error('登出API调用失败:', error);
    } finally {
      // 无论API调用是否成功，都清除本地数据
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};