/**
 * 学习提示：后台布局模块：负责菜单、顶部栏、页签、内容区、页面缓存和响应式布局。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { BreadcrumbProps } from 'antd';
import type { NavData } from '@/menus/utils/helper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCommonStore } from '@/hooks/useCommonStore';

interface Props {
  className?: string;
  list: NavData[];
}

function Nav(props: Props) {
  const { className, list } = props;
  const { i18n } = useTranslation();
  // 是否手机端
  const { isPhone } = useCommonStore();
  const [nav, setNav] = useState<BreadcrumbProps['items']>([]);

  // 数据处理
  const handleList = useCallback(
    (list: NavData[]) => {
      const result: BreadcrumbProps['items'] = [];
      if (!list?.length) return [];
      // 获取当前语言
      const currentLanguage = i18n.language;

      for (let i = 0; i < list?.length; i++) {
        const item = list?.[i];
        const data = currentLanguage === 'en' ? item.labelEn : item.labelZh;
        result.push({
          title: data || '',
        });
      }

      return result;
    },
    [i18n.language],
  );

  useEffect(() => {
    setNav(handleList(list));
  }, [handleList, list]);

  return useMemo(
    () => (
      <>
        {!isPhone && (
          <div className={`${className} flex items-center text-truncate ellipsis break-all`}>
            {nav?.map((item, index) => (
              <span key={index}>
                {index !== 0 && (
                  <span className="px-4px color-#000073 breadcrumb-separator">/</span>
                )}
                <span
                  className={`px-4px ${index !== nav.length - 1 ? 'breadcrumb-separator' : ''}`}
                >
                  {item.title}
                </span>
              </span>
            ))}
          </div>
        )}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nav],
  );
}

export default Nav;
