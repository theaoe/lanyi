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
          <el-form-item label="姓名" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="身份证" prop="idCard">
            <el-input v-model="queryParams.idCard" placeholder="请输入身份证" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="优抚级别" prop="level">
            <el-select v-model="queryParams.level" placeholder="请选择优抚级别" clearable size="small">
              <el-option v-for="dict in levelOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['soldier:placateInfo:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['soldier:placateInfo:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['soldier:placateInfo:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['soldier:placateInfo:export']">导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="placateInfoList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="姓名" align="center" prop="staffName" />
          <el-table-column label="身份证" align="center" prop="idCard" />
          <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormat" />
          <el-table-column label="出生日期" align="center" prop="birthday" width="180">
            <template slot-scope="scope">
              <span>{{ parseTimeDate(scope.row.birthday, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="优抚级别" align="center" prop="level" :formatter="levelFormat" />
          <el-table-column label="优抚类别" align="center" prop="type" :formatter="typeFormat" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['soldier:placateInfo:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['soldier:placateInfo:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <!-- 添加或修改优抚信息管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="人员信息" prop="staffId">
          <el-select v-model="form.staffId" filterable placeholder="请选择">
            <el-option v-for="item in idCardList" :key="item.staffId" :label="item.name + '-' + item.idCard" :value="item.staffId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="政策列表" prop="placatePolicyId">
          <el-select v-model="form.placatePolicyId" filterable placeholder="请选择">
            <el-option v-for="item in placatePolicyIdList" :key="item.placatePolicyId" :label="item.title" :value="item.placatePolicyId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优抚类别" prop="type">
          <el-select v-model="form.type" filterable placeholder="请选择">
            <el-option v-for="item in placateTypeList" :key="item.dictSort" :label="item.dictLabel" :value="item.dictSort">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优抚级别" prop="level">
          <el-select v-model="form.level" placeholder="请选择优抚级别">
            <el-option v-for="dict in levelOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
          </el-select>
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
  listPlacateInfo,
  getPlacateInfo,
  delPlacateInfo,
  addPlacateInfo,
  updatePlacateInfo,
  exportPlacateInfo,
} from "@/api/soldier/placateInfo";
import { listPlacatePolicy } from "@/api/soldier/placatePolicy";
import { listStaffBase } from "@/api/soldier/staffBase";

import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";
import Cookies from "js-cookie"; //引用
import axios from "axios";
import { Message } from "element-ui";
export default {
  name: "PlacateInfo",
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
      // 优抚级别列表
      levelOptions: [],
      // 人员身份证号信息数组
      idCardList: [],
      // 政策信息列表
      placatePolicyIdList: [],
      // 优抚类别列表
      placateTypeList: [],
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
      // 优抚信息管理表格数据
      placateInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 性别字典
      sexOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        updateTime: null,
        level: null,
        name: null,
        idCard: null,
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
    this.getPlacatePolicyList();
    this.getDicts("sys_user_sex").then((response) => {
      this.sexOptions = response.data;
    });
    this.getDicts("tw_placate_level").then((response) => {
      this.levelOptions = response.data;
    });
    this.getDicts("tw_placate_type").then((response) => {
      this.placateTypeList = response.data;
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
    parseTimeDate(time) {
      if (arguments.length === 0 || !time) {
        return null;
      }
      var date = time,
        nDate = new Date(date),
        year = nDate.getFullYear();
      var month = nDate.getMonth() + 1;
      var day = nDate.getDay() + 1;
      let timeStr = year + "-" + month + "-" + day;
      return timeStr;
    },
    // 查询人员信息
    getUserList() {
      listStaffBase(this.queryParams)
        .then((res) => {
          this.idCardList = res.rows;
        })
        .catch((err) => {});
    },
    /** 查询优抚政策管理列表 */
    getPlacatePolicyList() {
      this.loading = true;
      listPlacatePolicy(this.queryParams).then((response) => {
        this.placatePolicyIdList = response.rows;
      });
    },
    /** 查询优抚信息管理列表 */
    getList() {
      this.loading = true;
      listPlacateInfo(this.queryParams).then((response) => {
        console.log(response.rows);
        this.placateInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 优抚级别字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.placateTypeList, row.type);
    },
    // 优抚级别字典翻译
    levelFormat(row, column) {
      return this.selectDictLabel(this.levelOptions, row.level);
    },
    // 性别字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },
    // 政治面貌字典翻译
    politicalStatusFormat(row, column) {
      return this.selectDictLabel(
        this.politicalStatusOptions,
        row.politicalStatus
      );
    },
    // 文化程度字典翻译
    educationFormat(row, column) {
      return this.selectDictLabel(this.educationOptions, row.education);
    },
    // 健康状况字典翻译
    healthConditionFormat(row, column) {
      return this.selectDictLabel(
        this.healthConditionOptions,
        row.healthCondition
      );
    },
    // 伤残级别字典翻译
    disabilityLevelFormat(row, column) {
      return this.selectDictLabel(
        this.disabilityLevelOptions,
        row.disabilityLevel
      );
    },
    // 职务字典翻译
    jobFormat(row, column) {
      return this.selectDictLabel(this.jobOptions, row.job);
    },
    // 技术特长字典翻译
    technicalExpertiseFormat(row, column) {
      return this.selectDictLabel(
        this.technicalExpertiseOptions,
        row.technicalExpertise
      );
    },
    // 学历字典翻译
    educationBackgroundFormat(row, column) {
      return this.selectDictLabel(
        this.educationBackgroundOptions,
        row.educationBackground
      );
    },
    // 学位字典翻译
    degreeFormat(row, column) {
      return this.selectDictLabel(this.degreeOptions, row.degree);
    },
    // 所学专业字典翻译
    majorFormat(row, column) {
      return this.selectDictLabel(this.majorOptions, row.major);
    },
    // 毕业院校字典翻译
    graduationSchoolFormat(row, column) {
      return this.selectDictLabel(
        this.graduationSchoolOptions,
        row.graduationSchool
      );
    },
    // 系别字典翻译
    departmentFormat(row, column) {
      return this.selectDictLabel(this.departmentOptions, row.department);
    },
    // 职业技能字典翻译
    vocationSkillFormat(row, column) {
      return this.selectDictLabel(this.vocationSkillOptions, row.vocationSkill);
    },
    // 军衔字典翻译
    militaryRankFormat(row, column) {
      return this.selectDictLabel(this.militaryRankOptions, row.militaryRank);
    },
    // 是否领取退伍金字典翻译
    isReceiveVeteransMoneyFormat(row, column) {
      return this.selectDictLabel(
        this.isReceiveVeteransMoneyOptions,
        row.isReceiveVeteransMoney
      );
    },
    // 服役军种字典翻译
    militaryServiceFormat(row, column) {
      return this.selectDictLabel(
        this.militaryServiceOptions,
        row.militaryService
      );
    },
    // 入伍部队字典翻译
    enlistmentArmyFormat(row, column) {
      return this.selectDictLabel(
        this.enlistmentArmyOptions,
        row.enlistmentArmy
      );
    },
    // 退役职级字典翻译
    veteransLevelFormat(row, column) {
      return this.selectDictLabel(this.veteransLevelOptions, row.veteransLevel);
    },
    // 退役部队字典翻译
    veteransArmyFormat(row, column) {
      return this.selectDictLabel(this.veteransArmyOptions, row.veteransArmy);
    },
    // 预备役身份类别字典翻译
    reserveStatusFormat(row, column) {
      return this.selectDictLabel(this.reserveStatusOptions, row.reserveStatus);
    },
    // 服预备役类别字典翻译
    serviceReserveFormat(row, column) {
      return this.selectDictLabel(
        this.serviceReserveOptions,
        row.serviceReserve
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        placateInfoId: null,
        placatePolicyId: null,
        staffId: null,
        level: null,
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
      this.ids = selection.map((item) => item.placateInfoId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加优抚信息管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const placateInfoId = row.placateInfoId || this.ids;
      getPlacateInfo(placateInfoId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改优抚信息管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.placateInfoId != null) {
            updatePlacateInfo(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPlacateInfo(this.form).then((response) => {
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
      const placateInfoIds = row.placateInfoId || this.ids;
      this.$confirm(
          '是否确认删除优抚信息管理编号为"' + placateInfoIds + '"的数据项?',
          "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .then(function() {
          return delPlacateInfo(placateInfoIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有优抚信息管理数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(function() {
          return exportPlacateInfo(queryParams);
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
