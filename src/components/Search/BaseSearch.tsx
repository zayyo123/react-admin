/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { ColProps, FormInstance } from 'antd';
import type { BaseFormData, BaseSearchList } from '#/form';
import { type CSSProperties, type ReactNode, type Ref, useEffect, useState, useMemo } from 'react';
import { type FormProps, Button, Col, Flex } from 'antd';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { filterDayjs } from '@/components/Dates';
import { useCommonStore } from '@/hooks/useCommonStore';
import { getComponent } from '@/components/Form/utils/componentMap';
import { SearchOutlined, ReloadOutlined, DownOutlined } from '@ant-design/icons';
import {
  filterEmptyStr,
  filterFormItem,
  handleValuePropName,
} from '@/components/Form/utils/helper';

interface Props extends FormProps {
  list: BaseSearchList[];
  data: BaseFormData;
  isLoading?: boolean;
  isSearch?: boolean;
  isReset?: boolean;
  style?: CSSProperties;
  className?: string;
  type?: 'default' | 'grid';
  ref?: Ref<FormInstance>;
  searchForm?: FormInstance;
  children?: ReactNode;
  labelCol?: Partial<ColProps>;
  wrapperCol?: Partial<ColProps>;
  isRowExpand?: boolean; // 是否显示收缩搜索功能
  defaultColCount?: number; // 默认每项占位几个，默认一行四个
  defaultRowExpand?: number; // 默认展示多少行
  handleFinish: FormProps['onFinish'];
}

/**
 * 通用搜索表单组件。
 * 它和 BaseForm 的思路一致：页面传入 list 配置，组件负责渲染搜索项、提交、重置、
 * 栅格布局和展开/收起。初学者可以重点观察 list 如何变成 JSX。
 */
