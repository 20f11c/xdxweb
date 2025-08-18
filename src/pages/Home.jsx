import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Toast, Dropdown, Space, Badge, Button, Card } from 'antd-mobile';
import { UserOutline, BellOutline, CheckOutline } from 'antd-mobile-icons';
import AuthContext from '../contexts/auth';
import Layout from '../components/Layout';
import FloatMenu from '../components/FloatMenu';
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



    // 刷新通知列表以应用隐藏效果
    refreshNotifications();
  };

  /**
   * 处理通知点击事件
   * @param {string|Object} notificationIdOrObject - 通知ID或通知对象
   */
  const handleNotificationClick = async (notificationIdOrObject) => {
    // 兼容处理：如果传入的是对象，提取ID和类型信息
    let notificationId, isPermanent, notificationType;
    if (typeof notificationIdOrObject === 'object') {
      notificationId = notificationIdOrObject._id || notificationIdOrObject.id;
      isPermanent = notificationIdOrObject.isPermanent || notificationIdOrObject.type === 'permanent';
      notificationType = notificationIdOrObject.type;
    } else {
      notificationId = notificationIdOrObject;
      isPermanent = false;
    }

    try {
      await markAsRead(notificationId);
      // 刷新通知列表以移除已读通知
      refreshNotifications();
    } catch {
      // 如果标记为已读失败，处理隐藏选项
      if (isPermanent || notificationType === 'permanent') {
        // 长期通知直接隐藏，不需要确认
        hideNotificationLocally(notificationId, 24);
      } else {
        // 普通通知需要确认
        if (window.confirm('无法标记为已读，是否要临时隐藏此通知？\n\n点击确定隐藏24小时，点击取消不处理')) {
          hideNotificationLocally(notificationId, 24);
        }
      }
    }
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

      {/* 悬浮通知列表 - 新设计 */}
      {!loading && !error && notifications.length > 0 && (
        <div className="floating-notifications">
          {notifications.map((notification, index) => {
            /**
             * 根据通知类型获取对应的图标和样式类名
             * @param {string} type - 通知类型
             * @returns {object} 包含图标和类名的对象
             */
            const getNotificationStyle = (type) => {
              switch (type) {
                case 'success':
                  return { icon: '✓', className: 'notification-success' };
                case 'error':
                  return { icon: '✕', className: 'notification-error' };
                case 'warning':
                  return { icon: '⚠', className: 'notification-warning' };
                case 'info':
                default:
                  return { icon: 'ℹ', className: 'notification-info' };
              }
            };

            const { icon, className } = getNotificationStyle(notification.type);

            /**
             * 计算通知的堆叠样式
             * 使用统一的堆叠算法，确保所有通知都能正确显示
             * @param {number} index - 通知在数组中的索引
             * @returns {object} 包含位置和变换样式的对象
             */
            const getStackingStyle = (index) => {
              // 基础位置：从顶部80px开始
              const baseTop = 80;
              // 每个通知的垂直间距：6px
              const verticalSpacing = 6;
              // 每个通知的Y轴位移：3px
              const translateY = index * 3;
              // 每个通知的缩放递减：1%
              const scale = Math.max(0.85, 1 - index * 0.01);
              // 确保最小缩放不小于0.85

              return {
                top: `${baseTop + index * verticalSpacing}px`,
                right: '24px',
                zIndex: 1010 - index,
                transform: `translateY(${translateY}px) scale(${scale})`
              };
            };

            return (
              <div
                key={notification._id || notification.id || index}
                className={`notification-item ${className} ${notification.read ? 'read' : 'unread'}`}
                style={{
                  position: 'absolute',
                  ...getStackingStyle(index)
                }}
              >
                <div className="notification-content">
                  <div className="notification-with-icon">
                    {/* 类型图标 */}
                    <div className="notification-icon">
                      <span className="notification-icon-symbol">{icon}</span>
                    </div>

                    <div className="notification-text">
                      {/* 标题 */}
                      <div className="notification-title">
                        {notification.title}
                      </div>

                      {/* 内容 */}
                      <div className="notification-description">
                        {notification.content}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="notification-close"
                  aria-label="Close"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <span className="notification-close-icon">×</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 悬浮菜单 */}
      <FloatMenu />
    </Layout>
  );
};

export default Home;