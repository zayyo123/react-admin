/**
 * stores/user.ts
 *
 * 这个文件定义了应用的用户状态管理，使用Zustand库实现。
 * 主要功能包括：
 * 1. 存储用户基本信息（ID、用户名、邮箱、电话）
 * 2. 存储用户权限列表
 * 3. 提供修改和清除用户信息的方法
 */

// 导入Zustand的核心create函数，用于创建状态存储
import { create } from "zustand";
// 导入Zustand开发工具中间件，用于调试
import { devtools } from "zustand/middleware";

/**
 * 用户信息接口
 * 定义了用户基本信息的数据结构
 */
interface UserInfo {
  id: number; // 用户ID，唯一标识
  username: string; // 用户名
  email: string; // 电子邮箱
  phone: string; // 电话号码
}

/**
 * 用户状态接口
 * 定义了用户状态存储的所有状态和操作方法
 */
interface UserState {
  // 状态
  permissions: string[]; // 用户权限列表，存储权限标识符
  userInfo: UserInfo; // 用户基本信息

  // 操作方法
  setPermissions: (permissions: string[]) => void; // 设置用户权限
  setUserInfo: (userInfo: UserInfo) => void; // 设置用户信息
  clearInfo: () => void; // 清除用户信息（通常用于登出）
}

/**
 * 创建用户状态存储
 * 使用Zustand的create函数创建状态管理器
 * 应用了devtools中间件，实现调试功能
 */
export const useUserStore = create<UserState>()(
  // 开发工具中间件，用于在Redux DevTools中调试状态
  devtools(
    // 状态定义函数，接收set函数用于更新状态
    (set) => ({
      // 初始状态
      permissions: [], // 初始权限列表为空
      userInfo: {
        // 初始用户信息为空值
        id: 0, // 初始ID为0，表示未登录
        username: "", // 初始用户名为空
        email: "", // 初始邮箱为空
        phone: "", // 初始电话为空
      },

      /**
       * 设置用户权限
       * 更新权限列表状态
       * @param permissions - 新的权限列表数组
       */
      setPermissions: (permissions) => set({ permissions }),

      /**
       * 设置用户信息
       * 更新用户基本信息状态
       * @param userInfo - 新的用户信息对象
       */
      setUserInfo: (userInfo) => set({ userInfo }),

      /**
       * 清除用户信息
       * 重置用户信息为初始状态，通常在用户登出时调用
       * 注意：此方法只清除userInfo，不清除permissions
       */
      clearInfo: () =>
        set({
          userInfo: { id: 0, username: "", email: "", phone: "" },
        }),
    }),
    {
      // 开发工具配置
      enabled: process.env.NODE_ENV === "development", // 仅在开发环境启用
      name: "userStore", // 在开发工具中显示的名称
    }
  )
);
