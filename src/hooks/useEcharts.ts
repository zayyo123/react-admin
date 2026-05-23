/**
 * 学习提示：自定义 Hook 模块：把组件中可复用的状态逻辑和浏览器能力封装成 useXxx 函数。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import * as echarts from 'echarts/core';
import {
  BarChart,
  GaugeChart,
  LineChart,
  PictorialBarChart,
  PieChart,
  RadarChart,
  ScatterChart,
} from 'echarts/charts';
import type {
  BarSeriesOption,
  GaugeSeriesOption,
  LineSeriesOption,
  PictorialBarSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
  ScatterSeriesOption,
} from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
import type {
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | ScatterSeriesOption
  | PictorialBarSeriesOption
  | RadarSeriesOption
  | GaugeSeriesOption
  | TitleComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | ToolboxComponentOption
  | DatasetComponentOption
>;

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  PictorialBarChart,
  RadarChart,
  GaugeChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

/**
 * 使用Echarts
 * @param options -  绘制echarts的参数
 * @param data -  数据
 */
export const useEcharts = (options: echarts.EChartsCoreOption, data?: unknown) => {
  const echartsRef = useRef<echarts.EChartsType | null>(null);
  const htmlDivRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const debouncedResizeRef = useRef<ReturnType<typeof debounce> | null>(null);

  /** 销毁echarts */
  const dispose = useCallback(() => {
    if (echartsRef.current) {
      echartsRef.current.dispose();
      echartsRef.current = null;
    }
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }
    if (debouncedResizeRef.current) {
      debouncedResizeRef.current.cancel();
      debouncedResizeRef.current = null;
    }
  }, []);

  /** 初始化 */
  useEffect(() => {
    if (!htmlDivRef.current || !options) return;

    // 初始化chart
    echartsRef.current = echarts.init(htmlDivRef.current);
    echartsRef.current.setOption(options);

    // 创建并保存 debounced resize 函数
    debouncedResizeRef.current = debounce(() => {
      echartsRef.current?.resize({
        animation: {
          duration: 500,
        },
      });
    }, 50);

    // 使用 ResizeObserver 监听容器尺寸变化
    resizeObserverRef.current = new ResizeObserver(debouncedResizeRef.current);
    resizeObserverRef.current.observe(htmlDivRef.current);

    return () => {
      dispose();
    };
  }, [options, dispose]);

  // 当数据变化时更新图表
  useEffect(() => {
    if (data && echartsRef.current) {
      echartsRef.current.setOption(options);
    }
  }, [data, options]);

  return [htmlDivRef, echartsRef] as const;
};
