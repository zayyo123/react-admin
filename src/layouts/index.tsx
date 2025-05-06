/**
 * layouts/index.tsx
 *
 * 这个文件定义了应用的主布局组件，负责整体页面结构和布局管理。
 * 主要功能包括：
 * 1. 用户认证和权限管理
 * 2. 响应式布局（支持桌面端和移动端）
 * 3. 菜单和内容区域的管理
 * 4. 页面缓存和状态保持
 * 5. 版本检查和更新提示
 */

// 导入自定义Token管理Hook
import { useToken } from "@/hooks/useToken";
// 导入React核心Hooks
import { useCallback, useEffect, useState } from "react";
// 导入路由相关Hook，useOutlet用于渲染嵌套路由内容
import { useOutlet } from "react-router-dom";
// 导入Ant Design组件
import { Skeleton, message } from "antd";
// 导入图标组件
import { Icon } from "@iconify/react";
// 导入lodash的防抖函数，用于优化窗口大小变化的处理
import { debounce } from "lodash";
// 导入路由位置Hook，用于获取当前路径信息
import { useLocation } from "react-router-dom";
// 导入版本检查工具函数
import { versionCheck } from "./utils/helper";
// 导入获取菜单列表的API函数
import { getMenuList } from "@/servers/system/menu";
// 导入全局状态管理Hooks
import { useMenuStore, useUserStore } from "@/stores";
// 导入获取用户权限的API函数
import { getPermissions } from "@/servers/permissions";
// 导入通用状态管理Hook
import { useCommonStore } from "@/hooks/useCommonStore";
// 导入页面缓存组件，用于保持页面状态
import KeepAlive from "react-activation";
// 导入布局相关子组件
import Menu from "./components/Menu";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
// 导入403禁止访问页面
import Forbidden from "@/pages/403";
// 导入CSS模块样式
import styles from "./index.module.less";

/**
 * Layout组件 - 应用的主布局结构
 * 负责管理整体页面结构、响应式布局、权限控制和内容渲染
 */
