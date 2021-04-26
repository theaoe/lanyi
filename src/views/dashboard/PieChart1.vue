<template>
  <div>
    <div class="PieSelect">
      <el-select v-model="value" placeholder="请选择" @change="getValue">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
    <div
      class="pie"
      ref="pie"
      :style="{
        width: '100%',
        height: '275px',
        margin: '1% 0',
      }"
    ></div>
  </div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { listAppeal } from "@/api/soldier/appeal";
import { treeselect } from "@/api/system/dept";
import {
  getTwCount1,
  getYfCount1,
} from "@/api/dashboard/panelgroup";
export default {
  name: "pie",
  data() {
    return {
      options: [],
      value: "",
      gaData: [],
      legendData: [],
      seriesData:[],
    };
  },
  async created() {
    await this.getTreeselect();
    await this.init();
  },
  async mounted() {
    await this.getTreeselect();
    await this.init();
    await this.$nextTick(() => {
      this.histogramBottom();
    });
  },
  methods: {
    async init(){
      let params = {
        deptId: 100,
      };
      await getTwCount1(params)
        .then((res) => {
          console.log(res);
          this.seriesData = res.data
        })
        .catch((err) => {});
    },
    getValue(val) {
      let params = {
        deptId: val,
      };
      getTwCount1(params)
        .then((res) => {
          console.log(res);
          let arr = res.data;
          this.legendData = []
          arr.map(item => {
            this.legendData.push(item.name)
          })
          this.seriesData = res.data
          console.log(this.seriesData)
          this.histogramBottom()
        })
        .catch((err) => {});
    },
    /** 查询部门下拉树结构 */
    async getTreeselect() {
      await treeselect().then((response) => {
        this.options = response.data[0].children;
        this.options.map((item) => {
          this.legendData.push(item.label);
        });
        this.legendData[2] = "大寨镇";
        console.log(this.legendData);
      });
    },
    histogramBottom() {
      let myChart = echarts.init(this.$refs.pie); //这里是为了获得容器所在位置
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "退役军人总数",
          //   subtext: "杨凌",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        // legend: {
        //   orient: "vertical",
        //   left: "left",
        //   data: this.legendData,
        // },
        series: [
          {
            name: "人数及占比",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      myChart.setOption(option);
    },
  },
};
</script>
<style  scoped>
.PieSelect {
  position: relative;
}
.el-select {
  width: 120px;
  position: absolute;
  right: 0;
  z-index: 1000;
}
</style>
