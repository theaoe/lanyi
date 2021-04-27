<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="mini" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container" style="height: 81vh; overflow-y: scroll">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="人员姓名" prop="staffName">
          <el-input v-model="queryParams.staffName" placeholder="请输入人员姓名" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['soldier:placateCareFund:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['soldier:placateCareFund:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['soldier:placateCareFund:remove']">删除</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['soldier:placateCareFund:export']"
            >导出</el-button
          >
        </el-col> -->
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
    
    <el-table v-loading="loading" :data="placateCareFundList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="staffName" />
      <el-table-column label="身份证号" align="center" prop="idCard" />
      <el-table-column label="关爱基金申请表" align="center" prop="careFundFile">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-paperclip" @click="preview(scope.row)" v-hasPermi="['soldier:placateCareFund:edit']">预览</el-button>
        </template>
      </el-table-column>
      <el-table-column label="发放金额" align="center" prop="money" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['soldier:placateCareFund:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['soldier:placateCareFund:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-col>
    </el-row>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <!-- 添加或修改优抚关爱基金管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="人员信息" prop="staffId">
          <el-select v-model="form.staffId" filterable placeholder="请选择">
            <el-option v-for="item in idCardList" :key="item.staffId" :label="item.name + '-' + item.idCard" :value="item.staffId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发放金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入发放金额" />
        </el-form-item>
        <el-form-item label="关爱基金申请表" prop="careFundFile">
          <el-upload :limit="1" :action="fileAction" :on-preview="previewFunction" :before-upload="fieldBeforeUpload" :on-success="handleFileSuccess" :on-remove="removeFile">
            <el-input :hidden="true" v-model="form.careFundFile">
              <el-button slot="append" type="success" style="width: 110px; color: 12px" icon="el-icon-upload">上传附件</el-button>
            </el-input>
            <div class="el-upload__tip" style="color: red" slot="tip">
              提示：尽量上传“Word”或“PDF”格式文件！
            </div>
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
  listPlacateCareFund,
  getPlacateCareFund,
  delPlacateCareFund,
  addPlacateCareFund,
  updatePlacateCareFund,
  exportPlacateCareFund,
} from "@/api/soldier/placateCareFund";
import { getToken } from "@/utils/auth";
import { listStaffBase } from "@/api/soldier/staffBase";

import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Cookies from "js-cookie"; //引用
import axios from "axios";
import { Message } from "element-ui";

export default {
  name: "PlacateCareFund",
  components: {},
  data() {
    return {
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 人员姓名信息数组
      // userNameList: [],
      // 人员身份证号信息数组
      idCardList: [],
      // 用户导入参数
      // 设置上传的请求头部
      // headers: { Authorization: "Bearer " + getToken() },
      // 上传的地址
      fileAction: "https://sxshsyjt.com:8080/common/upload",
      src: "", // pdf 文件路径
      officeUrl: "https://sxshsyjt.com:8012/onlinePreview?url=", // word预览地址
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
      // 优抚关爱基金管理表格数据
      placateCareFundList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        staffName: null,
        deptId: null,
      },

      // 表单参数
      form: {},
      // 表单校验
      rules: {
        staffId: [
          { required: true, message: "请选择人员信息", trigger: "change" },
        ],
        money: [{ required: true, message: "请输入发放金额", trigger: "blur" }],
        careFundFile: [
          { required: true, message: "请上传附件", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getUserList();
    this.getTreeselect();
  },
  methods: {
     /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    // 查询人员信息
    getUserList() {
      listStaffBase(this.queryParams)
        .then((res) => {
          console.log(res);
          // this.userNameList = res.rows;
          this.idCardList = res.rows;
        })
        .catch((err) => {});
    },
    /** 查询优抚关爱基金管理列表 */
    getList() {
      this.loading = true;
      listPlacateCareFund(this.queryParams).then((response) => {
        this.placateCareFundList = response.rows;
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
        placateCareFundId: null,
        staffId: null,
        careFundFile: null,
        money: null,
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
      this.ids = selection.map((item) => item.placateCareFundId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加优抚关爱基金管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const placateCareFundId = row.placateCareFundId || this.ids;
      getPlacateCareFund(placateCareFundId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改优抚关爱基金管理";
      });
    },
    // 预览
    preview(row) {
      window.open(row.careFundFile, "_blank");
    },
    // 文件上传后的钩子函数
    previewFunction(file) {
      this.src = file.url;
    },
    // 文件上传前判断文件大小
    fieldBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 10;
      if (!isRightSize) {
        this.$message.error("文件大小超过 10MB");
      }
      // let isAccept = new RegExp('.doc').test(file.type)
      // if (!isAccept) {
      //   this.$message.error('应该选择.pdf类型的文件')
      // }
      // return isRightSize && isAccept
      return isRightSize;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      this.form.careFundFile = this.src;
    },
    removeFile(file) {
      this.form.careFundFile = ''
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.placateCareFundId != null) {
            updatePlacateCareFund(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPlacateCareFund(this.form).then((response) => {
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
      const placateCareFundIds = row.placateCareFundId || this.ids;
      this.$confirm(
          '是否确认删除优抚关爱基金管理编号为"' +
          placateCareFundIds +
          '"的数据项?',
          "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .then(function() {
          return delPlacateCareFund(placateCareFundIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有优抚关爱基金管理数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(function() {
          return exportPlacateCareFund(queryParams);
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

</style>