const BaseSearch = (props: Props) => {
  const {
    ref,
    list,
    data,
    initialValues,
    searchForm,
    isLoading,
    isSearch = true,
    isReset = true,
    isRowExpand = true,
    type = 'default',
    style,
    className,
    children,
    labelCol,
    wrapperCol,
    defaultColCount = 4,
    defaultRowExpand = 2,
    handleFinish,
  } = props;
  const { t } = useTranslation();
  const { isPhone } = useCommonStore();
  let [form] = Form.useForm();
  const [isExpand, setExpand] = useState(false);
  const [isFirst, setFirst] = useState(true);

  // 页面传入 searchForm 时使用外部表单实例，方便 useSearchUrlParams 把 URL 参数回填到搜索框。
  if (searchForm) {
    form = searchForm;
  }

  // 是否展示展开按钮：搜索项超过默认展示数量时，才显示“展开/收缩”。
  const isShowExpand = useMemo(() => {
    if (!isRowExpand) return false;

    const showNum = defaultColCount * defaultRowExpand;
    return showNum < list.length;
  }, [defaultColCount, defaultRowExpand, isRowExpand, list.length]);

  // 初始化搜索内容。只在首次有 data 时回填，避免用户输入过程中被外部状态覆盖。
  useEffect(() => {
    try {
      if (Object.keys(data).length && isFirst) {
        setFirst(false);
        form.setFieldsValue({ ...data });
      }
    } catch (e) {
      console.error(e);
      console.warn('传入的搜索数据不是一个对象');
    }
  }, [data, form, isFirst]);

  // 清除封装组件自己的参数，剩下的原生 FormProps 继续透传给 Antd Form。
  const formProps = { ...props };
  delete formProps.type;
  delete formProps.isSearch;
  delete formProps.isReset;
  delete formProps.isLoading;
  delete formProps.handleFinish;

  /** 点击重置 */
  const onReset = () => {
    // reset 后立即 submit，让页面使用初始条件重新请求列表。
    form?.resetFields();
    form?.setFieldsValue(initialValues ? { ...initialValues } : {});
    form?.submit();
  };

  /** 获取搜索按钮flex状态 */
  const getFlexCol = () => {
    // 如果搜索按钮在最后一行第一个，则靠右显示
    if (list?.length % defaultColCount === 0) {
      return 'auto';
    }

    return isShowExpand ? 'auto' : undefined;
  };

  /**
   * 处理列表
   * @param list - 列表
   */
  const filterList = (list: BaseSearchList[]) => {
    if (!isShowExpand) return list;

    // 默认显示个数 = 每行列数 * 默认行数，超出的字段根据 isExpand 决定隐藏或展示。
    const showNum = defaultColCount * defaultRowExpand;

    for (let i = 0; i < list.length; i++) {
      const item = list[i];

      if (i < showNum) {
        item.hidden = false;
        continue;
      }

      item.hidden = !isExpand;
    }

    return list;
  };

  /** 获取表单label宽度 */
  const getLabelCol = (item?: BaseSearchList) => {
    // 优先使用字段自己的宽度，其次使用组件统一配置，最后根据 grid/移动端给默认值。
    if (item?.labelWidth) {
      return { style: { width: item.labelWidth } };
    }

    if (item?.labelCol) return item.labelCol;
    if (labelCol) return labelCol;

    return type === 'grid' && !isPhone ? { span: 6 } : undefined;
  };

  /** 获取输入间隙 */
  const getWrapperCol = (item?: BaseSearchList) => {
    // wrapperCol 控制输入控件占位宽度，和 labelCol 配合影响表单对齐。
    if (item?.wrapperWidth) {
      return { style: { width: item.wrapperWidth } };
    }

    if (item?.wrapperCol) return item.wrapperCol;
    if (wrapperCol) return wrapperCol;

    return type === 'grid' && !isPhone ? { span: 18 } : undefined;
  };

  /**
   * 提交表单
   * @param values - 表单值
   */
  const onFinish: FormProps['onFinish'] = (values) => {
    if (handleFinish) {
      // 将 dayjs 类型转为接口常用的字符串/数组格式。
      let params = filterDayjs(values, list as BaseFormList[]);
      // 过滤空字符串和前后空格，避免 URL 和接口参数里出现无意义字段。
      params = filterEmptyStr(params);
      handleFinish?.(params);
    }
  };

  /**
   * 表单提交失败处理
   * @param errorInfo - 错误信息
   */
  const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.warn('搜索错误:', errorInfo);
  };

  /** 渲染按钮列表 */
  const renderBtnList = (
    <div className="flex flex-wrap gap-10px">
      {!!isSearch && (
        <Button
          type="primary"
          htmlType="submit"
          className={`!mb-5px ${isPhone ? 'mr-5px' : ''}`}
          loading={isLoading}
          icon={<SearchOutlined />}
        >
          {t('public.search')}
        </Button>
      )}

      {!!isReset && (
        <Button
          className={`!mb-5px ${isPhone ? 'mr-5px' : ''}`}
          icon={<ReloadOutlined />}
          onClick={onReset}
        >
          {t('public.reset')}
        </Button>
      )}

      {children && <div className={`!mb-5px ${isPhone ? 'mr-5px' : ''}`}>{children}</div>}

      {type === 'grid' && !!isShowExpand && (
        <div
          className="text-12px cursor-pointer color-#1677ff hover:color-#69b1ff mt-8px"
          onClick={() => {
            setExpand(!isExpand);
          }}
        >
          <DownOutlined rotate={isExpand ? 180 : 0} />
          {isExpand ? '收缩' : '展开'}
        </div>
      )}
    </div>
  );

  return (
    <div id="searches" style={style} className={className}>
      <Form
        layout={isPhone ? 'horizontal' : 'inline'}
        {...formProps}
        ref={ref}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {type === 'default' && (
          <>
            {list?.map((item) => (
              // default 模式适合字段较少的搜索栏，所有字段按 inline 表单顺序排列。
              <Form.Item
                {...filterFormItem(item)}
                key={`${item.name}`}
                className={`${item?.className || ''} !mb-5px`}
                labelCol={getLabelCol(item)}
                wrapperCol={getWrapperCol(item)}
                valuePropName={handleValuePropName(item.component)}
              >
                {getComponent(t, item, form)}
              </Form.Item>
            ))}
            {renderBtnList}
          </>
        )}

        {type === 'grid' && (
          <Flex wrap className="w-full">
            {filterList(list)?.map((item) => (
              // grid 模式按百分比宽度排布，移动端自动一行一个字段。
              <div
                key={`${item.name}`}
                style={{ width: item.hidden ? 0 : `${100 / (isPhone ? 1 : defaultColCount)}%` }}
              >
                <Form.Item
                  {...filterFormItem(item)}
                  className={`${item?.className || ''} !mb-5px`}
                  labelCol={getLabelCol(item)}
                  wrapperCol={getWrapperCol(item)}
                  valuePropName={handleValuePropName(item.component)}
                >
                  {getComponent(t, item, form)}
                </Form.Item>
              </div>
            ))}

            <Col flex={getFlexCol()}>
              <Flex justify="flex-end">{renderBtnList}</Flex>
            </Col>
          </Flex>
        )}
      </Form>
    </div>
  );
};

export default BaseSearch;
