/**
 * API配置文件
 * 统一管理API相关的配置信息
 */

// API基础配置
// 使用相对路径，通过Vite代理转发到后端服务器
export const API_BASE_URL = "/";
export const REQUEST_TIMEOUT = 10000; // 请求超时时间（毫秒）

/**
 * API端点配置
 * 统一管理所有API端点
 */
export const API_ENDPOINTS = {
  // 用户相关接口
  USER: {
    REGISTER: "api/user/register",
    LOGIN: "api/user/login",
    INFO: "api/user/info",
    RESET_PASSWORD: "api/user/reset-password",
  },

  // 可以在这里添加其他模块的接口
  // PRODUCT: {
  //   LIST: 'api/product/list',
  //   DETAIL: 'api/product/detail',
  // },
};
