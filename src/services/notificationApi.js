import { API_BASE_URL, REQUEST_TIMEOUT } from '../config/api';

/**
 * 通知API服务层
 * 封装所有通知相关的HTTP请求
 */
class NotificationApi {
  /**
   * 发送HTTP请求的通用方法
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 响应数据
   */
  async request(url, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // 如果有token，添加到请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        const error = new Error(data.message || '请求失败');
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data,
        };
        throw error;
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('请求超时，请检查网络连接');
      }
      throw error;
    }
  }

  /**
   * 获取通知列表
   * @param {Object} params - 查询参数
   * @param {string} [params.type] - 通知类型 (maintenance/update/general/renewal/permanent)
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.limit=10] - 每页数量
   * @param {boolean} [params.unreadOnly] - 仅获取未读通知
   * @returns {Promise<Object>} 通知列表响应
   */
  async getNotifications(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}api/notifications${queryString ? '?' + queryString : ''}`;
      const response = await this.request(url);
      return response;
    } catch (error) {
      console.error('获取通知列表失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 根据类型获取通知
   * @param {string} type - 通知类型
   * @param {Object} params - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.limit=10] - 每页数量
   * @param {boolean} [params.unreadOnly] - 仅获取未读通知
   * @returns {Promise<Object>} 通知列表响应
   */
  async getNotificationsByType(type, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}api/notifications/type/${type}${queryString ? '?' + queryString : ''}`;
      const response = await this.request(url);
      return response;
    } catch (error) {
      console.error(`获取${type}类型通知失败:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * 获取未读通知数量
   * @returns {Promise<Object>} 未读通知数量响应
   */
  async getUnreadCount() {
    try {
      const url = `${API_BASE_URL}api/notifications/unread-count`;
      const response = await this.request(url);
      return response;
    } catch (error) {
      console.error('获取未读通知数量失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 获取通知统计信息
   * @returns {Promise<Object>} 通知统计响应
   */
  async getNotificationStats() {
    try {
      const url = `${API_BASE_URL}api/notifications/stats`;
      const response = await this.request(url);
      return response;
    } catch (error) {
      console.error('获取通知统计失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 标记单个通知为已读
   * @param {string} notificationId - 通知ID
   * @returns {Promise<Object>} 标记已读响应
   */
  async markAsRead(notificationId) {
    try {
      const url = `${API_BASE_URL}api/notifications/${notificationId}/read`;
      const response = await this.request(url, {
        method: 'PUT'
      });
      return response;
    } catch (error) {
      console.error('标记通知已读失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 批量标记通知为已读
   * @param {string[]} notificationIds - 通知ID数组
   * @returns {Promise<Object>} 批量标记已读响应
   */
  async markMultipleAsRead(notificationIds) {
    try {
      const url = `${API_BASE_URL}api/notifications/mark-read`;
      const response = await this.request(url, {
        method: 'PUT',
        body: JSON.stringify({ notificationIds })
      });
      return response;
    } catch (error) {
      console.error('批量标记通知已读失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 获取通知类型标签
   * @param {string} type - 通知类型
   * @returns {string} 类型标签
   */
  getTypeLabel(type) {
    const labels = {
      maintenance: '维护通知',
      update: '更新通知',
      general: '一般通知',
      renewal: '续费通知',
      permanent: '长期通知'
    };
    return labels[type] || '未知类型';
  }

  /**
   * 获取优先级标签
   * @param {string} priority - 优先级
   * @returns {string} 优先级标签
   */
  getPriorityLabel(priority) {
    const labels = {
      low: '低',
      medium: '中',
      high: '高',
      urgent: '紧急'
    };
    return labels[priority] || '未知';
  }

  /**
   * 格式化时间
   * @param {string} timeString - ISO时间字符串
   * @returns {string} 格式化后的时间
   */
  formatTime(timeString) {
    if (!timeString) return '';
    return new Date(timeString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * 检查通知是否有效（在有效时间范围内）
   * @param {Object} notification - 通知对象
   * @returns {boolean} 是否有效
   */
  isNotificationValid(notification) {
    if (notification.isPermanent) {
      return true; // 长期通知始终有效
    }

    const now = new Date();
    const startTime = notification.startTime ? new Date(notification.startTime) : null;
    const endTime = notification.endTime ? new Date(notification.endTime) : null;

    if (startTime && now < startTime) {
      return false; // 还未到开始时间
    }

    if (endTime && now > endTime) {
      return false; // 已过结束时间
    }

    return true;
  }

  /**
   * 获取通知的CSS类名
   * @param {Object} notification - 通知对象
   * @returns {string} CSS类名
   */
  getNotificationClass(notification) {
    const classes = ['notification-item'];

    if (!notification.isRead) {
      classes.push('unread');
    }

    if (notification.isPermanent) {
      classes.push('permanent');
    }

    classes.push(`priority-${notification.priority}`);
    classes.push(`type-${notification.type}`);

    return classes.join(' ');
  }

  /**
   * 处理API错误
   * @param {Error} error - 错误对象
   * @returns {Error} 处理后的错误
   */
  handleError(error) {
    if (error.response) {
      // 服务器响应错误
      const { status, data } = error.response;
      const message = data?.message || '请求失败';

      switch (status) {
        case 400:
          return new Error(`参数错误: ${message}`);
        case 401:
          return new Error('未授权，请重新登录');
        case 404:
          return new Error('通知不存在或已过期');
        case 500:
          return new Error('服务器内部错误，请稍后重试');
        default:
          return new Error(message);
      }
    } else if (error.request) {
      // 网络错误
      return new Error('网络连接失败，请检查网络设置');
    } else {
      // 其他错误
      return new Error(error.message || '未知错误');
    }
  }
}

// 创建单例实例
const notificationApi = new NotificationApi();

export default notificationApi;

// 导出常用方法的简化版本
export const {
  getNotifications,
  getNotificationsByType,
  getUnreadCount,
  getNotificationStats,
  markAsRead,
  markMultipleAsRead,
  getTypeLabel,
  getPriorityLabel,
  formatTime,
  isNotificationValid,
  getNotificationClass
} = notificationApi;