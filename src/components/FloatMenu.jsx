import React, { useState, useEffect, useRef } from 'react';
import '../styles/FloatMenu.css';

/**
 * 悬浮菜单组件
 * 在页面右下角显示一个可展开的悬浮按钮组
 */
const FloatMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  /**
   * 切换菜单展开状态
   */
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  /**
   * 关闭菜单
   */
  const closeMenu = () => {
    setIsOpen(false);
  };

  /**
   * 监听点击外部区域关闭菜单
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        closeMenu();
      }
    };

    // 添加事件监听器
    document.addEventListener('mousedown', handleClickOutside);
    
    // 清理事件监听器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * 处理菜单项点击事件
   * @param {string} action - 点击的菜单项类型
   */
  const handleMenuClick = (action) => {
    console.log(`点击了${action}按钮`);
    // 这里可以添加具体的功能逻辑
    switch (action) {
      case 'bulb':
        // 灯泡功能 - 可能是主题切换或帮助
        break;
      case 'question':
        // 问号功能 - 帮助或FAQ
        break;
      case 'cart':
        // 购物车功能
        break;
      case 'plus':
        // 添加功能
        break;
      default:
        break;
    }
  };

  return (
    <div ref={menuRef} className={`float-btn-group ${isOpen ? 'open' : ''}`}>
      <div className="float-btn-group-wrap">
        {/* 菜单项按钮容器 */}
        <div className="float-btn-items-container">
          <button
            className="float-btn float-btn-item float-btn-first"
            onClick={() => handleMenuClick('bulb')}
          >
            <div className="float-btn-body">
              <div className="float-btn-content">
                <div className="float-btn-icon">
                  <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
                    <path d="M632 888H392c-4.4 0-8 3.6-8 8v32c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-32c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-328 328 0 121.4 66 227.4 164 284.1V792c0 17.7 14.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98-56.7 164-162.7 164-284.1 0-181.1-146.9-328-328-328zm127.9 549.8L604 634.6V752H420V634.6l-35.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4 114.6-256 256-256s256 114.6 256 256c0 92.5-49.4 176.3-128.1 221.8z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </button>

          <button
            className="float-btn float-btn-item float-btn-middle"
            onClick={() => handleMenuClick('question')}
          >
            <div className="float-btn-body">
              <div className="float-btn-content">
                <div className="float-btn-icon">
                  <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                    <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </button>

          <button
            className="float-btn float-btn-item float-btn-middle"
            onClick={() => handleMenuClick('cart')}
          >
            <div className="float-btn-body">
              <div className="float-btn-content">
                <div className="float-btn-icon">
                  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                    <path d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 00-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 100 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 00-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 00-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </button>

          <button
            className="float-btn float-btn-item float-btn-last"
            onClick={() => handleMenuClick('plus')}
          >
            <div className="float-btn-body">
              <div className="float-btn-content">
                <div className="float-btn-icon">
                  <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
                    <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 主触发按钮 */}
      <button className="float-btn float-btn-trigger" onClick={toggleMenu}>
        <div className="float-btn-body">
          <div className="float-btn-content">
            <div className="float-btn-icon">
              {isOpen ? (
                <svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg>
              ) : (
                <svg viewBox="64 64 896 896" focusable="false" data-icon="expand-alt" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M855 160.1l-189.2 23.5c-6.6.8-9.3 8.8-4.7 13.5l54.7 54.7-153.5 153.5a8.03 8.03 0 000 11.3l45.1 45.1c3.1 3.1 8.2 3.1 11.3 0l153.6-153.6 54.7 54.7a7.94 7.94 0 0013.5-4.7L863.9 169a7.9 7.9 0 00-8.9-8.9zM416.6 562.3a8.03 8.03 0 00-11.3 0L251.8 715.9l-54.7-54.7a7.94 7.94 0 00-13.5 4.7L160.1 855c-.6 5.2 3.7 9.5 8.9 8.9l189.2-23.5c6.6-.8 9.3-8.8 4.7-13.5l-54.7-54.7 153.6-153.6c3.1-3.1 3.1-8.2 0-11.3l-45.2-45z"></path></svg>
              )}
            </div>
            <div className="float-btn-description">菜单</div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default FloatMenu;