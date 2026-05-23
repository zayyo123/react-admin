/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirstMenu } from '@/menus/utils/helper';
import { useCommonStore } from '@/hooks/useCommonStore';

function Page() {
  const { permissions, menuList } = useCommonStore();
  const navigate = useNavigate();

  /** 跳转第一个有效菜单路径 */
  const goFirstMenu = useCallback(() => {
    const firstMenu = getFirstMenu(menuList, permissions);
    navigate(firstMenu);
  }, [menuList, navigate, permissions]);

  useEffect(() => {
    // 跳转第一个有效菜单路径
    goFirstMenu();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuList, permissions]);

  return <div></div>;
}

export default Page;
