/**
 * 学习提示：表单组件模块：通过配置生成 Ant Design 表单，减少页面重复编写 Form.Item。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { TFunction } from 'i18next';
import type { ComponentType, BaseFormList } from '#/form';
import { initCompProps } from './helper';
import LoadingComponent from '../components/LoadingComponent';
import { CreateBusiness } from '@/components/Business';
import type { FormInstance, InputProps } from 'antd';
import { Input, Spin } from 'antd';
import { type KeyboardEvent, lazy, Suspense } from 'react';
import { cloneDeep } from 'lodash';

// 存储运行时注入的组件，例如业务组件或 customize 自定义渲染组件。
const loadedComponents = new Map<string, React.ComponentType<any>>();

// 使用 React.lazy 创建懒加载组件，避免通用表单一次性打包所有低频控件。
const lazyComponents = new Map<string, React.LazyExoticComponent<any>>();

// 注册通用控件类型。BaseFormList.component 的值需要和这里的 key 对齐。
lazyComponents.set(
  'TextArea',
  lazy(() => import('antd').then((module) => ({ default: module.Input.TextArea }))),
);
lazyComponents.set(
  'InputNumber',
  lazy(() => import('antd').then((module) => ({ default: module.InputNumber }))),
);
lazyComponents.set(
  'InputPassword',
  lazy(() => import('antd').then((module) => ({ default: module.Input.Password }))),
);
lazyComponents.set(
  'AutoComplete',
  lazy(() => import('antd').then((module) => ({ default: module.AutoComplete }))),
);
lazyComponents.set(
  'Select',
  lazy(() => import('@/components/Selects/BaseSelect')),
);
lazyComponents.set(
  'TreeSelect',
  lazy(() => import('@/components/Selects/BaseTreeSelect')),
);
lazyComponents.set(
  'Checkbox',
  lazy(() => import('antd').then((module) => ({ default: module.Checkbox }))),
);
lazyComponents.set(
  'CheckboxGroup',
  lazy(() => import('antd').then((module) => ({ default: module.Checkbox.Group }))),
);
lazyComponents.set(
  'RadioGroup',
  lazy(() => import('antd').then((module) => ({ default: module.Radio.Group }))),
);
lazyComponents.set(
  'Switch',
  lazy(() => import('antd').then((module) => ({ default: module.Switch }))),
);
lazyComponents.set(
  'Rate',
  lazy(() => import('antd').then((module) => ({ default: module.Rate }))),
);
lazyComponents.set(
  'Slider',
  lazy(() => import('antd').then((module) => ({ default: module.Slider }))),
);
lazyComponents.set(
  'Upload',
  lazy(() => import('@/components/Upload/BaseUpload')),
);
lazyComponents.set(
  'Transfer',
  lazy(() => import('@/components/Transfer/BaseTransfer')),
);
lazyComponents.set(
  'DatePicker',
  lazy(() => import('@/components/Dates').then((module) => ({ default: module.BaseDatePicker }))),
);
lazyComponents.set(
  'RangePicker',
  lazy(() => import('@/components/Dates').then((module) => ({ default: module.BaseRangePicker }))),
);
lazyComponents.set(
  'TimePicker',
  lazy(() => import('@/components/Dates').then((module) => ({ default: module.BaseTimePicker }))),
);
lazyComponents.set(
  'TimeRangePicker',
  lazy(() =>
    import('@/components/Dates').then((module) => ({ default: module.BaseTimeRangePicker })),
  ),
);
lazyComponents.set(
  'ApiSelect',
  lazy(() => import('@/components/Selects/ApiSelect')),
);
lazyComponents.set(
  'ApiTreeSelect',
  lazy(() => import('@/components/Selects/ApiTreeSelect')),
);
lazyComponents.set(
  'ApiPageSelect',
  lazy(() => import('@/components/Selects/ApiPageSelect')),
);
lazyComponents.set(
  'PasswordStrength',
  lazy(() => import('@/components/PasswordStrength')),
);
lazyComponents.set(
  'RichEditor',
  lazy(() => import('@/components/WangEditor')),
);

/**
 * 懒加载控件包装层。
 * 表单控件异步加载期间，Antd Form 的字段值可能已经存在；这里主动从 form 中读取当前值，
 * 并把 onChange 收口到 setFieldValue，保证懒加载完成后字段值不会丢失。
 */
