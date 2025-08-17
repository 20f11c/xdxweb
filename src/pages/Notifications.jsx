import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import '../styles/Notifications.css';

/**
 * 简化的通知页面组件
 * 直接展示通知列表
 */
const Notifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
    formatTime
  } = useNotifications();

  /**
   * 处理通知点击
   * @param {Object} notification - 通知对象
   */
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  /**
   * 获取通知类型标签
   * @param {string} type - 通知类型
   */
  const getTypeLabel = (type) => {
    const labels = {
      maintenance: '维护通知',
      update: '更新通知',
      general: '一般通知',
      renewal: '续费通知',
      permanent: '长期通知'
    };
    return labels[type] || type;
  };



  if (loading) {
    return (
      <div className="notifications-page loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span>加载通知中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-page error">
        <div className="error-container">
          <h2>加载失败</h2>
          <p>{error}</p>
          <button onClick={refresh} className="retry-button">
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      {/* 页面头部 */}
      <div className="page-header">
        <h1>通知中心</h1>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="mark-all-read-button"
            >
              全部标记已读
            </button>
          )}
          <button
            onClick={refresh}
            className="refresh-button"
            disabled={loading}
          >
            刷新
          </button>
        </div>
      </div>

      {/* 通知列表 */}
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <p>暂无通知</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-header">
                <h3 className="notification-title">{notification.title}</h3>
                <div className="notification-meta">
                  <span className="notification-type">
                    {getTypeLabel(notification.type)}
                  </span>
                  <span className="notification-time">
                    {formatTime(notification.createdAt)}
                  </span>
                </div>
              </div>
              <div className="notification-content">
                <p>{notification.content}</p>
              </div>
              {notification.priority === 'high' && (
                <div className="priority-badge high">
                  重要
                </div>
              )}
              {!notification.isRead && (
                <div className="unread-indicator"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;