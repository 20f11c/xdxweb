/**
 * 用户API服务层
 * 封装用户认证相关的HTTP请求
 */

import { API_BASE_URL, REQUEST_TIMEOUT, API_ENDPOINTS } from "../config/api.js";
import { withErrorHandler, handleApiError } from "../utils/errorHandler.js";
import { Toast } from "../components/CustomToast.jsx";

/**
 * 发送HTTP请求的通用方法
 * @param {string} url - 请求URL
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 响应数据
 */
async function request(url, options = {}) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    timeout: REQUEST_TIMEOUT,
    ...options,
  };

  // 如果有token，添加到请求头
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    // 检查业务状态码
    if (data.code && data.code !== 200) {
      const error = new Error(data.message || "请求失败");
      error.response = {
        status: data.code,
        statusText: response.statusText,
        data,
      };
      throw error;
    }

    // 检查HTTP状态码
    if (!response.ok) {
      const error = new Error(data.message || "请求失败");
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data,
      };
      throw error;
    }

    return data;
  } catch (error) {
    // 如果是AbortError（超时），转换为更友好的错误信息
    if (error.name === "AbortError") {
      const timeoutError = new Error("请求超时，请检查网络连接");
      timeoutError.isTimeout = true;
      throw timeoutError;
    }

    // 网络错误处理
    if (!error.response && error.message === "Failed to fetch") {
      const networkError = new Error("网络连接失败，请检查网络设置");
      networkError.isNetworkError = true;
      throw networkError;
    }

    throw error;
  }
}

/**
 * 用户注册
 * @param {Object} userData - 用户注册数据
 * @param {string} userData.username - 用户名
 * @param {string} userData.email - 邮箱
 * @param {string} userData.password - 密码
 * @returns {Promise<Object>} 注册结果
 */
export const registerUser = async (userData) => {
  try {
    const response = await request(API_ENDPOINTS.USER.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    });
    
    // 显示服务器返回的成功消息
    if (response.code === 200 && response.data && response.data.message) {
      Toast.success(response.data.message);
    }
    
    // 转换为统一的响应格式
    return {
      success: response.code === 200,
      data: response.data,
      message: response.message
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * 用户登录
 * @param {Object} loginData - 登录数据
 * @param {string} loginData.username - 用户名
 * @param {string} loginData.password - 密码
 * @returns {Promise<Object>} 登录结果
 */
export const loginUser = async (loginData) => {
  try {
    const response = await request(API_ENDPOINTS.USER.LOGIN, {
      method: "POST",
      body: JSON.stringify(loginData),
    });
    
    // 显示服务器返回的成功消息
    if (response.code === 200 && response.message) {
      Toast.success("登录成功！");
    }
    
    // 登录成功后保存token
    if (response.code === 200 && response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    // 转换为统一的响应格式
    return {
      success: response.code === 200,
      data: response.data,
      message: response.message
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * 用户登出
 * JWT是无状态的，只需要清除本地存储的token和用户信息
 * @returns {Promise<Object>} 登出结果
 */
export const logoutUser = async () => {
  // 清除本地存储的token和用户信息
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
  // 返回成功结果
  return {
    success: true,
    message: "退出登录成功"
  };
};

/**
 * 重置密码
 * @param {Object} resetData - 重置密码数据
 * @param {string} resetData.username - 用户名
 * @param {string} resetData.email - 邮箱
 * @param {string} resetData.newPassword - 新密码
 * @returns {Promise<Object>} 重置结果
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await request(API_ENDPOINTS.USER.RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify(resetData),
    });
    
    // 显示服务器返回的成功消息
    if (response.code === 200 && response.data && response.data.message) {
      Toast.success(response.data.message);
    }
    
    // 转换为统一的响应格式
    return {
      success: response.code === 200,
      data: response.data,
      message: response.message
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * 获取用户信息
 * @returns {Promise<Object>} 用户信息
 */
export const getUserInfo = withErrorHandler(
  async () => {
    return await request(API_ENDPOINTS.USER.INFO, {
      method: "GET",
    });
  },
  {
    customMessage: "获取用户信息失败",
  }
);

/**
 * 检查token是否有效
 * @returns {boolean} token是否有效
 */
export function isTokenValid() {
  const token = localStorage.getItem("token");
  return !!token;
}

/**
 * 获取本地存储的用户信息
 * @returns {Object|null} 用户信息
 */
export function getLocalUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * 清除本地存储的认证信息
 */
export function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
