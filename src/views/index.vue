<template>
  <div class="app-container home">
    <el-card style="height: 86vh">
      <panel-group />
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card>
            <pie-chart1 />
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <pie-chart2 />
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <table1 />
          </el-card>
        </el-col>
      </el-row>
      <br />
      <el-row :gutter="20">
        <el-col :xs="12" :sm="12">
          <el-card>
            <bar-chart1 />
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12">
          <el-card>
            <bar-chart />
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import PanelGroup from "./dashboard/PanelGroup.vue";
import BarChart from "./dashboard/BarChart";
import BarChart1 from "./dashboard/BarChart1";
import Table1 from "./dashboard/Table1";
import PieChart1 from "./dashboard/PieChart1";
import PieChart2 from "./dashboard/PieChart2";
export default {
  name: "index",
  components: { PanelGroup, BarChart, BarChart1, Table1, PieChart1, PieChart2 },
  props: [],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>
