import { useState, useEffect, useCallback, useRef } from "react";
import notificationApi from "../services/notificationApi";
import { useAuth } from "../contexts/auth";

/**
 * 通知管理Hook
 * 提供通知列表、未读数量、标记已读等功能
 */
export const useNotifications = (options = {}) => {
  const {
    autoLoad = true,
    type = null,
    unreadOnly = false,
    pageSize = 10,
  } = options;

  const { isAuthenticated } = useAuth();

  // 状态管理
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: pageSize,
    totalCount: 0,
  });
  const [stats, setStats] = useState(null);

  // 使用ref来跟踪当前页码，避免ESLint依赖项问题
  const currentPageRef = useRef(1);

  /**
   * 加载通知列表
   * @param {Object} params - 查询参数
   */
  const loadNotifications = useCallback(
    async (params = {}) => {
      if (!isAuthenticated) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        setPagination((currentPagination) => {
          const queryParams = {
            page: currentPagination.current,
            limit: pageSize,
            ...params,
          };

          if (type) {
            queryParams.type = type;
          }

          if (unreadOnly && isAuthenticated) {
            queryParams.unreadOnly = true;
          }

          // 异步执行 API 调用
          notificationApi
            .getNotifications(queryParams)
            .then((response) => {
              if (response.success) {
                setNotifications(response.data.notifications || []);
                const newPagination =
                  response.data.pagination || currentPagination;
                setPagination(newPagination);
                currentPageRef.current = newPagination.current;

                // 如果是获取未读通知，使用分页数据中的totalCount作为未读数量
                if (
                  queryParams.unreadOnly &&
                  newPagination.totalCount !== undefined
                ) {
                  setUnreadCount(newPagination.totalCount);
                }
              }
              setLoading(false);
            })
            .catch((err) => {
              setError(err.message);
              console.error("加载通知失败:", err);
              setLoading(false);
            });

          return currentPagination;
        });
      } catch (err) {
        setError(err.message);
        console.error("加载通知失败:", err);
        setLoading(false);
      }
    },
    [pageSize, type, unreadOnly, isAuthenticated]
  );

  /**
   * 加载未读通知数量
   */
  const loadUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await notificationApi.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (err) {
      console.error("获取未读数量失败:", err);
    }
  }, [isAuthenticated]);

  /**
   * 加载通知统计信息
   */
  const loadStats = useCallback(async () => {
    if (!isAuthenticated) {
      setStats(null);
      return;
    }

    try {
      const response = await notificationApi.getNotificationStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("获取通知统计失败:", err);
    }
  }, [isAuthenticated]);

  /**
   * 标记单个通知为已读
   * @param {string} notificationId - 通知ID
   */
  const markAsRead = useCallback(
    async (notificationId) => {
      if (!isAuthenticated) {
        throw new Error("请先登录");
      }

      try {
        const response = await notificationApi.markAsRead(notificationId);

        if (response.success) {
          // 更新本地状态，使用API返回的实际数据
          setNotifications((prev) =>
            prev.map((notification) => {
              if (notification._id === notificationId && !notification.isRead) {
                return {
                  ...notification,
                  isRead: response.data.isRead,
                  readAt: response.data.readAt,
                };
              }
              return notification;
            })
          );

          // 重新获取准确的未读数量
          loadNotifications({ unreadOnly: true, page: 1 });

          return response;
        }
      } catch (err) {
        console.error("标记已读失败:", err);
        throw err;
      }
    },
    [isAuthenticated, loadNotifications]
  );

  /**
   * 批量标记通知为已读
   * @param {string[]} notificationIds - 通知ID数组
   */
  const markMultipleAsRead = useCallback(
    async (notificationIds) => {
      if (!isAuthenticated) {
        throw new Error("请先登录");
      }

      try {
        const response = await notificationApi.markMultipleAsRead(
          notificationIds
        );

        if (response.success) {
          // 更新本地状态
          setNotifications((prev) =>
            prev.map((notification) => {
              if (
                notificationIds.includes(notification._id) &&
                !notification.isRead
              ) {
                return {
                  ...notification,
                  isRead: true,
                  readAt: new Date().toISOString(),
                };
              }
              return notification;
            })
          );

          // 重新获取准确的未读数量
          loadNotifications({ unreadOnly: true, page: 1 });

          return response;
        }
      } catch (err) {
        console.error("批量标记已读失败:", err);
        throw err;
      }
    },
    [isAuthenticated, loadNotifications]
  );

  /**
   * 标记所有通知为已读
   */
  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter(
      (n) => !n.isRead && !n.isPermanent
    );
    if (unreadNotifications.length === 0) {
      return;
    }

    const notificationIds = unreadNotifications.map((n) => n._id);
    return await markMultipleAsRead(notificationIds);
  }, [notifications, markMultipleAsRead]);

  /**
   * 刷新所有数据
   */
  const refresh = useCallback(async () => {
    await Promise.all([loadNotifications(), loadUnreadCount(), loadStats()]);
  }, [loadNotifications, loadUnreadCount, loadStats]);

  /**
   * 切换页码
   * @param {number} page - 页码
   */
  const changePage = useCallback((page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  }, []);

  /**
   * 根据类型筛选通知
   * @param {string} filterType - 通知类型
   */
  const filterByType = useCallback(
    async (filterType) => {
      await loadNotifications({ type: filterType, page: 1 });
    },
    [loadNotifications]
  );

  /**
   * 切换仅显示未读
   * @param {boolean} showUnreadOnly - 是否仅显示未读
   */
  const toggleUnreadOnly = useCallback(
    async (showUnreadOnly) => {
      await loadNotifications({ unreadOnly: showUnreadOnly, page: 1 });
    },
    [loadNotifications]
  );

  // 初始化加载 - 加载通知列表和未读数量
  useEffect(() => {
    if (autoLoad && isAuthenticated) {
      loadNotifications();
      // 额外获取未读数量
      loadNotifications({ unreadOnly: true, page: 1 });
    }
  }, [autoLoad, isAuthenticated, loadNotifications]);

  // 页码变化时重新加载
  useEffect(() => {
    if (autoLoad && isAuthenticated && currentPageRef.current > 1) {
      loadNotifications();
    }
  }, [autoLoad, isAuthenticated, loadNotifications]);

  // 同步pagination.current到ref
  useEffect(() => {
    currentPageRef.current = pagination.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current]);

  // 注释：已移除定时轮询机制，改为手动刷新模式
  // 如需启用轮询，可在调用 useNotifications 时传入 pollInterval 参数

  return {
    // 数据状态
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    stats,

    // 操作方法
    loadNotifications,
    loadUnreadCount,
    loadStats,
    markAsRead,
    markMultipleAsRead,
    markAllAsRead,
    refresh,
    changePage,
    filterByType,
    toggleUnreadOnly,

    // 工具方法
    getTypeLabel: notificationApi.getTypeLabel,
    getPriorityLabel: notificationApi.getPriorityLabel,
    formatTime: notificationApi.formatTime,
    isNotificationValid: notificationApi.isNotificationValid,
    getNotificationClass: notificationApi.getNotificationClass,
  };
};

/**
 * 简化版通知Hook，仅获取未读数量
 */
export const useUnreadCount = (pollInterval = null) => {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await notificationApi.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (err) {
      console.error("获取未读数量失败:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  useEffect(() => {
    if (!isAuthenticated || !pollInterval) {
      return;
    }

    const interval = setInterval(loadUnreadCount, pollInterval);
    return () => clearInterval(interval);
  }, [isAuthenticated, pollInterval, loadUnreadCount]);

  return {
    unreadCount,
    loading,
    refresh: loadUnreadCount,
  };
};

export default useNotifications;
