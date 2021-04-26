<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import { getPxEchartCount } from "@/api/dashboard/panelgroup";
const animationDuration = 6000;

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "330px",
    },
  },
  data() {
    return {
      chart: null,
      pxData:[]
    };
  },
  async mounted() {
    await this.getPxEchartCounts();
    await this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    async getPxEchartCounts() {
      await getPxEchartCount()
        .then((res) => {
          this.pxData = res.data;
        })
        .catch((err) => {});
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");

      var dataAxis = [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ];
      // var yMax = 500;
      var dataShadow = [];

      // for (var i = 0; i < data.length; i++) {
      //   dataShadow.push(yMax);
      // }

      this.chart.setOption({
        title: {
          text: "年服务诉求人次",
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            inside: true,
            textStyle: {
              color: "#fff",
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          z: 10,
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#999",
            },
          },
        },
        dataZoom: [
          {
            type: "inside",
          },
        ],
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              color: "rgba(0,0,0,0.05)",
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: dataShadow,
            animation: false,
          },
          {
            type: "bar",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" },
              ]),
            },
            label: {
              normal: {
                position: "top",
                show: true,
              },
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" },
                ]),
              },
            },
            data: this.pxData,
          },
        ],
      });

      // Enable data zoom when user click bar.
      // var zoomSize = 6;
      // myChart.on('click', function (params) {
      //   console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
      //   myChart.dispatchAction({
      //     type: 'dataZoom',
      //     startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
      //     endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
      //   });
      // });
    },
  },
};
</script>
