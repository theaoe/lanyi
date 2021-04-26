<template>
  <div class="table">
    <div>
      <el-table
        v-loading="loading"
        :data="historyList"
        height="235"
        @row-click="handleRowClick"
      >
        <el-table-column label="拜访时间" align="center" prop="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="拜访人员" align="center" prop="staffName" />
        <el-table-column
          label="诉求类别"
          align="center"
          prop="type"
          :formatter="typeFormat"
          show-overflow-tooltip
        />
        <el-table-column label="诉求内容" align="center" prop="content" />
      </el-table>
      <pagination
        v-show="traveltotal > 0"
        :total="traveltotal"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- <dv-scroll-board :config="config" style="height: 284px; color: #000;" @click="jumpDetail"/> -->
  </div>
</template>

<script>
import { listAppeal } from "@/api/soldier/appeal";
export default {
  data() {
    return {
      loading: false,
      historyList: [],
      // 类别字典
      typeOptions:[],
      traveltotal: 0,
      queryParams: {
        pageSize: 1,
        pageNum: 10,
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("tw_appeal_type").then((response) => {
      this.typeOptions = response.data;
    });
  },
  methods: {
     // 诉求类别字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    handleRowClick(rows, index) {
      this.$router.push("/button/appeal");
    },
    async getList() {
      await listAppeal()
        .then((res) => {
          console.log(res);
          this.historyList = res.rows;
          this.traveltotal = res.total;
        })
        .catch((err) => {});
    },
  },
};
</script>
<style  scoped>
.table {
  border-radius: 5px;
  overflow: hidden;
}
</style>
