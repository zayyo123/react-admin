/**
 * 学习提示：Zustand 状态模块：负责保存跨组件共享的数据，例如用户、菜单、主题和页签。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { TabPaneProps } from 'antd';
import type { NavData } from '@/menus/utils/helper';
import type { KeepAliveRef } from 'keepalive-for-react';
import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface TabsData extends Omit<TabPaneProps, 'tab'> {
  // 页签唯一 key，一般对应当前路由 path。
  key: string;
  // 当前语言下展示的页签标题。
  label: React.ReactNode;
  // 中文页签标题，切换语言时用于恢复中文展示。
  labelZh: React.ReactNode;
  // 英文页签标题，切换语言时用于恢复英文展示。
  labelEn: React.ReactNode;
  // 面包屑导航数据，顶部导航和页签切换会使用。
  nav: NavData[];
  urlParams?: string; // url参数
}

interface TabsGoNext {
  // 要关闭的页签 key。
  key: string;
  // 关闭当前页签后应该跳转到的下一个路由。
  nextPath: string;
  // keepalive-for-react 的缓存销毁方法。
  dropScope: KeepAliveRef['destroy'] | undefined;
}

interface TabsState {
  // 关闭页签时的导航锁，避免关闭过程中重复触发路由跳转。
  isCloseTabsLock: boolean;
  // 内容区是否最大化。
  isMaximize: boolean;
  // 当前激活页签 key。
  activeKey: string;
  // 当前页面面包屑数据。
  nav: NavData[];
  // 已打开的页签列表。
  tabs: TabsData[];
  toggleCloseTabsLock: (isCloseTabsLock: boolean) => void;
  toggleMaximize: (isMaximize: boolean) => void;
  setActiveKey: (key: string) => void;
  setNav: (nav: NavData[]) => void;
  switchTabsLang: (label: string) => void;
  addTabs: (payload: TabsData) => void;
  setTabs: (key: string, searchParams?: string) => void;
  sortTabs: (payload: TabsData[]) => void;
  closeTabs: (payload: string, dropScope: KeepAliveRef['destroy'] | undefined) => void;
  closeTabGoNext: (payload: TabsGoNext) => void;
  closeLeft: (payload: string, dropScope: KeepAliveRef['destroy'] | undefined) => void;
  closeRight: (payload: string, dropScope: KeepAliveRef['destroy'] | undefined) => void;
  closeOther: (payload: string, dropScope: KeepAliveRef['destroy'] | undefined) => void;
  closeAllTab: () => void;
}

export const useTabsStore = create<TabsState>()(
  devtools(
    persist(
      (set) => ({
        isCloseTabsLock: false,
        isMaximize: false,
        activeKey: '',
        nav: [],
        tabs: [],
        toggleCloseTabsLock: (isCloseTabsLock) => set({ isCloseTabsLock }),
        toggleMaximize: (isMaximize) => set({ isMaximize }),
        setActiveKey: (key) => set({ activeKey: key }),
        setNav: (nav) => set({ nav }),
        switchTabsLang: (label) =>
          set((state) => {
            const { tabs } = state;
            // 语言切换时不重新生成页签，只替换每个页签当前展示的 label。
            for (let i = 0; i < tabs?.length; i++) {
              const item = tabs[i];
              item.label = label === 'en' ? item.labelEn : item.labelZh;
            }
            return { tabs };
          }),
        addTabs: (payload) =>
          set((state) => {
            const { tabs } = state;
            // 已存在的路由不重复添加页签，只保持当前列表。
            const has = tabs.find((item) => item.key === payload.key);
            if (!has) tabs.push(payload);

            // 首页或唯一页签不允许关闭，避免关闭后后台内容区没有可跳转页面。
            if (tabs.length) tabs[0].closable = tabs.length > 1;

            return { tabs };
          }),
        setTabs: (key, searchParams) =>
          set((state) => {
            const { tabs } = state;
            // 搜索参数变化时，同步记录到页签上，切回该页签时可以恢复 URL 参数。
            const has = tabs.find((item) => item.key === key);
            if (has) {
              has.urlParams = searchParams;
            }
            return { tabs };
          }),
        sortTabs: (payload) => {
          set({ tabs: payload });
        },
        closeTabs: (payload, dropScope) =>
          set((state) => {
            const { tabs } = state;
            const index = tabs.findIndex((item) => item.key === payload);
            if (index >= 0) tabs.splice(index, 1);

            // 如果关闭的是当前激活页签，则优先激活右侧页签；没有右侧时激活左侧页签。
            if (payload === state.activeKey) {
              let target = '';
              if (index < tabs.length) {
                target = tabs?.[index]?.key || '';
              } else {
                target = tabs[index - 1]?.key || '';
              }
              set({ activeKey: target, isCloseTabsLock: true });
            }

            if (tabs.length) tabs[0].closable = tabs.length > 1;

            // 清除当前标签的keepalive缓存
            dropScope?.(payload);

            return { tabs };
          }),
        closeTabGoNext: (payload) =>
          set((state) => {
            const { tabs } = state;
            const { key, nextPath, dropScope } = payload;
            const index = tabs.findIndex((item) => item.key === key);
            if (index >= 0) tabs.splice(index, 1);

            if (key === state.activeKey) {
              set({ activeKey: nextPath, isCloseTabsLock: true });
            }

            if (tabs.length) tabs[0].closable = tabs.length > 1;

            // 清除非当前的keepalive缓存
            dropScope?.(key);

            return { tabs };
          }),
        closeLeft: (payload, dropScope) =>
          set((state) => {
            const { tabs, activeKey } = state;
            const index = tabs.findIndex((item) => item.key === payload);
            // 删除目标页签左侧的所有页签，保留目标页签及其右侧页签。
            if (index >= 0) tabs.splice(0, index);
            set({ activeKey: tabs[0]?.key || '' });

            // 如果当前标签不是要关闭的标签，就导航到要关闭的标签
            if (activeKey !== payload) {
              set({ isCloseTabsLock: true });
            }

            if (tabs.length) tabs[0].closable = tabs.length > 1;

            // 清除非当前的keepalive缓存
            for (let i = 0; i < tabs?.length; i++) {
              const item = tabs[i];
              if (item.key !== payload) {
                dropScope?.(item.key);
              }
            }

            return { tabs };
          }),
        closeRight: (payload, dropScope) =>
          set((state) => {
            const { tabs, activeKey } = state;

            // 先清除即将关闭页签对应的 KeepAlive 缓存，避免隐藏页面继续占用内存。
            for (let i = 0; i < tabs?.length; i++) {
              const item = tabs[i];
              if (item.key !== payload) {
                dropScope?.(item.key);
              }
            }

            const index = tabs.findIndex((item) => item.key === payload);
            // 删除目标页签右侧的所有页签。
            if (index >= 0) tabs.splice(index + 1, tabs.length - index - 1);
            set({ activeKey: tabs[tabs.length - 1]?.key || '' });

            // 如果当前标签不是要关闭的标签，就导航到要关闭的标签
            if (activeKey !== payload) {
              set({ isCloseTabsLock: true });
            }

            if (tabs.length) tabs[0].closable = tabs.length > 1;

            return { tabs };
          }),
        closeOther: (payload, dropScope) =>
          set((state) => {
            const { tabs, activeKey } = state;
            // 保留当前标签，关闭其他标签
            const filteredTabs: TabsData[] = [];

            for (let i = 0; i < tabs?.length; i++) {
              const item = tabs[i];

              // 如果当前标签不是要关闭的标签，就保留
              if (item.key === payload) {
                filteredTabs.push(item);
              } else {
                // 清除非当前的keepalive缓存
                dropScope?.(item.key);
              }
            }

            tabs.filter((item) => item.key === payload);

            // 如果当前标签不是要关闭的标签，就导航到要关闭的标签
            if (activeKey !== payload) {
              set({ isCloseTabsLock: true });
            }

            set({ tabs: filteredTabs, activeKey: payload });

            if (filteredTabs.length) filteredTabs[0].closable = filteredTabs.length > 1;

            return {
              tabs: filteredTabs,
              activeKey: payload,
            };
          }),
        closeAllTab: () => {
          // 退出登录或重置工作台时清空所有页签；缓存清理由调用方根据场景处理。
          set({ tabs: [], activeKey: '' });

          return {
            tabs: [],
            activeKey: '',
          };
        },
      }),
      {
        name: 'tabs_storage', // 存储中的项目名称，必须是唯一的
        storage: createJSONStorage(() => localStorage), // 使用sessionStorage作为存储
      },
    ),
    {
      enabled: process.env.NODE_ENV === 'development',
      name: 'tabsStore',
    },
  ),
);
