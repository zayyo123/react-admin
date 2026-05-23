/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
// 接口传入数据
export interface LoginData {
  username: string;
  password: string;
}

// 用户数据
interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  roles: number[];
}

// 用户权限数据
interface Roles {
  id: string;
}

// 接口返回数据
export interface LoginResult {
  token: string;
  user: User;
  permissions: string[];
  roles: Roles[];
}
