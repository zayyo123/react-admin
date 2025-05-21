import type { ApiPageSelectProps } from './types';
import type { DefaultOptionType } from 'antd/es/select';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { MAX_TAG_COUNT } from './index';
import Loading from './components/Loading';

/**
 * @description: 根据API获取数据下拉组件
 */
function ApiPageSelect(props: ApiPageSelectProps) {
  const {
    pageKey = 'page',
    pageSizeKey = 'pageSize',
    pageSize = 20,
  } = props;
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  // 清除自定义属性
  const params: Partial<ApiPageSelectProps> = { ...props };
  delete params.api;
  delete params.params;
  delete params.apiResultKey;
  delete params.pageKey;
  delete params.pageSizeKey;

  /** 获取接口数据 */
  const getApiData = useCallback(async () => {
    if (!props.api) return;
    try {
      const { api, params, apiResultKey } = props;

      if (typeof params === 'object' && !Array.isArray(params)) {
        params[pageKey] = 1;
        params[pageSizeKey] = pageSize;
      }

      setLoading(true);
      if (api) {
        const apiFun = Array.isArray(params) ? api(...params) : api(params);
        const { code, data } = await apiFun;
        if (Number(code) !== 200) return;
        const result = apiResultKey ? (data as { [apiResultKey: string]: unknown })?.[apiResultKey] : data;
        setOptions(result as DefaultOptionType[]);
      }
    } finally {
      setLoading(false);
    }
  }, [pageKey, pageSize, pageSizeKey, props]);

  useEffect(() => {
    // 当有值且列表为空时，自动获取接口
    if (props.value && options.length === 0) {
      getApiData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  /**
   * 展开下拉回调
   * @param open - 是否展开
   */
  const onDropdownVisibleChange = (open: boolean) => {
    if (open) getApiData();

    props.onDropdownVisibleChange?.(open);
  };

  return (
    <Select
      allowClear
      showSearch
      maxTagCount={MAX_TAG_COUNT}
      placeholder={t('public.inputPleaseSelect')}
      optionFilterProp={params?.fieldNames?.label || 'label'}
      {...params}
      loading={isLoading}
      options={options}
      notFoundContent={isLoading && <Loading />}
      onDropdownVisibleChange={onDropdownVisibleChange}
    />
  );
}

export default ApiPageSelect;
