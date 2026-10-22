import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  DatasetComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';

echarts.use([
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  DatasetComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  UniversalTransition,
  CanvasRenderer,
]);

export { echarts };
export type EChartsCoreInstance = echarts.ECharts;
