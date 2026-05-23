/**
 * 学习提示：公共组件模块：沉淀页面之间复用的 UI 和交互能力，避免业务页面重复造组件。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { TransferProps } from 'antd';
import type { TransferItem } from 'antd/es/transfer';
import { useState } from 'react';
import { Transfer } from 'antd';

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

function BaseTransfer(props: Props) {
  const { value } = props;
  const [targetKeys, setTargetKeys] = useState(value || []);

  /**
   * 更改数据
   * @param targetKeys - 显示在右侧框数据的key集合
   */
  const onChange: TransferProps<TransferItem>['onChange'] = (targetKeys) => {
    setTargetKeys(targetKeys as string[]);
    props?.onChange?.(targetKeys as string[]);
  };

  return <Transfer {...props} targetKeys={targetKeys} onChange={onChange} />;
}

export default BaseTransfer;
