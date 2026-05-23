/**
 * 学习提示：表格组件模块：封装 Ant Design Table 的列配置、筛选、拖拽、虚拟滚动和文本展示。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { Tooltip } from 'antd';
import { useEffect, useRef, useState, useCallback, type CSSProperties } from 'react';

interface EllipsisTextProps {
  text: string;
  width?: number | string;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

const EllipsisText = (props: EllipsisTextProps) => {
  const { width, text, color, className = '', style } = props;
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  // 计算文本是否溢出
  const calculateOverflow = useCallback(() => {
    const element = textRef.current;
    if (element) {
      // 检查文本是否溢出
      setIsOverflowed(element.scrollWidth > element.clientWidth);
    }
  }, [text, width, textRef.current]);

  useEffect(() => {
    calculateOverflow();
  }, [calculateOverflow]);

  const textStyle = {
    color,
    ...style,
  };

  const content = (
    <span
      ref={textRef}
      className={`inline-block w-full overflow-hidden text-ellipsis whitespace-nowrap ${className}`}
      style={textStyle}
    >
      {text}
    </span>
  );

  // 只有在文本溢出时才显示Tooltip
  if (isOverflowed) {
    return (
      <Tooltip title={text} placement="top">
        {content}
      </Tooltip>
    );
  }

  return content;
};

export default EllipsisText;
