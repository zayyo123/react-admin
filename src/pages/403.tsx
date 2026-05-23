/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { getFirstMenu, getMenuByKey } from '@/menus/utils/helper';
import { Button } from 'antd';
import styles from './all.module.less';

function Forbidden() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { permissions, menuList } = useCommonStore();
  const { addTabs, setActiveKey } = useTabsStore();

  /** 跳转首页 */
  const goIndex = () => {
    const firstMenu = getFirstMenu(menuList, permissions);
    navigate(firstMenu);
    const menuByKeyProps = { menus: menuList, permissions, key: firstMenu };
    const newItems = getMenuByKey(menuByKeyProps);
    if (newItems?.key) {
      setActiveKey(newItems.key);
      addTabs(newItems);
    }
  };

  return (
    <div className="text-center">
      <h1 className={`${styles.animation} w-full text-6rem font-bold`}>403</h1>
      <p className="w-full text-20px font-bold mt-15px">{t('public.notPermissionMessage')}</p>
      <Button className="mt-25px margin-auto" onClick={goIndex}>
        {t('public.returnHome')}
      </Button>
    </div>
  );
}

export default Forbidden;
