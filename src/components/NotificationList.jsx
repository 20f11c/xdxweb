import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import '../styles/NotificationList.css';

/**
 * 通知列表组件
 * 显示通知列表，支持筛选、分页和标记已读功能
 */
const NotificationList = ({
  showFilters = true,
  showPagination = true,
  maxHeight = '400px',
  onNotificationClick = null
}) => {
  const [selectedType, setSelectedType] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    markAsRead,
    markAllAsRead,
    changePage,
    filterByType,
    toggleUnreadOnly,
    refresh,
    getTypeLabel,
    getPriorityLabel,
    formatTime,
    getNotificationClass
  } = useNotifications({
    type: selectedType || null,
    unreadOnly
  });

  /**
   * 处理通知类型筛选
   * @param {string} type - 通知类型
   */
  const handleTypeFilter = async (type) => {
    setSelectedType(type);
    await filterByType(type || null);
  };

  /**
   * 处理未读筛选切换
   * @param {boolean} checked - 是否仅显示未读
   */
  const handleUnreadToggle = async (checked) => {
    setUnreadOnly(checked);
    await toggleUnreadOnly(checked);
  };

  /**
   * 处理通知点击
   * @param {Object} notification - 通知对象
   */
  const handleNotificationClick = async (notification) => {
    // 如果不是长期通知且未读，则标记为已读
    if (!notification.isPermanent && !notification.isRead) {
      try {
        await markAsRead(notification._id);
      } catch (err) {
        console.error('标记已读失败:', err);
      }
    }

    // 执行自定义点击处理
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  /**
   * 处理标记所有为已读
   */
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error('标记所有已读失败:', err);
    }
  };

  /**
   * 获取通知图标
   * @param {string} type - 通知类型
   * @returns {string} 图标类名
   */
  const getNotificationIcon = (type) => {
    const icons = {
      maintenance: '🔧',
      update: '🔄',
      general: '📢',
      renewal: '💰',
      permanent: '📌'
    };
    return icons[type] || '📢';
  };

  /**
   * 获取优先级颜色
   * @param {string} priority - 优先级
   * @returns {string} 颜色类名
   */
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      urgent: 'priority-urgent'
    };
    return colors[priority] || 'priority-medium';
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="notification-list loading">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification-list error">
        <div className="error-message">
          <span>加载失败: {error}</span>
          <button onClick={refresh} className="retry-btn">重试</button>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-list">
      {/* 头部 */}
      <div className="notification-header">
        <div className="header-left">
          <h3>系统通知</h3>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        <div className="header-right">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="mark-all-btn"
              disabled={loading}
            >
              全部已读
            </button>
          )}
          <button
            onClick={refresh}
            className="refresh-btn"
            disabled={loading}
          >
            刷新
          </button>
        </div>
      </div>

      {/* 筛选器 */}
      {showFilters && (
        <div className="notification-filters">
          <div className="filter-group">
            <label>类型筛选:</label>
            <select
              value={selectedType}
              onChange={(e) => handleTypeFilter(e.target.value)}
              disabled={loading}
            >
              <option value="">全部类型</option>
              <option value="maintenance">维护通知</option>
              <option value="update">更新通知</option>
              <option value="general">一般通知</option>
              <option value="renewal">续费通知</option>
              <option value="permanent">长期通知</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => handleUnreadToggle(e.target.checked)}
                disabled={loading}
              />
              仅显示未读
            </label>
          </div>
        </div>
      )}

      {/* 通知列表 */}
      <div
        className="notification-items"
        style={{ maxHeight }}
      >
        {notifications.length === 0 ? (
          <div className="empty-state">
            <span>暂无通知</span>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={getNotificationClass(notification)}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-content">
                <div className="notification-header-item">
                  <div className="notification-type">
                    <span className="type-icon">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <span className="type-label">
                      {getTypeLabel(notification.type)}
                    </span>
                    {notification.isPermanent && (
                      <span className="permanent-badge">长期</span>
                    )}
                  </div>
                  <div className="notification-meta">
                    <span className={`priority-badge ${getPriorityColor(notification.priority)}`}>
                      {getPriorityLabel(notification.priority)}
                    </span>
                    <span className="notification-time">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                </div>

                <h4 className="notification-title">
                  {notification.title}
                  {!notification.isRead && !notification.isPermanent && (
                    <span className="unread-dot"></span>
                  )}
                </h4>

                <p className="notification-text">
                  {notification.content}
                </p>

                {notification.isRead && notification.readAt && (
                  <div className="read-info">
                    已读于 {formatTime(notification.readAt)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 分页 */}
      {showPagination && pagination.total > 1 && (
        <div className="notification-pagination">
          <button
            onClick={() => changePage(pagination.current - 1)}
            disabled={pagination.current <= 1 || loading}
            className="page-btn"
          >
            上一页
          </button>

          <span className="page-info">
            第 {pagination.current} 页，共 {pagination.total} 页
          </span>

          <button
            onClick={() => changePage(pagination.current + 1)}
            disabled={pagination.current >= pagination.total || loading}
            className="page-btn"
          >
            下一页
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">加载中...</div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;