function Layout() {
  // 从useToken Hook中获取getToken函数
  const [getToken] = useToken();
  // 获取当前路由的路径和查询参数
  const { pathname, search } = useLocation();
  // 组合完整URI，用于页面缓存的唯一标识
  const uri = pathname + search;
  // 获取当前用户的认证令牌
  const token = getToken();
  // 获取嵌套路由的内容
  const outlet = useOutlet();
  // 加载状态管理
  const [isLoading, setLoading] = useState(true);
  // 内容可见性状态，用于内容切换动画
  const [isContentVisible, setContentVisible] = useState(true);
  // 获取消息提示API和上下文持有者
  const [messageApi, contextHolder] = message.useMessage();
  // 从用户状态存储中获取设置权限和用户信息的函数
  const { setPermissions, setUserInfo } = useUserStore((state) => state);
  // 从菜单状态存储中获取设置菜单列表和切换状态的函数
  const { setMenuList, toggleCollapsed, togglePhone } = useMenuStore(
    (state) => state
  );

  // 从通用状态存储中获取多个状态值
  const {
    permissions, // 用户权限列表
    userId, // 用户ID
    isMaximize, // 是否最大化内容区域
    isCollapsed, // 是否折叠菜单
    isPhone, // 是否为手机视图
    isRefresh, // 是否正在刷新
  } = useCommonStore();

  /**
   * 获取用户信息和权限
   * 使用useCallback缓存函数，避免不必要的重新创建
   */
  const getUserInfo = useCallback(async () => {
    try {
      // 开始加载，显示加载状态
      setLoading(true);
      // 调用API获取权限数据，不刷新缓存
      const { code, data } = await getPermissions({ refresh_cache: false });
      // 检查API返回状态码，非200则直接返回
      if (Number(code) !== 200) return;
      // 解构获取用户信息和权限列表
      const { user, permissions } = data;
      // 更新全局用户信息
      setUserInfo(user);
      // 更新全局权限列表
      setPermissions(permissions);
    } catch (err) {
      // 捕获并记录错误
      console.error("获取用户数据失败:", err);
      // 出错时设置空权限列表
      setPermissions([]);
    } finally {
      // 无论成功失败，最终都结束加载状态
      setLoading(false);
    }
  }, []);

  /**
   * 获取菜单数据
   * 使用useCallback缓存函数，避免不必要的重新创建
   */
  const getMenuData = useCallback(async () => {
    try {
      // 开始加载，显示加载状态
      setLoading(true);
      // 调用API获取菜单列表
      const { code, data } = await getMenuList();
      // 检查API返回状态码，非200则直接返回
      if (Number(code) !== 200) return;
      // 更新全局菜单列表，如果data为空则使用空数组
      setMenuList(data || []);
    } finally {
      // 无论成功失败，最终都结束加载状态
      setLoading(false);
    }
  }, []);

  /**
   * 初始化数据加载
   * 当有token但没有用户ID时，获取用户信息和菜单数据
   */
  useEffect(() => {
    // 当用户信息缓存不存在时则重新获取
    if (token && !userId) {
      getUserInfo();
      getMenuData();
    }
  }, [getUserInfo, getMenuData, token, userId]);

  /**
   * 版本检查
   * 当路径变化时，检查应用版本是否需要更新
   */
  useEffect(() => {
    // 调用版本检查函数，传入消息API用于显示提示
    versionCheck(messageApi);
  }, [pathname]);

  /**
   * 判断是否是手机端
   * 使用debounce防抖优化，避免频繁触发
   */
  const handleIsPhone = debounce(() => {
    // 根据窗口宽度判断是否为手机视图（小于等于768px）
    const isPhone = window.innerWidth <= 768;
    // 手机视图下自动折叠菜单
    if (isPhone) toggleCollapsed(true);
    // 更新全局手机视图状态
    togglePhone(isPhone);
  }, 500); // 500ms防抖延迟

  /**
   * 监听窗口大小变化，响应式调整布局
   * 组件挂载时添加监听，卸载时移除监听
   */
  useEffect(() => {
    // 初始检查设备类型
    handleIsPhone();
    // 添加窗口大小变化事件监听
    window.addEventListener("resize", handleIsPhone);

    // 返回清理函数，组件卸载时移除事件监听
    return () => {
      window.removeEventListener("resize", handleIsPhone);
    };
  }, []);

  /**
   * 更新内容可视状态
   * 用于控制内容区域的显示/隐藏动画
   * @param state - 是否可见
   */
  const handleChangeContentVisible = (state: boolean) => {
    setContentVisible(state);
  };

  // 渲染布局结构
  return (
    <div id="layout">
      {/* 消息提示上下文，用于显示全局消息 */}
      {contextHolder}

      {/* 左侧菜单组件，传入内容可见性控制函数 */}
      <Menu changeContentVisible={handleChangeContentVisible} />

      {/* 右侧内容区域容器 */}
      <div className={styles.layout_right}>
        {/* 顶部区域：包含头部和标签页 */}
        <div
          id="header"
          className={`
            border-bottom
            transition-all
            ${styles.header}
            ${
              isCollapsed ? styles["header-close-menu"] : ""
            }  /* 菜单折叠时的样式 */
            ${
              isMaximize ? styles["header-none"] : ""
            }         /* 最大化时的样式 */
            ${
              isPhone ? `!left-0 z-999` : ""
            }                  /* 手机视图时的样式 */
          `}
        >
          {/* 头部组件：包含logo、面包屑、用户信息等 */}
          <Header />
          {/* 标签页组件：显示已打开的页面标签 */}
          <Tabs />
        </div>

        {/* 主内容区域 */}
        <div
          id="layout-content"
          className={`
            overflow-auto
            transition-all
            ${styles.con}
            ${
              isMaximize ? styles["con-maximize"] : ""
            }        /* 最大化时的样式 */
            ${
              isCollapsed ? styles["con-close-menu"] : ""
            }     /* 菜单折叠时的样式 */
            ${
              isPhone ? `!left-0 !w-full` : ""
            }                /* 手机视图时的样式 */
          `}
        >
          {/* 加载中且无权限时显示骨架屏 */}
          {isLoading && permissions.length === 0 && (
            <Skeleton active className="p-30px" paragraph={{ rows: 10 }} />
          )}

          {/* 加载完成但无权限时显示403禁止访问页面 */}
          {!isLoading && permissions.length === 0 && <Forbidden />}

          {/* 刷新状态时显示加载图标 */}
          {isRefresh && (
            <div
              className={`
              absolute
              left-50%
              top-50%
              -rotate-x-50%
              -rotate-y-50%
            `}
            >
              <Icon
                className="text-40px animate-spin"
                icon="ri:loader-2-fill"
              />
            </div>
          )}

          {/* 有权限时渲染实际内容，使用KeepAlive保持页面状态 */}
          {permissions.length > 0 && (
            <KeepAlive id={uri} name={uri}>
              {/* 切换目录时，生成动态下拉隐藏的动画效果 */}
              <div
                className={`
                  content-transition
                  ${isContentVisible ? "content-visible" : "content-hidden"}
                `}
              >
                {/* 渲染嵌套路由内容 */}
                {outlet}
              </div>
            </KeepAlive>
          )}

          {/*
            在非生产/测试环境下，当内容不可见时显示骨架屏
            用于内容切换的过渡动画
          */}
          {permissions.length > 0 &&
            !isContentVisible &&
            !["production", "test"].includes(String(process.env.NODE_ENV)) && (
              <Skeleton
                active
                className={`
                p-30px
                absolute
                content-transition
                z-0
                top-0
                content-visible
              `}
                paragraph={{ rows: 10 }}
              />
            )}
        </div>
      </div>
    </div>
  );
}

export default Layout;
