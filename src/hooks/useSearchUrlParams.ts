/**
 * 学习提示：自定义 Hook 模块：把组件中可复用的状态逻辑和浏览器能力封装成 useXxx 函数。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
/**
 * 将搜索参数同步到 URL。
 * 典型用途：列表页搜索后，地址栏也带上搜索条件；刷新页面或分享链接时能恢复搜索表单。
 */
import { type FormInstance } from 'antd';
import { getUrlAllParam } from '@/utils/helper';

export const useSearchUrlParams = (form: FormInstance) => {
  // setSearchParams 来自 react-router，用来修改当前地址栏 query 参数。
  const [, setSearchParams] = useSearchParams();
  const { pathname, search } = useLocation();
  const { setTabs } = useTabsStore((state) => state);

  /** URL 参数带入搜索表单中 */
  const handleSetSearchForm = useCallback(() => {
    // 把 ?username=xxx&phone=xxx 转成对象，再写入 Antd Form。
    const urlParams = getUrlAllParam(search);
    form?.setFieldsValue({
      ...form?.getFieldsValue(),
      ...urlParams,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 页面首次加载时执行一次，让搜索框和 URL 保持一致。
    handleSetSearchForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 将搜索参数写入 URL 和页签缓存 */
  const handleSetSearchParams = (searchParams: BaseFormData) => {
    // 去除值为 undefined 的属性，避免 URL 出现 a=undefined 这种无意义参数。
    const filteredValues = Object.fromEntries(
      Object.entries(searchParams).filter(([, value]) => value !== undefined),
    ) as Record<string, string>;

    // 将对象转换为 URL 参数字符串，同时存入 tabs，切换页签回来时可以恢复。
    let urlParams = new URLSearchParams(filteredValues).toString();
    if (urlParams?.length) {
      urlParams = `?${urlParams}`;
    }

    setSearchParams(filteredValues);
    setTabs(pathname, urlParams);
  };

  return [handleSetSearchParams];
};
