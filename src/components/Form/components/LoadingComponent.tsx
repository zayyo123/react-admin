/**
 * 学习提示：表单组件模块：通过配置生成 Ant Design 表单，减少页面重复编写 Form.Item。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useState, useRef, useEffect } from 'react';

function LoadingComponent() {
  const { t } = useTranslation();
  const [num, setNum] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setNum((prevNum) => {
        let num = prevNum + 1;
        if (num >= 3) num = 0;
        return num;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const renderDots = () => {
    switch (num) {
      case 0:
        return '.';
      case 1:
        return '..';
      case 2:
        return '...';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center text-gray-500">
      <div>{t('public.loading')}</div>
      <div className="ml-2px tracking-2px">{renderDots()}</div>
    </div>
  );
}

export default LoadingComponent;
