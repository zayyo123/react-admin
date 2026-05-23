/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { EChartsCoreOption } from 'echarts';

function Line() {
  const { t } = useTranslation();

  const option: EChartsCoreOption = {
    title: {
      text: t('dashboard.effectiveRechargeRatio'),
      left: 30,
      top: 5,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['07-11', '07-12', '07-13', '07-14', '07-15', '07-16', '07-17'],
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    series: [
      {
        name: t('dashboard.rechargeAmount'),
        type: 'line',
        areaStyle: {
          color: '#1890ff',
          opacity: 0.2,
        },
        emphasis: {
          focus: 'series',
        },
        data: [120, 140, 120, 190, 150, 111, 160],
      },
      {
        name: t('dashboard.usersNumber'),
        type: 'line',
        areaStyle: {
          color: '#1890ff',
          opacity: 0.3,
        },
        emphasis: {
          focus: 'series',
        },
        data: [90, 122, 90, 140, 123, 280, 200],
      },
    ],
  };

  const [echartsRef] = useEcharts(option);

  return (
    <div className="h-550px border border-gray-200 rounded-10px">
      <div ref={echartsRef} className="w-full h-full"></div>
    </div>
  );
}

export default Line;
