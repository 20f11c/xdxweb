import React from 'react';
import { NavBar as AntdNavBar, Avatar, Badge } from 'antd-mobile';
import { MessageOutline, UserOutline } from 'antd-mobile-icons';
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
  avatarSrc = '/src/assets/user.jpg',
  messageCount = 0,
  onAvatarClick
}) => {
  /**
   * 渲染右侧操作区域 - 头像和消息整合
   */
  const renderRight = () => {
    if (!showAvatar) return null;

    return (
      <div className="navbar-right">
        <div className="avatar-message-container">
          <Avatar
            src={avatarSrc}
            style={{ '--size': '32px' }}
            onClick={onAvatarClick}
          >
            <UserOutline />
          </Avatar>
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