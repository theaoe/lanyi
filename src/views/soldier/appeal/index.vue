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
          <el-form-item label="拜访人员" prop="visitPersion">
            <el-input v-model="queryParams.visitPersion" placeholder="请输入拜访人员" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="诉求类别" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择诉求类别" clearable size="small">
              <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['soldier:appeal:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['soldier:appeal:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['soldier:appeal:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['soldier:appeal:export']">导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="appealList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <!-- <el-table-column
            label="拜访时间"
            align="center"
            prop="visitTime"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.visitTime, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="人员姓名" align="center" prop="staffName" />
          <el-table-column label="身份证号" align="center" prop="idCard" />
          <el-table-column label="手机号" align="center" prop="telphone" />
          <el-table-column label="诉求内容" align="center" prop="content" show-overflow-tooltip />
          <el-table-column label="诉求类别" align="center" prop="type" :formatter="typeFormat" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['soldier:appeal:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['soldier:appeal:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <!-- 添加或修改诉求信息管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="主键ID" prop="staffId">
          <el-input v-model="form.staffId" placeholder="请输入主键ID" />
        </el-form-item> -->
        <!-- <el-form-item label="拜访时间" prop="visitTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 100%"
            v-model="form.visitTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择拜访时间"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="人员姓名" prop="staffId">
          <el-select v-model="form.staffId" filterable placeholder="请选择" clearable>
            <el-option v-for="item in idCardList" :key="item.staffId" :label="item.name + ' - ' +  item.idCard" :value="item.staffId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="诉求类别" prop="type">
          <el-select v-model="form.type" placeholder="请选择诉求类别" style="width: 100%">
            <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="诉求内容">
          <el-input v-model="form.content" placeholder="请输入诉求内容" type="textarea" />
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
  listAppeal,
  getAppeal,
  delAppeal,
  addAppeal,
  updateAppeal,
  exportAppeal,
} from "@/api/soldier/appeal";
import Editor from "@/components/Editor";
import { listStaffBase } from "@/api/soldier/staffBase";

import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";
import Cookies from "js-cookie"; //引用
import axios from "axios";
import { Message } from "element-ui";

export default {
  name: "Appeal",
  components: {
    Editor,
  },
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
      // 人员身份证号信息数组
      idCardList: [],
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
      // 诉求信息管理表格数据
      appealList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 诉求类别字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        staffId: null,
        visitPersion: null,
        type: null,
        deptId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
    this.getUserList();
    this.getTreeselect();
    this.getDicts("tw_appeal_type").then((response) => {
      this.typeOptions = response.data;
    });
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
          console.log(this.idCardList);
        })
        .catch((err) => {});
    },
    /** 查询诉求信息管理列表 */
    getList() {
      this.loading = true;
      listAppeal(this.queryParams).then((response) => {
        this.appealList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 诉求类别字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        appealId: null,
        staffId: null,
        visitTime: null,
        visitPersion: null,
        content: null,
        type: null,
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
      this.ids = selection.map((item) => item.appealId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加诉求信息管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const appealId = row.appealId || this.ids;
      getAppeal(appealId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改诉求信息管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.appealId != null) {
            updateAppeal(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAppeal(this.form).then((response) => {
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
      const appealIds = row.appealId || this.ids;
      this.$confirm(
          '是否确认删除诉求信息管理编号为"' + appealIds + '"的数据项?',
          "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .then(function() {
          return delAppeal(appealIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有诉求信息管理数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(function() {
          return exportAppeal(queryParams);
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
