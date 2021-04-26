<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="报名方式" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择报名方式" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="参训时间" prop="enTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.enTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择参训时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="培训状态" prop="staus">
        <el-select v-model="queryParams.staus" placeholder="请选择培训状态" clearable size="small">
          <el-option
            v-for="dict in stausOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所获证书" prop="certificate">
        <el-input
          v-model="queryParams.certificate"
          placeholder="请输入所获证书"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['soldier:trainEnroll:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['soldier:trainEnroll:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['soldier:trainEnroll:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['soldier:trainEnroll:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="trainEnrollList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="name" :formatter="typeFormat" />
      <el-table-column label="身份证" align="center" prop="idCard" :formatter="typeFormat" />
      <el-table-column label="性别" align="center" prop="sex" :formatter="typeFormat" />
      <el-table-column label="年龄" align="center" prop="age" :formatter="typeFormat" />
      <el-table-column label="培训机构" align="center" prop="age" :formatter="typeFormat" />
      <el-table-column label="培训开始时间" align="center" prop="age" width="180" />
      <el-table-column label="培训结束时间" align="center" prop="age" width="180" />
      <el-table-column label="培训状态" align="center" prop="staus" :formatter="stausFormat" />
      <el-table-column label="所获证书" align="center" prop="certificate" />


      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['soldier:trainEnroll:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['soldier:trainEnroll:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改培训报名管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="培训人员" prop="staffId">
          <el-select v-model="form.staffId">
            <el-option>张三</el-option>
            <el-option>李四</el-option>
            <el-option>王五</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="培训信息" prop="trainInfoId">
          <el-select v-model="form.trainInfoId">
            <el-option>1</el-option>
            <el-option>2</el-option>
            <el-option>3</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报名方式" prop="type">
          <el-select v-model="form.type" placeholder="请选择报名方式">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参训时间" prop="enTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.enTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择参训时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="培训状态" prop="staus">
          <el-select v-model="form.staus" placeholder="请选择培训状态">
            <el-option
              v-for="dict in stausOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所获证书" prop="certificate">
          <el-input v-model="form.certificate" placeholder="请输入所获证书" />
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
import { listTrainEnroll, getTrainEnroll, delTrainEnroll, addTrainEnroll, updateTrainEnroll, exportTrainEnroll } from "@/api/soldier/trainEnroll";

export default {
  name: "TrainEnroll",
  components: {
  },
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
      // 培训报名管理表格数据
      trainEnrollList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 报名方式字典
      typeOptions: [],
      // 培训状态字典
      stausOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        enTime: null,
        staus: null,
        certificate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("tw_registration_way").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("tw_training_status").then(response => {
      this.stausOptions = response.data;
    });
  },
  methods: {
    /** 查询培训报名管理列表 */
    getList() {
      this.loading = true;
      listTrainEnroll(this.queryParams).then(response => {
        this.trainEnrollList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 报名方式字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 培训状态字典翻译
    stausFormat(row, column) {
      return this.selectDictLabel(this.stausOptions, row.staus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        trainEnrollId: null,
        staffId: null,
        trainInfoId: null,
        type: null,
        enTime: null,
        staus: null,
        certificate: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
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
      this.ids = selection.map(item => item.trainEnrollId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加培训报名管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const trainEnrollId = row.trainEnrollId || this.ids
      getTrainEnroll(trainEnrollId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改培训报名管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.trainEnrollId != null) {
            updateTrainEnroll(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTrainEnroll(this.form).then(response => {
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
      const trainEnrollIds = row.trainEnrollId || this.ids;
      this.$confirm('是否确认删除培训报名管理编号为"' + trainEnrollIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTrainEnroll(trainEnrollIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有培训报名管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTrainEnroll(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
