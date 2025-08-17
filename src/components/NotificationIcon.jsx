import React from 'react';
import { useUnreadCount } from '../hooks/useNotifications';
import '../styles/NotificationIcon.css';

/**
 * 简化的通知图标组件
 * 仅显示通知图标和未读数量，点击跳转到通知页面
 */
const NotificationIcon = ({
  onClick = null,
  className = '',
  size = 'medium'
}) => {
  const { unreadCount, loading } = useUnreadCount();

  /**
   * 处理图标点击
   */
  const handleIconClick = (e) => {
    e.stopPropagation();
    
    if (onClick) {
      onClick(e);
    } else {
      // 默认跳转到通知页面
      window.location.href = '/notifications';
    }
  };

  return (
    <div className={`notification-icon-container ${className}`}>
      <div
        className={`notification-icon ${size}`}
        onClick={handleIconClick}
        title="通知"
      >
        {/* 通知铃铛图标 */}
        <svg
          className="bell-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7C13 10.76 15.15 14.09 18 15.71V17H6V15.71C8.85 14.09 11 10.76 11 7V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2ZM10 20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20H10Z"
            fill="currentColor"
          />
        </svg>

        {/* 未读数量徽章 */}
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* 加载状态 */}
        {loading && (
          <div className="loading-indicator"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationIcon;