import React from 'react';
import {
  Button,
  Card,
  Grid,
  Space,
  Toast,
  Divider,
  Image,
  Tag
} from 'antd-mobile';
import {
  AppOutline,
  SetOutline,
  HeartOutline,
  MoreOutline
} from 'antd-mobile-icons';
import Layout from '../components/Layout';
import '../styles/Home.css';

/**
 * 首页组件
 * 展示应用的主要功能和内容
 * 适配移动端、PC端和大屏设备
 */
const Home = () => {
  /**
   * 处理功能按钮点击事件
   * @param {string} feature - 功能名称
   */
  const handleFeatureClick = (feature) => {
    Toast.show({
      content: `点击了${feature}功能`,
      position: 'center'
    });
  };

  /**
   * 处理卡片点击事件
   * @param {string} title - 卡片标题
   */
  const handleCardClick = (title) => {
    Toast.show({
      content: `查看${title}`,
      position: 'center'
    });
  };

  // 导航栏配置
  const navBarProps = {
    title: '首页',
    showBack: false,
    showAvatar: true,
    showMessage: true,
    avatarSrc: '/src/assets/user.jpg',
    messageCount: 5,
    onAvatarClick: () => handleFeatureClick('个人中心')
  };

  return (
    <Layout className="home-page" navBarProps={navBarProps}>
      {/* 欢迎区域 */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-text">
            <div className="welcome-title">欢迎回来</div>
            <div className="welcome-desc">今天是美好的一天</div>
          </div>
        </div>
      </div>

      {/* 快捷功能区域 */}
      <Card className="feature-card">
        <div className="card-title">快捷功能</div>
        <Grid columns={4} gap={16}>
          <Grid.Item>
            <div
              className="feature-item"
              onClick={() => handleFeatureClick('扫一扫')}
            >
              <div className="feature-icon">
                <AppOutline fontSize={28} />
              </div>
              <div className="feature-text">扫一扫</div>
            </div>
          </Grid.Item>
          <Grid.Item>
            <div
              className="feature-item"
              onClick={() => handleFeatureClick('收藏')}
            >
              <div className="feature-icon">
                <HeartOutline fontSize={28} />
              </div>
              <div className="feature-text">收藏</div>
            </div>
          </Grid.Item>
          <Grid.Item>
            <div
              className="feature-item"
              onClick={() => handleFeatureClick('设置')}
            >
              <div className="feature-icon">
                <SetOutline fontSize={28} />
              </div>
              <div className="feature-text">设置</div>
            </div>
          </Grid.Item>
          <Grid.Item>
            <div
              className="feature-item"
              onClick={() => handleFeatureClick('更多')}
            >
              <div className="feature-icon">
                <MoreOutline fontSize={28} />
              </div>
              <div className="feature-text">更多</div>
            </div>
          </Grid.Item>
        </Grid>
      </Card>

      {/* 推荐内容区域 */}
      <Card className="content-card">
        <div className="card-title">推荐内容</div>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div
            className="content-item"
            onClick={() => handleCardClick('热门文章')}
          >
            <div className="content-image">
              <Image
                src=""
                width={80}
                height={60}
                fit="cover"
                style={{ borderRadius: '6px' }}
                placeholder={<div className="image-placeholder">图片</div>}
              />
            </div>
            <div className="content-info">
              <div className="content-title">探索移动端开发的最佳实践</div>
              <div className="content-desc">了解如何构建高质量的移动端应用</div>
              <div className="content-meta">
                <Tag color="primary" fill="outline" size="small">技术</Tag>
                <span className="meta-text">2小时前</span>
                <span className="meta-text">1.2k阅读</span>
              </div>
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          <div
            className="content-item"
            onClick={() => handleCardClick('设计指南')}
          >
            <div className="content-image">
              <Image
                src=""
                width={80}
                height={60}
                fit="cover"
                style={{ borderRadius: '6px' }}
                placeholder={<div className="image-placeholder">图片</div>}
              />
            </div>
            <div className="content-info">
              <div className="content-title">响应式设计的核心原则</div>
              <div className="content-desc">掌握多端适配的设计技巧</div>
              <div className="content-meta">
                <Tag color="success" fill="outline" size="small">设计</Tag>
                <span className="meta-text">5小时前</span>
                <span className="meta-text">856阅读</span>
              </div>
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          <div
            className="content-item"
            onClick={() => handleCardClick('用户体验')}
          >
            <div className="content-image">
              <Image
                src=""
                width={80}
                height={60}
                fit="cover"
                style={{ borderRadius: '6px' }}
                placeholder={<div className="image-placeholder">图片</div>}
              />
            </div>
            <div className="content-info">
              <div className="content-title">提升用户体验的交互设计</div>
              <div className="content-desc">创造更好的用户交互体验</div>
              <div className="content-meta">
                <Tag color="warning" fill="outline" size="small">体验</Tag>
                <span className="meta-text">1天前</span>
                <span className="meta-text">2.1k阅读</span>
              </div>
            </div>
          </div>
        </Space>
      </Card>

      {/* 操作按钮区域 */}
      <div className="action-section">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            color="primary"
            size="large"
            block
            onClick={() => handleFeatureClick('开始探索')}
          >
            开始探索
          </Button>
          <Button
            fill="outline"
            size="large"
            block
            onClick={() => handleFeatureClick('了解更多')}
          >
            了解更多
          </Button>
        </Space>
      </div>
    </Layout>
  );
};

export default Home;