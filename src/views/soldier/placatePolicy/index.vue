<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
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
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.publishTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择发布时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否推送" prop="isPush">
        <el-select
          v-model="queryParams.isPush"
          placeholder="请选择是否推送"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in isPushOptions"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['soldier:placatePolicy:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['soldier:placatePolicy:edit']"
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
          v-hasPermi="['soldier:placatePolicy:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['soldier:placatePolicy:export']"
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
      :data="placatePolicyList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column
        label="发布时间"
        align="center"
        prop="publishTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.publishTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否推送"
        align="center"
        prop="isPush"
        :formatter="isPushFormat"
      />
      <el-table-column label="政策概述" align="center" prop="summary" />
      <el-table-column label="发布单位" align="center" prop="publishUnit" />
      <el-table-column label="政策简图" align="center" prop="filePath">
        <template slot-scope="scope">
          <el-image
            shape="square"
            style="width: 100px; height: 100px"
            fit="scale-down"
            :src="scope.row.filePath"
          ></el-image>
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
            v-hasPermi="['soldier:placatePolicy:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['soldier:placatePolicy:remove']"
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

    <!-- 添加或修改政策法规管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="政策标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="发布单位" prop="publishUnit">
          <el-input v-model="form.publishUnit" placeholder="请输入发布单位" />
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 100%"
            v-model="form.publishTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择发布时间"
          >
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
          <el-input
            v-model="form.summary"
            placeholder="请输入政策概述"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="政策简图" prop="filePath">
          <el-upload
            class="avatar-uploader"
            :action="fileAction"
            :show-file-list="false"
            :before-upload="fieldBeforeUpload"
            :on-success="handleFileSuccess"
            accept="image/jpg,image/jpeg,image/png"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
  listPlacatePolicy,
  getPlacatePolicy,
  delPlacatePolicy,
  addPlacatePolicy,
  updatePlacatePolicy,
  exportPlacatePolicy,
} from "@/api/soldier/placatePolicy";

export default {
  name: "PlacatePolicy",
  components: {},
  data() {
    return {
      // 人员身份证号信息数组
      idCardList: [],
      // 政策信息列表
      placatePolicyList:[],
      // 上传的地址
      fileAction: "https://sxshsyjt.com:8080/common/upload",
      imageUrl: "",
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
      // 优抚政策管理表格数据
      placatePolicyList: [],
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
        title: [{ required: true, message: "请输入", trigger: "blur" }],
        publishUnit: [{ required: true, message: "请输入", trigger: "blur" }],
        publishTime: [{ required: true, message: "请选择", trigger: "change" }],
        isPush: [{ required: true, message: "请选择", trigger: "change" }],
        isUploadFile: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        summary: [{ required: true, message: "请输入", trigger: "blur" }],
        filePath: [
          { required: true, message: "请上传简图", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
    // this.getUserList();
    this.getDicts("tw_is_push").then((response) => {
      this.isPushOptions = response.data;
    });
    this.getDicts("tw_is_upload").then((response) => {
      this.isUploadFileOptions = response.data;
    });
  },
  methods: {
    /** 查询优抚政策管理列表 */
    getList() {
      this.loading = true;
      listPlacatePolicy(this.queryParams).then((response) => {
        this.placatePolicyList = response.rows;
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
        placatePolicyId: null,
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
        updateTime: null,
      };
      this.imageUrl = '';
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
      this.ids = selection.map((item) => item.placatePolicyId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加优抚政策管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const placatePolicyId = row.placatePolicyId || this.ids;
      getPlacatePolicy(placatePolicyId).then((response) => {
        this.form = response.data;
        this.imageUrl = response.data.filePath;
        this.open = true;
        this.title = "修改优抚政策管理";
      });
    },
    // 文件上传前判断文件大小
    fieldBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 10;
      if (!isRightSize) {
        this.$message.error("文件大小超过 10MB");
      }
      return isRightSize;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      console.log(response);
      this.form.filePath = response.url;
      this.imageUrl = response.url;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.placatePolicyId != null) {
            updatePlacatePolicy(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPlacatePolicy(this.form).then((response) => {
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
      const placatePolicyIds = row.placatePolicyId || this.ids;
      this.$confirm(
        '是否确认删除优抚政策管理编号为"' + placatePolicyIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delPlacatePolicy(placatePolicyIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有优抚政策管理数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportPlacatePolicy(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
<style scoped>
.el-select {
  width: 100%;
}
.avatar-uploader {
  width: 150px;
  height: 150px;
  border: 1px dashed #bbb;
}
.el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>
