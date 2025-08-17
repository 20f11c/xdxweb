import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Toast, Dropdown, Space, Badge, Button, Card } from 'antd-mobile';
import { UserOutline, BellOutline, CheckOutline } from 'antd-mobile-icons';
import AuthContext from '../contexts/auth';
import Layout from '../components/Layout';
import { useNotifications } from '../hooks/useNotifications';
import '../styles/Home.css';

/**
 * 首页组件
 * 展示应用的主要功能和内容，包括通知列表
 * 适配移动端、PC端和大屏设备
 */
const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { notifications: rawNotifications, unreadCount, loading, error, markAsRead, refresh: refreshNotifications } = useNotifications();

  // 过滤已读和已隐藏的通知
  const notifications = rawNotifications.filter(notification => {
    // 过滤已读通知
    if (notification.read) {
      return false;
    }

    // 过滤本地隐藏的通知
    const hiddenNotifications = JSON.parse(localStorage.getItem('hiddenNotifications') || '{}');
    const hiddenInfo = hiddenNotifications[notification._id || notification.id];

    if (!hiddenInfo) return true;

    // 检查隐藏时间是否已过期
    const hideUntil = new Date(hiddenInfo.hideUntil);
    const now = new Date();

    if (now > hideUntil) {
      // 隐藏时间已过期，从本地存储中移除
      delete hiddenNotifications[notification._id || notification.id];
      localStorage.setItem('hiddenNotifications', JSON.stringify(hiddenNotifications));
      return true;
    }

    return false; // 仍在隐藏期内
  });

  // 移除重复的数据加载，useNotifications hook 已经通过 autoLoad 自动加载数据

  /**
   * 清理过期的隐藏通知记录
   */
  const cleanupExpiredHiddenNotifications = useCallback(() => {
    const hiddenNotifications = JSON.parse(localStorage.getItem('hiddenNotifications') || '{}');
    const now = new Date();
    let hasChanges = false;

    Object.keys(hiddenNotifications).forEach(notificationId => {
      const hiddenInfo = hiddenNotifications[notificationId];
      const hideUntil = new Date(hiddenInfo.hideUntil);

      if (now > hideUntil) {
        delete hiddenNotifications[notificationId];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      localStorage.setItem('hiddenNotifications', JSON.stringify(hiddenNotifications));
    }
  }, []);

  // 组件挂载时清理过期记录，并设置定期清理
  useEffect(() => {
    cleanupExpiredHiddenNotifications();

    // 每小时清理一次过期记录
    const cleanupInterval = setInterval(cleanupExpiredHiddenNotifications, 60 * 60 * 1000);

    return () => clearInterval(cleanupInterval);
  }, [cleanupExpiredHiddenNotifications]);

  /**
   * 处理头像点击事件
   */
  const handleAvatarClick = () => {
    setDropdownVisible(!dropdownVisible);
  };



  /**
   * 隐藏通知到本地存储
   * @param {string} notificationId - 通知ID
   * @param {number} hours - 隐藏小时数
   */
  const hideNotificationLocally = (notificationId, hours) => {
    const hiddenNotifications = JSON.parse(localStorage.getItem('hiddenNotifications') || '{}');
    const hideUntil = new Date();
    hideUntil.setHours(hideUntil.getHours() + hours);

    hiddenNotifications[notificationId] = {
      hideUntil: hideUntil.toISOString(),
      reason: 'temp_hide'
    };

    localStorage.setItem('hiddenNotifications', JSON.stringify(hiddenNotifications));

    const timeText = hours >= 24 ? `${Math.floor(hours / 24)}天` : `${hours}小时`;
    Toast.show({
      content: `通知已隐藏${timeText}`,
      position: 'center'
    });

    // 刷新通知列表以应用隐藏效果
    refreshNotifications();
  };

  /**
   * 处理通知点击事件
   */
  const handleNotificationClick = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      Toast.show({
        content: '通知已标记为已读',
        position: 'center'
      });
      // 刷新通知列表以移除已读通知
      refreshNotifications();
    } catch {
      // 如果标记为已读失败，显示隐藏选项
      // 使用简单的确认方式
      if (window.confirm('无法标记为已读，是否要临时隐藏此通知？\n\n点击确定隐藏24小时，点击取消不处理')) {
        hideNotificationLocally(notificationId, 24);
      }
    }
  };



  /**
   * 获取通知类型标签
   */
  const getTypeLabel = (type) => {
    const typeMap = {
      system: '系统',
      user: '用户',
      order: '订单',
      promotion: '推广'
    };
    return typeMap[type] || '其他';
  };



  /**
   * 处理退出登录
   */
  const handleLogout = async () => {
    setDropdownVisible(false);
    try {
      await logout();
      Toast.show({
        content: '已退出登录',
        position: 'center'
      });
    } catch {
      Toast.show({
        content: '退出登录失败',
        position: 'center'
      });
    }
  };

  // 下拉菜单项配置
  const dropdownItems = [
    {key: 'userInfo',
      title: (
        <div key="user-info-content" style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
          <UserOutline style={{ marginRight: '8px', fontSize: '16px' }} />
          <div key="user-details">
            <div key="username" style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
              {user?.username || '未知用户'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'logout',
      title: (
        <div key="logout-content" style={{ display: 'flex', alignItems: 'center', padding: '8px 0', color: '#ff4d4f' }}>
          <span key="logout-icon" style={{ marginRight: '8px', fontSize: '16px', color: '#ff4d4f' }}>⏻</span>
          <span key="logout-text">退出登录</span>
        </div>
      ),
      onClick: handleLogout
    }
  ];

  // 使用hook提供的未读数量，而不是手动计算

  // 导航栏配置
  const navBarProps = {
    title: '首页',
    showBack: false,
    showAvatar: true,
    showMessage: true, // 启用消息显示，显示真实的未读数量
    avatarSrc: '/src/assets/user.jpg',
    messageCount: unreadCount,
    onAvatarClick: handleAvatarClick
  };

  return (
    <Layout className="home-page" navBarProps={navBarProps}>
      {/* 头像下拉菜单 */}
      {dropdownVisible && (
        <div
          className="avatar-dropdown-overlay"
          onClick={() => setDropdownVisible(false)}
        >
          <div
            className="avatar-dropdown-menu"
            onClick={(e) => e.stopPropagation()}
          >
            {dropdownItems.map((item) => (
              <div
                key={item.key}
                className="dropdown-item"
                onClick={item.onClick}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 悬浮通知列表 */}
      {!loading && !error && notifications.length > 0 && (
        <div className="floating-notifications">
          <div className="notifications-container">
            {notifications.map((notification, index) => (
              <div
                key={notification._id || notification.id || index}
                className={`ant-notification-notice ant-notification-notice-${notification.priority === 'high' ? 'error' : notification.priority === 'medium' ? 'warning' : 'info'} ant-notification-notice-closable ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="ant-notification-notice-content">
                  <div className="ant-notification-notice-with-icon" role="alert">
                    <span
                      role="img"
                      aria-label={notification.priority === 'high' ? 'close-circle' : notification.priority === 'medium' ? 'exclamation-circle' : 'info-circle'}
                      className={`anticon anticon-${notification.priority === 'high' ? 'close-circle' : notification.priority === 'medium' ? 'exclamation-circle' : 'info-circle'} ant-notification-notice-icon ant-notification-notice-icon-${notification.priority === 'high' ? 'error' : notification.priority === 'medium' ? 'warning' : 'info'}`}
                    >
                      {notification.priority === 'high' && (
                        <svg key={`high-icon-${notification._id || notification.id || index}`} viewBox="64 64 896 896" focusable="false" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
                        </svg>
                      )}
                      {notification.priority === 'medium' && (
                        <svg key={`medium-icon-${notification._id || notification.id || index}`} viewBox="64 64 896 896" focusable="false" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
                        </svg>
                      )}
                      {notification.priority === 'low' && (
                        <svg key={`low-icon-${notification._id || notification.id || index}`} viewBox="64 64 896 896" focusable="false" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
                        </svg>
                      )}
                    </span>
                    <div className="ant-notification-notice-message">
                      {getTypeLabel(notification.type)} {notification.title}
                    </div>
                    <div className="ant-notification-notice-description">
                      <p key={`content-${notification._id || notification.id || index}`}>{notification.content}</p>
                      <p key={`time-${notification._id || notification.id || index}`} className="notification-time">{new Date(notification.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <a
                  tabIndex="0"
                  className="ant-notification-notice-close"
                  aria-label="Close"
                  onClick={() => handleNotificationClick(notification._id || notification.id)}
                >
                  <span role="img" aria-label="close" className="anticon anticon-close ant-notification-notice-close-icon">
                    <svg fillRule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                      <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path>
                    </svg>
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;