# React 初学者学习指南

这份文档是给 React 初学者配套阅读本项目用的。你可以把它当成一张“读代码地图”：先知道每类文件在项目里负责什么，再去看源码里的中文注释，会更容易把 React、TypeScript、路由、状态管理、请求和后台 CRUD 串起来。

## 1. 推荐学习顺序

1. `package.json`：先看项目用了哪些技术和命令。
2. `src/main.tsx`：理解 React 应用是怎么挂载到页面上的。
3. `src/router/index.tsx`：理解全局 Provider、主题、语言、路由容器。
4. `src/router/components/Router.tsx`：理解页面文件如何自动变成路由。
5. `src/router/components/Guards.tsx`：理解登录态和路由守卫。
6. `src/layouts/index.tsx`：理解后台布局、菜单、页签、页面缓存。
7. `src/stores/*.ts`：理解 Zustand 全局状态。
8. `src/hooks/*.ts`：理解自定义 Hook 如何复用逻辑。
9. `src/components/Form/BaseForm.tsx`：学习配置化表单。
10. `src/components/Table/BaseTable.tsx`：学习配置化表格。
11. `src/pages/system/user/index.tsx`：学习一个完整 CRUD 页面。
12. `src/pages/system/user/model.tsx`：学习搜索项、表格列、表单项如何拆出去。
13. `src/servers/system/user.ts`：学习页面如何调用接口。

## 2. React 关键概念在本项目里的对应位置

### 组件

React 组件就是返回界面的函数。项目里大多数 `.tsx` 文件都是组件。

典型例子：

- `src/pages/dashboard/index.tsx`：页面组件。
- `src/components/Table/BaseTable.tsx`：公共表格组件。
- `src/layouts/components/Header.tsx`：布局里的头部组件。

阅读组件时重点看三件事：

- 接收哪些 `props`。
- 组件内部有哪些 `useState`、`useMemo`、`useEffect`。
- 最后 `return` 的 JSX 是什么结构。

### JSX

JSX 看起来像 HTML，但它其实是 JavaScript 表达式。

常见写法：

```tsx
{isLoading && <Skeleton />}
{list.map((item) => <div key={item.id}>{item.name}</div>)}
<BaseTable columns={columns} dataSource={data} />
```

你可以把 JSX 理解成“用 JavaScript 写页面结构”。

### Props

父组件传给子组件的数据叫 props。

例如页面把表格列传给 `BaseTable`：

```tsx
<BaseTable columns={tableColumns} dataSource={dataSource} />
```

`BaseTable` 通过 `props.columns` 拿到这些列配置。

### State

组件自己的状态用 `useState`，多个页面共享的状态用 Zustand。

常见判断：

- 只在一个组件里用：`useState`。
- 菜单、用户、主题、页签多个地方都要用：Zustand store。

### useEffect

`useEffect` 用来处理副作用，比如请求接口、监听窗口变化、同步表单数据。

本项目常见场景：

- 页面初始化请求列表。
- 路由变化时更新页签。
- 窗口尺寸变化时切换移动端布局。

### useMemo

`useMemo` 用来缓存计算结果，避免每次渲染都重复计算。

本项目常见场景：

- 表格列合并。
- 主题配置。
- 路由配置。
- className 字符串。

### useCallback

`useCallback` 用来缓存函数引用，适合传给子组件或放到依赖数组里。

本项目常见场景：

- 获取用户信息。
- 获取菜单。
- 处理窗口 resize。
- 表格列拖拽。

### 自定义 Hook

自定义 Hook 是以 `use` 开头的函数，用来复用逻辑。

本项目例子：

- `useToken`：统一读写 token。
- `useCommonStore`：统一读取多个 Zustand store 的常用字段。
- `useSearchUrlParams`：把搜索条件同步到 URL。
- `useFullscreen`：封装浏览器全屏 API。

## 3. 后台页面的常见数据流

一个列表页通常是这样的流程：

```text
页面加载
  -> useState 准备搜索参数、分页、列表数据
  -> 调用 src/servers 里的接口
  -> 接口返回后 setState 更新页面
  -> BaseSearch 渲染搜索表单
  -> BaseTable 渲染表格
  -> BasePagination 渲染分页
  -> BaseModal + BaseForm 渲染新增/编辑弹窗
```

建议重点阅读：

- `src/pages/system/user/index.tsx`
- `src/pages/system/user/model.tsx`
- `src/servers/system/user.ts`

这三个文件配合起来，就是后台 CRUD 的标准写法。

## 4. 为什么项目喜欢“配置化”

你会看到很多页面不是手写一堆 `<Form.Item>` 和 `<Table.Column>`，而是在 `model.tsx` 里写配置。

好处：

- 页面主流程更清楚。
- 表单、搜索、表格样式统一。
- 新增字段时只改配置。
- 多个页面可以复用同一套公共组件。

学习时可以这样看：

- `model.tsx` 是“页面说明书”。
- `index.tsx` 是“页面执行流程”。
- `components` 是“页面局部复杂组件”。

## 5. 初学者最容易混淆的几个点

### `src/servers` 不是后端

`src/servers` 只是前端接口请求方法的封装，真正的后端接口在服务器上。

### `src/stores` 不是数据库

Zustand store 是浏览器内存里的全局状态。刷新页面后，未持久化的数据会丢失。

### `useMemo` 不是必须到处用

简单计算不用急着 `useMemo`。本项目在表格列、路由配置、布局 className 这些相对高频或复杂的地方使用它。

### 自动导入不是魔法

项目通过 `build/plugins/autoImport.ts` 自动导入一些 hooks、组件和类型。它能少写 import，但也会生成 `types/autoImports.d.ts`。如果类型找不到，先检查这个文件是否生成或更新。

### `model.tsx` 不是 React 状态模型

这里的 `model.tsx` 更多是页面配置文件，通常放搜索项、表格列、表单项、权限码等。

## 6. 如何带着问题读源码

读代码时不要一上来逐行钻。建议每次只问一个问题：

- 这个页面的数据从哪里来？
- 点击新增按钮后状态怎么变化？
- 表单提交前数据在哪里被处理？
- 菜单是后端返回的还是前端写死的？
- 登录失效后在哪里跳转？
- 页签关闭后为什么页面缓存也会清掉？

带着这些问题去读代码，比机械看每一行更快。

## 7. 适合反复练习的小任务

1. 给用户列表新增一个搜索字段。
2. 给角色列表新增一个表格列。
3. 给菜单页面新增一个表单项。
4. 新增一个静态演示页面。
5. 新增一个接口方法并在页面调用。
6. 用 `checkPermission` 控制一个按钮显示。
7. 用 `useState` 控制一个弹窗打开和关闭。
8. 用 `useEffect` 在页面进入时请求数据。

这些任务都不大，但能把 React 后台开发最常见的动作练熟。

## 8. 哪些文件不适合写代码注释

本项目里有些文件不能或不建议加注释：

- `package.json`、`tsconfig.json`、`.commitlintrc.json`：JSON 标准不支持注释。
- `pnpm-lock.yaml`：依赖锁文件是工具生成的，不应手改。
- `types/autoImports.d.ts`：自动导入插件生成的声明文件，构建时可能被覆盖。
- 图片、字体、SVG、构建产物：它们不是源码逻辑。
- 纯文案语言包：字段本身已经是文案，过多注释会影响维护。

这些文件的作用会在项目讲解文档和本学习指南里说明，源码里主要给可维护的业务逻辑加注释。