function LazyComponentWrapper({
  componentType,
  t,
  componentProps,
  fallback,
  form,
  name,
}: {
  componentType: ComponentType;
  t: TFunction;
  componentProps: any;
  fallback: React.ReactNode;
  form: FormInstance;
  name: string | string[];
}) {
  const LazyComponent = lazyComponents.get(componentType as ComponentType);

  if (!LazyComponent) {
    return <Spin>{fallback}</Spin>;
  }

  // 使用 getFieldValue 获取表单字段的当前值，否则懒加载组件挂载时可能拿不到初始值。
  const fieldValue = form ? form.getFieldValue(name) : undefined;

  /** 使用 setFieldValue 写回表单字段，兼容原生事件和 Select/DatePicker 这类直接值回调。 */
  const handleChange = (newValue: unknown) => {
    // 处理 e.target.value 情况，例如 Input/TextArea 的原生 change 事件。
    let actualValue = newValue;
    if (newValue && typeof newValue === 'object' && 'target' in newValue) {
      const event = newValue as React.ChangeEvent<HTMLInputElement>;
      actualValue = event.target.value;
    }

    if (form && name) {
      form?.setFieldValue?.(name, actualValue);
    }
    // 保留业务传入的 onChange，避免封装层吞掉页面自己的副作用逻辑。
    if (componentProps?.onChange) {
      componentProps.onChange(actualValue);
    }
  };

  const mergedProps = {
    ...initCompProps(t, componentType as ComponentType),
    ...componentProps,
    value: fieldValue !== undefined ? fieldValue : componentProps?.value,
    onChange: handleChange,
  };

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...mergedProps} />
    </Suspense>
  );
}

/**
 * 处理输入框组件多余参数
 * @param componentProps - 组件参数
 */
const handleInputProps = (componentProps?: ComponentProps) => {
  interface CurrentInputProps {
    children: unknown;
    api: unknown;
    apiResultKey: unknown;
    fieldNames: unknown;
  }

  const newComponentProps = cloneDeep(componentProps) as unknown as CurrentInputProps;
  // 这些参数属于 ApiSelect/业务组件，直接传给 Input 会被 React 输出到 DOM 并产生告警。
  delete newComponentProps?.children;
  delete newComponentProps?.api;
  delete newComponentProps?.apiResultKey;
  delete newComponentProps?.fieldNames;

  return (newComponentProps || {}) as unknown as InputProps;
};

/**
 * 获取组件
 * @param t - i18n 转换函数
 * @param item - 表单项
 */
export function getComponent(t: TFunction, item: BaseFormList, form: FormInstance) {
  const { component, componentProps, name } = item;

  const handlePressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const onPressEnter = (componentProps as InputProps)?.onPressEnter;

    // 输入框回车默认提交表单；业务传入 onPressEnter 时则优先执行业务自定义逻辑。
    if (onPressEnter) {
      onPressEnter?.(e);
    } else {
      form.submit();
    }
  };

  // 输入框渲染
  const renderInput = (
    <Input
      {...(initCompProps(t, 'Input') as InputProps)}
      {...handleInputProps(componentProps)}
      onPressEnter={handlePressEnter}
    />
  );

  // 当组件类型为自定义时，把 render 注册到运行时组件表，再走统一组件渲染逻辑。
  if (component === 'customize') {
    const { render } = item;
    // 自定义渲染缺失时降级为 Input，保证表单不会因为配置错误整块空白。
    if (!render) return renderInput;
    addComponent('customize', render);
  }

  // Input 是最高频控件，直接同步渲染，避免每个普通输入框都经过 Suspense。
  if (component === 'Input') {
    return renderInput;
  }

  // 查找懒加载组件，命中后交给包装层处理字段值同步。
  const LazyComponent = lazyComponents.get(component);

  // 如果找到对应的懒加载组件，返回包装后的组件
  if (LazyComponent) {
    return (
      <LazyComponentWrapper
        componentType={component}
        t={t}
        componentProps={componentProps}
        fallback={<LoadingComponent />}
        form={form}
        name={name}
      />
    );
  }

  // 尝试获取业务注入的同步组件。
  const Comp = loadedComponents.get(component);

  // 获取组件失败时降级为 Input，降低错误配置对页面可用性的影响。
  if (!Comp) return renderInput;

  return (
    <Comp
      {...initCompProps(t, component as ComponentType)}
      {...componentProps}
      onPressEnter={handlePressEnter}
    />
  );
}

/**
 * 添加组件
 * @param name - 组件名
 * @param component - 组件
 */
export function addComponent(name: ComponentType, component: any): void {
  loadedComponents.set(name, component);
}

/**
 * 删除组件
 * @param name - 组件名
 */
export function deleteComponent(name: ComponentType): void {
  loadedComponents.delete(name);
  lazyComponents.delete(name);
}

// 启动时注入业务组件，让配置表单可以通过 component 字段直接引用项目内的业务控件。
CreateBusiness();
