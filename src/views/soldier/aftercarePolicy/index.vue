<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.publishTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择发布时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否推送" prop="isPush">
        <el-select v-model="queryParams.isPush" placeholder="请选择是否推送" clearable size="small">
          <el-option
            v-for="dict in isPushOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否上传文件" prop="isUploadFile">
        <el-select v-model="queryParams.isUploadFile" placeholder="请选择是否上传文件" clearable size="small">
          <el-option
            v-for="dict in isUploadFileOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布单位" prop="publishUnit">
        <el-input
          v-model="queryParams.publishUnit"
          placeholder="请输入发布单位"
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
          v-hasPermi="['soldier:aftercarePolicy:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['soldier:aftercarePolicy:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['soldier:aftercarePolicy:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['soldier:aftercarePolicy:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="aftercarePolicyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="发布时间" align="center" prop="publishTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推送" align="center" prop="isPush" :formatter="isPushFormat" />
      <el-table-column label="政策概述" align="center" prop="summary" />
      <el-table-column label="是否上传文件" align="center" prop="isUploadFile" :formatter="isUploadFileFormat" />
      <el-table-column label="发布单位" align="center" prop="publishUnit" />
      <el-table-column label="文件路径" align="center" prop="filePath" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['soldier:aftercarePolicy:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['soldier:aftercarePolicy:remove']"
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

    <!-- 添加或修改安置政策管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.publishTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否推送" prop="isPush">
          <el-select v-model="form.isPush" placeholder="请选择是否推送">
            <el-option
              v-for="dict in isPushOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="政策概述" prop="summary">
          <el-input v-model="form.summary" placeholder="请输入政策概述" />
        </el-form-item>
        <el-form-item label="是否上传文件" prop="isUploadFile">
          <el-select v-model="form.isUploadFile" placeholder="请选择是否上传文件">
            <el-option
              v-for="dict in isUploadFileOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布单位" prop="publishUnit">
          <el-input v-model="form.publishUnit" placeholder="请输入发布单位" />
        </el-form-item>
        <el-form-item label="文件路径" prop="filePath">
          <el-input v-model="form.filePath" placeholder="请输入文件路径" />
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
import { listAftercarePolicy, getAftercarePolicy, delAftercarePolicy, addAftercarePolicy, updateAftercarePolicy, exportAftercarePolicy } from "@/api/soldier/aftercarePolicy";

export default {
  name: "AftercarePolicy",
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
      // 安置政策管理表格数据
      aftercarePolicyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否推送字典
      isPushOptions: [],
      // 是否上传文件字典
      isUploadFileOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        publishTime: null,
        isPush: null,
        isUploadFile: null,
        publishUnit: null,
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
    this.getDicts("tw_is_push").then(response => {
      this.isPushOptions = response.data;
    });
    this.getDicts("tw_is_upload").then(response => {
      this.isUploadFileOptions = response.data;
    });
  },
  methods: {
    /** 查询安置政策管理列表 */
    getList() {
      this.loading = true;
      listAftercarePolicy(this.queryParams).then(response => {
        this.aftercarePolicyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 是否推送字典翻译
    isPushFormat(row, column) {
      return this.selectDictLabel(this.isPushOptions, row.isPush);
    },
    // 是否上传文件字典翻译
    isUploadFileFormat(row, column) {
      return this.selectDictLabel(this.isUploadFileOptions, row.isUploadFile);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        aftercarePolicyId: null,
        title: null,
        publishTime: null,
        isPush: null,
        summary: null,
        isUploadFile: null,
        publishUnit: null,
        filePath: null,
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
      this.ids = selection.map(item => item.aftercarePolicyId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加安置政策管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const aftercarePolicyId = row.aftercarePolicyId || this.ids
      getAftercarePolicy(aftercarePolicyId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改安置政策管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.aftercarePolicyId != null) {
            updateAftercarePolicy(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAftercarePolicy(this.form).then(response => {
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
      const aftercarePolicyIds = row.aftercarePolicyId || this.ids;
      this.$confirm('是否确认删除安置政策管理编号为"' + aftercarePolicyIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAftercarePolicy(aftercarePolicyIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有安置政策管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAftercarePolicy(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
