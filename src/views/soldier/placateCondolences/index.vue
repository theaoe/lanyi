<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <!-- <el-form-item label="拜访时间" prop="visitTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.visitTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择拜访时间">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="拜访人员" prop="visitPersion">
        <el-input
          v-model="queryParams.visitPersion"
          placeholder="请输入拜访人员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['soldier:placateCondolences:add']"
        >新增</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['soldier:placateCondolences:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['soldier:placateCondolences:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['soldier:placateCondolences:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="placateCondolencesList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="拜访时间"
        align="center"
        prop="visitTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.visitTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拜访人员" align="center" prop="visitPersion" />
      <el-table-column label="退伍军人" align="center" prop="staffName" />
      <el-table-column label="身份证号" align="center" prop="idCard" />
      <el-table-column label="服务状态" align="center" prop="type">
        <template slot-scope="scope">
          <el-tag type="success" disable-transitions>{{
            scope.row.typeText
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['soldier:placateCondolences:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['soldier:placateCondolences:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改优抚慰问记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主键ID" prop="staffId">
          <el-input v-model="form.staffId" placeholder="请输入主键ID" />
        </el-form-item>
        <el-form-item label="主键ID" prop="placatePolicyId">
          <el-input v-model="form.placatePolicyId" placeholder="请输入主键ID" />
        </el-form-item>
        <el-form-item label="拜访时间" prop="visitTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.visitTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择拜访时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="拜访人员" prop="visitPersion">
          <el-input v-model="form.visitPersion" placeholder="请输入拜访人员" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listPlacateCondolences,
  getPlacateCondolences,
  delPlacateCondolences,
  addPlacateCondolences,
  updatePlacateCondolences,
  exportPlacateCondolences,
} from "@/api/soldier/placateCondolences";

export default {
  name: "PlacateCondolences",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 优抚慰问记录表格数据
      placateCondolencesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        visitTime: null,
        visitPersion: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    filterTag(value, row) {
      console.log(value, row);
      return row.tag === value;
    },
    /** 查询优抚慰问记录列表 */
    getList() {
      this.loading = true;
      listPlacateCondolences(this.queryParams).then((response) => {
        this.placateCondolencesList = response.rows;
        this.placateCondolencesList.map((item) => {
          switch (item.type) {
            case null:
              item.typeText = "未服务";
              break;
            case 1:
              item.typeText = "已预约";
              break;
            case 2:
              item.typeText = "已服务";
              break;
            default:
              break;
          }
        });
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        placateCondolencesId: null,
        staffId: null,
        placatePolicyId: null,
        visitTime: null,
        visitPersion: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.placateCondolencesId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加优抚慰问记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const placateCondolencesId = row.placateCondolencesId || this.ids;
      getPlacateCondolences(placateCondolencesId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改优抚慰问记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.placateCondolencesId != null) {
            updatePlacateCondolences(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPlacateCondolences(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const placateCondolencesIds = row.placateCondolencesId || this.ids;
      this.$confirm(
        '是否确认删除优抚慰问记录编号为"' +
          placateCondolencesIds +
          '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delPlacateCondolences(placateCondolencesIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有优抚慰问记录数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportPlacateCondolences(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
