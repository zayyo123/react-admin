import type { CSSProperties, ReactNode, Ref } from 'react';
import type { BaseFormData, BaseFormList } from '#/form';
import type { ColProps, FormInstance } from 'antd';
import { useEffect } from 'react';
import { FormProps } from 'antd';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { getComponent } from './utils/componentMap';
import { filterEmptyStr, filterFormItem, handleValuePropName } from './utils/helper';
import { filterDayjs } from '../Dates/utils/helper';

/**
 * 配置驱动的通用表单组件。
 * 页面通过 list 描述每个字段，BaseForm 负责把字段描述转换成 Form.Item 与真实控件，
 * 并在提交前统一处理日期格式、空字符串和校验文案，避免每个弹窗/搜索表单重复写同样逻辑。
 */
interface Props extends FormProps {
  list: BaseFormList[];
  data: BaseFormData;
  form: FormInstance<object>;
  style?: CSSProperties;
  ref?: Ref<FormInstance>;
  className?: string;
  children?: ReactNode;
  labelCol?: Partial<ColProps>;
  wrapperCol?: Partial<ColProps>;
  handleFinish: FormProps['onFinish'];
}

const BaseForm = (props: Props) => {
  const { ref, list, data, form, style, className, children, labelCol, wrapperCol, handleFinish } =
    props;
  const { t } = useTranslation();

  // 清除封装层自定义参数，剩余参数透传给 Antd Form，保持原生 FormProps 能力。
  const formProps: Partial<Props> = { ...props };
  delete formProps.list;
  delete formProps.data;
  delete formProps.handleFinish;

  // 监听外部 data 变化。编辑弹窗切换记录时，先重置旧字段，再写入新记录，避免残留上一次数据。
  useEffect(() => {
    form?.resetFields();
    form?.setFieldsValue(props.data);
  }, [form, props.data]);

  // 将 Antd 默认校验文案统一接入 i18n，新增字段时不用单独维护错误提示。
  const validateMessages = {
    required: t('public.requiredForm', { label: '${label}' }),
    types: {
      email: t('public.validateEmail', { label: '${label}' }),
      number: t('public.validateNumber', { label: '${label}' }),
    },
    number: {
      range: t('public.validateRange', { label: '${label}', max: '${max}', min: '${min}' }),
    },
  };

  /**
   * 提交表单
   * @param values - 表单值
   */
  const onFinish: FormProps['onFinish'] = (values) => {
    if (handleFinish) {
      // 将 dayjs 类型转为接口常用的字符串/数组格式。
      let params = filterDayjs(values, list);
      // 过滤空字符串并裁剪前后空格，减少提交给后端的无效字段。
      params = filterEmptyStr(params);
      handleFinish?.(params);
    }
  };

  /**
   * 表单提交失败处理
   * @param errorInfo - 错误信息
   */
  const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.warn('表单错误:', errorInfo);
  };

  /**
   * 渲染表单项
   * @param item - 表单项
   */
  const renderFormItem = (item: BaseFormList) => (
    // valuePropName 兼容 Switch/Checkbox/Upload 等非 value 字段，保证它们能被 Form 正确收集。
    <Form.Item {...filterFormItem(item)} valuePropName={handleValuePropName(item.component)}>
      {getComponent(t, item, form)}
    </Form.Item>
  );

  return (
    <div className={className} style={style}>
      <Form
        {...formProps}
        ref={ref}
        form={form}
        labelCol={labelCol ? labelCol : { span: 6 }}
        wrapperCol={wrapperCol ? wrapperCol : { span: 18 }}
        initialValues={data}
        validateMessages={validateMessages}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {list?.map((item) => (
          <div key={`${item.name}`}>
            {!item?.unit && <>{renderFormItem(item)}</>}

            {item.unit && (
              <Form.Item label={item.label}>
                {/* 带单位的字段需要外层 Form.Item 展示 label，内层 noStyle 负责绑定真实字段值。 */}
                {renderFormItem({ ...item, noStyle: true })}
                <span className="ml-5px whitespace-nowrap">{item.unit}</span>
              </Form.Item>
            )}
          </div>
        ))}

        {children}
      </Form>
    </div>
  );
};

export default BaseForm;
