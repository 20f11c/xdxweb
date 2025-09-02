import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/Home.css';

const AdminHome = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalOrders: 0,
        revenue: 0
    });

    useEffect(() => {
        // 模拟获取统计数据
        // TODO: 替换为实际的API调用
        setStats({
            totalUsers: 1234,
            activeUsers: 856,
            totalOrders: 2468,
            revenue: 125680
        });
    }, []);

    const handleLogout = () => {
        // TODO: 实现管理员登出逻辑
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="admin-home">
            <header className="admin-header">
                <div className="header-content">
                    <h1 className="admin-title">
                        <i className="admin-icon">⚙️</i>
                        管理后台
                    </h1>
                    <div className="header-actions">
                        <span className="admin-welcome">欢迎，管理员</span>
                        <button className="logout-btn" onClick={handleLogout}>
                            <i className="logout-icon">🚪</i>
                            退出登录
                        </button>
                    </div>
                </div>
            </header>

            <main className="admin-main">
                <div className="dashboard-grid">
                    <div className="stat-card">
                        <div className="stat-icon users-icon">👥</div>
                        <div className="stat-content">
                            <h3 className="stat-title">总用户数</h3>
                            <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon active-icon">🟢</div>
                        <div className="stat-content">
                            <h3 className="stat-title">活跃用户</h3>
                            <p className="stat-number">{stats.activeUsers.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon orders-icon">📦</div>
                        <div className="stat-content">
                            <h3 className="stat-title">总订单数</h3>
                            <p className="stat-number">{stats.totalOrders.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon revenue-icon">💰</div>
                        <div className="stat-content">
                            <h3 className="stat-title">总收入</h3>
                            <p className="stat-number">¥{stats.revenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="quick-actions">
                    <h2 className="section-title">快速操作</h2>
                    <div className="actions-grid">
                        <button className="action-btn">
                            <i className="action-icon">👤</i>
                            <span>用户管理</span>
                        </button>
                        <button className="action-btn">
                            <i className="action-icon">📊</i>
                            <span>数据统计</span>
                        </button>
                        <button className="action-btn">
                            <i className="action-icon">⚙️</i>
                            <span>系统设置</span>
                        </button>
                        <button className="action-btn">
                            <i className="action-icon">📝</i>
                            <span>内容管理</span>
                        </button>
                    </div>
                </div>

                <div className="recent-activity">
                    <h2 className="section-title">最近活动</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon">👤</div>
                            <div className="activity-content">
                                <p className="activity-text">新用户注册：张三</p>
                                <span className="activity-time">2分钟前</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">📦</div>
                            <div className="activity-content">
                                <p className="activity-text">新订单：#12345</p>
                                <span className="activity-time">5分钟前</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">💰</div>
                            <div className="activity-content">
                                <p className="activity-text">收入更新：+¥1,280</p>
                                <span className="activity-time">10分钟前</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminHome;