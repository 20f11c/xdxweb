import React from 'react';
import NavBar from './NavBar';
import '../styles/Layout.css';

/**
 * 响应式布局组件
 * 适配移动端、PC端和大屏移动设备
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件内容
 * @param {string} props.className - 额外的CSS类名
 * @param {boolean} props.showNavBar - 是否显示导航栏
 * @param {Object} props.navBarProps - 导航栏属性
 */
const Layout = ({
  children,
  className = '',
  showNavBar = true,
  navBarProps = {}
}) => {
  return (
    <div className={`layout-container ${className}`}>
      {showNavBar && <NavBar {...navBarProps} />}
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;