import React from 'react';
import { NavBar as AntdNavBar, Avatar, Dropdown } from 'antd-mobile';
import { MessageOutline, UserOutline, MoreOutline } from 'antd-mobile-icons';
import { useAuth } from '../contexts/auth';
import '../styles/NavBar.css';

/**
 * 通用导航栏组件
 * @param {Object} props - 组件属性
 * @param {string} props.title - 导航栏标题
 * @param {boolean} props.showBack - 是否显示返回按钮
 * @param {Function} props.onBack - 返回按钮点击事件
 * @param {boolean} props.showAvatar - 是否显示头像
 * @param {boolean} props.showMessage - 是否显示消息图标

 * @param {string} props.avatarSrc - 头像图片源
 * @param {number} props.messageCount - 消息数量
 * @param {Function} props.onAvatarClick - 头像点击事件
 */
const NavBar = ({
  title = '首页',
  showBack = false,
  onBack,
  showAvatar = true,
  showMessage = true,

  avatarSrc,
  messageCount = 0,
  onAvatarClick
}) => {
  const { user, logout } = useAuth();
  /**
   * 处理用户登出
   */
  const handleLogout = () => {
    logout();
  };

  /**
   * 获取头像源
   * 优先级：用户头像 > 传入的avatarSrc > 默认图标
   */
  const getAvatarSrc = () => {
    if (user?.avatar) return user.avatar;
    if (avatarSrc) {
      // 处理相对路径，转换为正确的静态资源路径
      if (avatarSrc.startsWith('/src/')) {
        return avatarSrc.replace('/src/', '/');
      }
      return avatarSrc;
    }
    return null;
  };

  /**
   * 渲染右侧操作区域 - 头像和用户菜单
   */
  const renderRight = () => {
    if (!showAvatar || !user) return null;

    const dropdownItems = [
      {
        key: 'profile',
        title: '个人信息'
      },
      {
        key: 'settings',
        title: '设置'
      },
      {
        key: 'logout',
        title: '退出登录'
      }
    ];

    const handleAvatarClick = () => {
      if (onAvatarClick) {
        onAvatarClick();
      }
    };

    return (
      <div className="navbar-right">
        <div className="user-info">
          <Dropdown
            items={dropdownItems}
            onItemClick={(item) => {
              if (item.key === 'logout') {
                handleLogout();
              } else if (item.key === 'profile') {
                handleAvatarClick();
              }
            }}
          >
            <Avatar
              src={getAvatarSrc()}
              style={{ '--size': '32px' }}
              onClick={handleAvatarClick}
            >
              <UserOutline />
            </Avatar>
          </Dropdown>
          {showMessage && messageCount > 0 && (
            <div className="message-badge">
              {messageCount > 99 ? '99+' : messageCount}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="common-navbar">
      <AntdNavBar
        back={showBack ? '返回' : null}
        onBack={onBack}
        right={renderRight()}
      >
        {title}
      </AntdNavBar>
    </div>
  );
};

export default NavBar;