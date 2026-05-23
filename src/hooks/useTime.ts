/**
 * 学习提示：自定义 Hook 模块：把组件中可复用的状态逻辑和浏览器能力封装成 useXxx 函数。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';

/**
 * @description 获取本地时间
 */
export const useTimes = () => {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState(dayjs().format('YYYY年MM月DD日 HH:mm:ss'));

  useEffect(() => {
    timer.current = setInterval(() => {
      setTime(dayjs().format('YYYY年MM月DD日 HH:mm:ss'));
    }, 1000);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, []);

  return {
    time,
  };
};
