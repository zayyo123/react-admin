/**
 * stores/index.ts
 *
 * 这个文件是状态管理的统一导出入口，集中导出所有的状态存储钩子。
 * 使用这种集中导出的方式有以下好处：
 * 1. 简化导入语句，避免在组件中导入多个状态存储
 * 2. 提供一个统一的状态管理API入口
 * 3. 便于后续扩展和维护
 */

// 导入标签页状态管理钩子
// 用于管理应用中的多标签页功能，包括标签的添加、删除、切换等
import { useTabsStore } from "@/stores/tabs";

// 导入用户状态管理钩子
// 用于管理用户信息和权限
import { useUserStore } from "@/stores/user";

// 导入公共状态管理钩子
// 用于管理应用的公共状态，如主题设置、语言设置等
import { usePublicStore } from "./public";

// 导入菜单状态管理钩子
// 用于管理应用的菜单状态，如菜单列表、折叠状态等
import { useMenuStore } from "./menu";

// 统一导出所有状态管理钩子
// 这样在组件中可以通过 import { useXxxStore } from '@/stores' 的方式导入
export {
  useTabsStore, // 标签页状态
  useUserStore, // 用户状态
  usePublicStore, // 公共状态
  useMenuStore, // 菜单状态
};
