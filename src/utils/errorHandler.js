/**
 * 全局错误处理工具
 * 提供统一的错误处理和用户反馈机制
 */

import { Toast } from "../components/CustomToast";

/**
 * 错误类型枚举
 */
export const ERROR_TYPES = {
  NETWORK: "NETWORK",
  VALIDATION: "VALIDATION",
  AUTHENTICATION: "AUTHENTICATION",
  AUTHORIZATION: "AUTHORIZATION",
  SERVER: "SERVER",
  UNKNOWN: "UNKNOWN",
};

/**
 * 错误消息映射
 */
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: "网络连接失败，请检查网络设置",
  [ERROR_TYPES.VALIDATION]: "输入信息有误，请检查后重试",
  [ERROR_TYPES.AUTHENTICATION]: "登录已过期，请重新登录",
  [ERROR_TYPES.AUTHORIZATION]: "权限不足，无法执行此操作",
  [ERROR_TYPES.SERVER]: "服务器错误，请稍后重试",
  [ERROR_TYPES.UNKNOWN]: "未知错误，请稍后重试",
};

/**
 * 根据HTTP状态码确定错误类型
 * @param {number} status - HTTP状态码
 * @returns {string} 错误类型
 */
export const getErrorTypeByStatus = (status) => {
  if (status >= 400 && status < 500) {
    switch (status) {
      case 400:
        return ERROR_TYPES.VALIDATION;
      case 401:
        return ERROR_TYPES.AUTHENTICATION;
      case 403:
        return ERROR_TYPES.AUTHORIZATION;
      default:
        return ERROR_TYPES.VALIDATION;
    }
  } else if (status >= 500) {
    return ERROR_TYPES.SERVER;
  } else {
    return ERROR_TYPES.UNKNOWN;
  }
};

/**
 * 处理API错误
 * @param {Error} error - 错误对象
 * @param {Object} options - 处理选项
 * @param {boolean} options.showToast - 是否显示Toast提示
 * @param {string} options.customMessage - 自定义错误消息
 * @param {Function} options.onError - 错误回调函数
 * @returns {Object} 处理后的错误信息
 */
export const handleApiError = (error, options = {}) => {
  const { showToast = true, customMessage, onError } = options;

  let errorType = ERROR_TYPES.UNKNOWN;
  let errorMessage = ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];
  let statusCode = null;

  // 处理网络错误
  if (!error.response) {
    errorType = ERROR_TYPES.NETWORK;
    errorMessage = ERROR_MESSAGES[ERROR_TYPES.NETWORK];
  } else {
    // 处理HTTP错误
    statusCode = error.response.status;
    errorType = getErrorTypeByStatus(statusCode);

    // 优先使用服务器返回的错误消息
    if (error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = ERROR_MESSAGES[errorType];
    }
  }

  // 使用自定义消息（如果提供）
  if (customMessage) {
    errorMessage = customMessage;
  }

  const errorInfo = {
    type: errorType,
    message: errorMessage,
    statusCode,
    originalError: error,
  };

  // 显示Toast提示
  if (showToast) {
    Toast.error(errorMessage);
  }

  // 执行错误回调
  if (onError && typeof onError === "function") {
    onError(errorInfo);
  }

  // 特殊处理认证错误
  if (errorType === ERROR_TYPES.AUTHENTICATION) {
    // 清除本地存储的认证信息
    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    // 延迟跳转到登录页面，避免立即跳转
    setTimeout(() => {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }, 1500);
  }

  console.error("API错误:", errorInfo);

  return errorInfo;
};

/**
 * 处理表单验证错误
 * @param {Object} validationErrors - 验证错误对象
 * @param {boolean} showToast - 是否显示Toast提示
 * @returns {string} 第一个错误消息
 */
export const handleValidationErrors = (validationErrors, showToast = true) => {
  if (!validationErrors || typeof validationErrors !== "object") {
    return "";
  }

  // 获取第一个错误消息
  const firstError = Object.values(validationErrors)[0];
  const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;

  if (showToast && errorMessage) {
    Toast.error(errorMessage);
  }

  return errorMessage || "";
};

/**
 * 创建错误边界组件的错误处理函数
 * @param {Error} error - 错误对象
 * @param {Object} errorInfo - 错误信息
 */
export const handleComponentError = (error, errorInfo) => {
  console.error("组件错误:", error, errorInfo);

  // 可以在这里添加错误上报逻辑
  // 例如发送到错误监控服务

  Toast.error("页面出现错误，请刷新重试");
};

/**
 * 通用的异步操作错误处理包装器
 * @param {Function} asyncFn - 异步函数
 * @param {Object} options - 错误处理选项
 * @param {string} options.successMessage - 成功提示消息
 * @returns {Function} 包装后的函数
 */
export const withErrorHandler = (asyncFn, options = {}) => {
  return async (...args) => {
    try {
      const result = await asyncFn(...args);

      // 如果操作成功且配置了成功消息，显示成功提示
      if (result && result.success && options.successMessage) {
        Toast.success(options.successMessage);
      }

      return result;
    } catch (error) {
      handleApiError(error, options);
      throw error; // 重新抛出错误，让调用者可以进一步处理
    }
  };
};

export default {
  handleApiError,
  handleValidationErrors,
  handleComponentError,
  withErrorHandler,
  ERROR_TYPES,
  getErrorTypeByStatus,
};
