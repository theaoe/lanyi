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
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="70px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="人员姓名" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable size="small" @keyup.enter.native="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="身份证号" prop="idCard">
                <el-input type="tel" v-model="queryParams.idCard" placeholder="请输入身份证" maxlength="18" clearable size="small" @keyup.enter.native="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="人员性别" prop="sex">
                <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable size="small">
                  <el-option v-for="dict in sexOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="年龄范围" prop="beginAge">
                <el-input v-model="queryParams.beginAge" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" maxlength="3" placeholder="请输入最小年龄" clearable size="small" @keyup.enter.native="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="年龄范围" prop="endAge">
                <el-input v-model="queryParams.endAge" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" maxlength="3" placeholder="请输入最大年龄" clearable size="small" @keyup.enter.native="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="政治面貌" prop="politicalStatus">
                <el-select v-model="queryParams.politicalStatus" placeholder="请选择政治面貌" clearable size="small">
                  <el-option v-for="dict in politicalStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="文化程度" prop="education">
                <el-select v-model="queryParams.education" placeholder="请选择文化程度" clearable size="small">
                  <el-option v-for="dict in educationOptions" :key="dict.dictCode" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="健康状况" prop="healthCondition">
                <el-select v-model="queryParams.healthCondition" placeholder="请选择健康状况" clearable size="small">
                  <el-option v-for="dict in healthConditionOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="人员类别" prop="serviceReserve">
                <el-select v-model="queryParams.serviceReserve" placeholder="请选择人员类别" clearable :style="{ width: '100%' }">
                  <el-option v-for="dict in serviceReserveOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="queryParams.serviceReserve == 1">
              <el-form-item label="干部类型" prop="ganbuType">
                <el-select v-model="queryParams.ganbuType" placeholder="请选择预备役身份身份类别" clearable :style="{ width: '100%' }">
                  <el-option v-for="dict in cadreTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="queryParams.serviceReserve == 1">
              <el-form-item label="干部军衔" prop="militaryRank">
                <el-select v-model="queryParams.militaryRank" placeholder="请选择" clearable :style="{ width: '100%' }">
                  <el-option v-for="dict in militaryRankOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-else-if="queryParams.serviceReserve == 2">
              <el-form-item label="士官军衔" prop="militaryRank">
                <el-select v-model="queryParams.militaryRank" placeholder="请选择" clearable :style="{ width: '100%' }">
                  <el-option v-for="dict in sergeantRankOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-else-if="queryParams.serviceReserve == 3">
              <el-form-item label="士兵军衔" prop="militaryRank">
                <el-select v-model="queryParams.militaryRank" placeholder="请选择" clearable :style="{ width: '100%' }">
                  <el-option v-for="dict in solderRankOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="queryParams.serviceReserve == 1">
              <el-form-item label="退役类别" prop="reserveStatus">
                <el-select v-model="queryParams.reserveStatus" placeholder="请选择退役类别" clearable :style="{ width: '100%' }">
                  <el-option v-for="dict in reserveStatusOptionsA" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-else>
              <el-form-item label="退役类别" prop="reserveStatus">
                <el-select v-model="queryParams.reserveStatus" placeholder="请选择退役类别" clearable :style="{ width: '100%' }">
                  <el-option v-for="dict in reserveStatusOptionsB" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table v-loading="loading" :data="staffBaseList">
          <el-table-column label="姓名" align="center" prop="name" />
          <el-table-column label="身份证" align="center" width="255" prop="idCard" />
          <el-table-column label="出生日期" align="center" prop="birthday" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.birthday, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="年龄" align="center" prop="age" />
          <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormat" />
          <el-table-column label="政治面貌" align="center" prop="politicalStatus" :formatter="politicalStatusFormat" width="120" show-overflow-tooltip />
          <el-table-column label="文化程度" align="center" prop="education" :formatter="educationFormat" />
          <el-table-column label="健康状况" align="center" prop="healthCondition" :formatter="healthConditionFormat" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-s-order" @click="handleUpdate(scope.row)" v-hasPermi="['soldier:staffBase:edit']">管理档案</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <!-- 添加或修改人员基础信息对话框 -->
        <el-dialog title="人员档案管理" :visible.sync="open" width="1400px" top="10px" append-to-body>
          <el-row :gutter="0">
            <el-col :span="15" style="margin: 5px; height: 88vh;box-shadow: 0px 1px 3px #e5e6e7;">
              <div class="header-box">档案信息：</div>
              <el-form ref="formData" :model="formData" :rules="rules" label-width="100px" size="mini">
                <el-col :span="8">
                  <el-form-item label="档案编号" prop="id" label-width="120px"></el-form-item>
                  <el-form-item label="档案托管单位" prop="name" label-width="120px">
                    <el-input v-model="formData.name" placeholder="请输入" clearable :style="{ width: '100%' }">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="第一类材料" prop="id" label-width="120px">
                      <div style="margin-bottom:10px;">请上传履历材料</div>
                      <div>
                          <el-upload :file-list="fieldList1" :action="fieldAction" :before-upload="fieldBeforeUpload" accept=".pdf" :on-preview="previewFunction" :on-success="successFunction1" :limit="1">
                          <el-tooltip class="item" effect="dark" content="入伍登记表" placement="bottom">
                            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                          </el-tooltip>
                        </el-upload>
                      </div>
                  </el-form-item>
                </el-col>
                <el-row class="el-row1" :gutter="80">
                  <el-col :span="6">
                    
                  </el-col>
                </el-row>
              </el-form>
            </el-col>
            <el-col :span="8" style="margin: 5px 30px 0px 0px; height: 100vh;">
              <div class="header_info" style="box-shadow: 0px 1px 3px #e5e6e7;margin-bottom:20px;">  
                  <div class="header-box">人员基础信息</div>
                  <div class="header-box-info" style="overflow: hidden;font-size:18px;">
                    <el-form ref="formData" :model="formData" :rules="rules" label-width="100px" size="mini">
                      <el-col :span="12">
                        <el-form-item label="姓名:" prop="id" label-width="120px">張三</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="身份证:" prop="id" label-width="120px">張三</el-form-item>
                      </el-col>
                       <el-col :span="12">
                        <el-form-item label="归属单位:" prop="id" label-width="120px">張三</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="出生日期:" prop="id" label-width="120px">張三</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="性别:" prop="id" label-width="120px">張三</el-form-item>
                      </el-col>
                       <el-col :span="12">
                        <el-form-item label="政治面貌:" prop="id" label-width="120px">張三</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="文化程度:" prop="id" label-width="120px">張三</el-form-item>
                      </el-col>
                       <el-col :span="12">
                        <el-form-item label="健康状况:" prop="id" label-width="120px">張三</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="人员类别:" prop="id" label-width="120px">張三</el-form-item>
                      </el-col>
                       <el-col :span="12">
                        <el-form-item label="退役类别:" prop="id" label-width="120px">張三</el-form-item>
                      </el-col>
                      
                    </el-form>
                  </div>
              </div>  
              <div class="header-always">
              <div class="header-box">文件预览</div>
                <el-card shadow="always">
                  <div style="height: 50vh">
                    <iframe width="100%" height="100%" :src="src" />
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  addStaffFile,
  getStaffFile,
  getProvince,
  getCity,
  getCounty,
  getTown,
  getVillage,
} from "@/api/soldier/staffFile";
import {
  listStaffBase,
  getStaffBaseFile,
  delStaffBase,
  addStaffBase,
  updateStaffBase,
  exportStaffBase,
  importTemplate,
} from "@/api/soldier/staffBase";
import {
  validateIDCard,
  validateMobile,
  validEmail,
} from "@/utils/validate.js";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";
import Cookies from "js-cookie"; //引用
import axios from "axios";
import { Message } from "element-ui";
export default {
  name: "StaffBase",
  components: {
    Treeselect,
  },
  data() {
    return {
      // 读卡按钮控制
      disavleOpen: false,
      disavleRead: true,
      disavleClose: true,
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,
      defaultProps: {
        children: "children",
        label: "label",
      },
      src: "", // pdf 文件路径
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 人员基础信息表格数据
      staffBaseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: true,
      // 性别字典
      sexOptions: [],
      // 政治面貌字典
      politicalStatusOptions: [],
      // 文化程度字典
      educationOptions: [],
      // 健康状况字典
      healthConditionOptions: [],
      // 伤残级别字典
      disabilityLevelOptions: [],
      // 职务字典
      jobOptions: [],
      // 技术特长字典
      technicalExpertiseOptions: [],
      // 学历字典
      educationBackgroundOptions: [],
      // 学位字典
      degreeOptions: [],
      // 所学专业字典
      majorOptions: [],
      // 毕业院校字典
      graduationSchoolOptions: [],
      // 系别字典
      departmentOptions: [],
      // 职业技能字典
      vocationSkillOptions: [],
      // 军衔字典
      militaryRankOptions: [],
      sergeantRankOptions: [],
      solderRankOptions: [],
      // 是否领取退伍金字典
      isReceiveVeteransMoneyOptions: [],
      // 服役军种字典
      militaryServiceOptions: [],
      // 入伍部队字典
      enlistmentArmyOptions: [],
      // 退役职级字典
      veteransLevelOptions: [],
      // 退役部队字典
      veteransArmyOptions: [],
      // 预备役身份类别字典
      reserveStatusOptionsA: [],
      reserveStatusOptionsB: [],
      // 服预备役类别字典
      serviceReserveOptions: [],
      // 安置单位类别字典
      unitOptions: [],
      // 安置单位类别下属类型字典
      unitTypeOptions: [],
      // 干部类型字典
      cadreTypeOptions: [],
      // 伤残类别
      disabilityNatureOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        idCard: null,
        birthday: null,
        beginAge: null,
        endAge: null,
        sex: null,
        politicalStatus: null,
        education: null,
        healthCondition: null,
        disabilityLevel: null,
        job: null,
        technicalExpertise: null,
        address: null,
        educationBackground: null,
        degree: null,
        major: null,
        graduationSchool: null,
        department: null,
        vocationSkill: null,
        telphone: null,
        postCode: null,
        nativePlace: null,
        enArmyBeforePlace: null,
        fatherName: null,
        motherName: null,
        spouseName: null,
        fatherUnit: null,
        motherUnit: null,
        spouseUnit: null,
        fatherJob: null,
        motherJob: null,
        spouseJob: null,
        militaryRank: null,
        veteransCertificate: null,
        isReceiveVeteransMoney: null,
        enlistmentTime: null,
        enlistmentPlace: null,
        militaryService: null,
        enlistmentArmy: null,
        veteransTime: null,
        veteransLevel: null,
        veteransArmy: null,
        reserveStatus: null,
        resettlementUnits: null,
        serviceReserve: null,
        reserveProfessionalName: null,
        location: null,
      },
      // 表单参数
      formData: {
        addrProvice: "",
        addrCity: "",
        addrCounty: "",
        addrTown: "",
        addrVillage: "",
        preferentialNum: "",
        name: "",
        idCard: "",
        birthday: "",
        sex: "",
        politicalStatus: "",
        education: "",
        healthCondition: "",
        disabilityLevel: "",
        job: "",
        technicalExpertise: "",
        address: "",
        educationBackground: "",
        degree: "",
        major: "",
        graduationSchool: "",
        department: "",
        vocationSkill: "",
        telphone: "",
        postCode: "",
        nativePlace: "",
        enArmyBeforePlace: "",
        fatherName: "",
        motherName: "",
        spouseName: "",
        fatherUnit: "",
        motherUnit: "",
        spouseUnit: "",
        fatherJob: "",
        motherJob: "",
        spouseJob: "",
        militaryRank: "",
        veteransCertificate: "",
        isReceiveVeteransMoney: "",
        enlistmentTime: "",
        enlistmentPlace: "",
        militaryService: "",
        enlistmentArmy: "",
        veteransTime: "",
        veteransLevel: "",
        veteransArmy: "",
        reserveStatus: "",
        resettlementUnits: "",
        serviceReserve: "",
        reserveProfessionalName: "",
        location: "",
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        idCard: [{
            required: true,
            message: "请输入",
            trigger: "change",
          },
          {
            validator: validateIDCard,
            message: "证件号码格式有误！",
            trigger: "blur",
          },
        ],
        birthday: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        sex: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        politicalStatus: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        education: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        healthCondition: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        disabilityLevel: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        job: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        technicalExpertise: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        address: [{
            required: true,
            message: "请输入",
            trigger: "change",
          },
          {
            min: 3,
            max: 64,
            message: "长度在 3 到 64 个字符",
            trigger: "blur",
          },
        ],
        educationBackground: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        degree: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        major: [{
            required: true,
            message: "请输入",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        graduationSchool: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        department: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        vocationSkill: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        telphone: [{
            required: true,
            message: "请输入",
            trigger: "blur",
          },
          {
            validator: validateMobile,
            message: "手机号格式有误！",
            trigger: "blur",
          },
        ],
        postCode: [{
            required: true,
            message: "请输入",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        nativePlace: [{
            required: true,
            message: "请输入入伍前户口所在地",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        enArmyBeforePlace: [{
            required: true,
            message: "请输入",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        fatherName: [{
            message: "请输入",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        motherName: [{
            message: "请输入职位",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        spouseName: [{
            message: "请输入",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        fatherUnit: [{
            message: "请输入",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        motherUnit: [{
            message: "请输入",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        spouseUnit: [{
            message: "请输入",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        fatherJob: [{
            message: "请输入",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        motherJob: [{
            message: "请输入",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        militaryRank: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        veteransCertificate: [{
          required: true,
          message: "请输入",
          trigger: "blur",
        }, ],
        isReceiveVeteransMoney: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        enlistmentTime: [{
            required: true,
            message: "请输入",
            trigger: "change",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        enlistmentPlace: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        militaryService: [{
          required: true,
          message: "请输入",
          trigger: "change",
        }, ],
        enlistmentArmy: [{
          required: true,
          message: "请输入",
          trigger: "blur",
        }, ],
        veteransTime: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        veteransLevel: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        veteransArmy: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        reserveStatus: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        resettlementUnits: [{
            message: "请输入",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        serviceReserve: [{
          required: true,
          message: "请选择",
          trigger: "change",
        }, ],
        reserveProfessionalName: [{
            message: "请输入",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
        location: [{
            message: "请输入",
            trigger: "blur",
          },
          {
            min: 1,
            max: 64,
            message: "长度在 1 到 64 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getDicts("sys_user_sex").then((response) => {
      this.sexOptions = response.data;
    });
    this.getDicts("tw_political_status").then((response) => {
      this.politicalStatusOptions = response.data;
    });
    this.getDicts("tw_educational_background").then((response) => {
      this.educationOptions = response.data;
    });
    this.getDicts("tw_health").then((response) => {
      this.healthConditionOptions = response.data;
    });
    this.getDicts("tw_disability_level ").then((response) => {
      this.disabilityLevelOptions = response.data;
    });
    this.getDicts("tw_job").then((response) => {
      this.jobOptions = response.data;
    });
    this.getDicts("tw_skill").then((response) => {
      this.technicalExpertiseOptions = response.data;
    });
    this.getDicts("tw_educational_background").then((response) => {
      this.educationBackgroundOptions = response.data;
    });
    this.getDicts("tw_degree").then((response) => {
      this.degreeOptions = response.data;
    });
    this.getDicts("tw_major").then((response) => {
      this.majorOptions = response.data;
    });
    this.getDicts("tw_graduate_institutions").then((response) => {
      this.graduationSchoolOptions = response.data;
    });
    this.getDicts("tw_department").then((response) => {
      this.departmentOptions = response.data;
    });
    this.getDicts("tw_job_skill").then((response) => {
      this.vocationSkillOptions = response.data;
    });
    this.getDicts("tw_military_rank").then((response) => {
      this.militaryRankOptions = response.data;
    });
    this.getDicts("tw_sergeant_rank").then((response) => {
      this.sergeantRankOptions = response.data;
    });
    this.getDicts("tw_solder_rank").then((response) => {
      this.solderRankOptions = response.data;
    });
    this.getDicts("tw_is_receive_money").then((response) => {
      this.isReceiveVeteransMoneyOptions = response.data;
    });
    this.getDicts("tw_services").then((response) => {
      this.militaryServiceOptions = response.data;
    });
    this.getDicts("tw_army").then((response) => {
      this.enlistmentArmyOptions = response.data;
    });
    this.getDicts("tw_retired_rank").then((response) => {
      this.veteransLevelOptions = response.data;
    });
    this.getDicts("tw_army").then((response) => {
      this.veteransArmyOptions = response.data;
    });
    this.getDicts("tw_retire_type").then((response) => {
      this.reserveStatusOptionsA = response.data;
    });
    this.getDicts("tw_soldier_retire_type").then((response) => {
      this.reserveStatusOptionsB = response.data;
    });
    this.getDicts("tw_category").then((response) => {
      this.serviceReserveOptions = response.data;
    });
    this.getDicts("tw_place_unit").then((response) => {
      this.unitOptions = response.data;
    });
    this.getDicts("tw_place_unit_type").then((response) => {
      this.unitTypeOptions = response.data;
    });
    this.getDicts("tw_cadre_type").then((response) => {
      this.cadreTypeOptions = response.data;
    });
    this.getDicts("tw_disability_nature").then((response) => {
      this.disabilityNatureOptions = response.data;
    });
  },
  methods: {
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const staffId = row.staffId;
      getStaffBaseFile(staffId).then((response) => {
        console.log(response)
        this.open = true;
      });
    },
    /** 查询人员基础信息列表 */
    getList() {
      this.loading = true;
      listStaffBase(this.queryParams).then((response) => {
        this.staffBaseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
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
    // 军衔字典翻译干部
    militaryRankFormat(row, column) {
      return this.selectDictLabel(this.militaryRankOptions, row.militaryRank);
    },
    // 军衔字典翻译士官
    militaryRankFormat(row, column) {
      return this.selectDictLabel(this.sergeantRankOptions, row.militaryRank);
    },
    // 军衔字典翻译士兵
    militaryRankFormat(row, column) {
      return this.selectDictLabel(this.solderRankOptions, row.militaryRank);
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
    reserveStatusFormatA(row, column) {
      return this.selectDictLabel(
        this.reserveStatusOptionsA,
        row.reserveStatus
      );
    },
    // 预备役身份类别字典翻译
    reserveStatusFormatB(row, column) {
      return this.selectDictLabel(
        this.reserveStatusOptionsB,
        row.reserveStatus
      );
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
      this.formData = {
        serviceReserve: null,
        ganbuType: null,
        staffId: null,
        name: null,
        idCard: null,
        birthday: null,
        sex: null,
        politicalStatus: null,
        education: null,
        healthCondition: null,
        disabilityLevel: null,
        job: null,
        technicalExpertise: null,
        address: null,
        educationBackground: null,
        degree: null,
        major: null,
        graduationSchool: null,
        department: null,
        vocationSkill: null,
        telphone: null,
        postCode: null,
        nativePlace: null,
        enArmyBeforePlace: null,
        fatherName: null,
        motherName: null,
        spouseName: null,
        fatherUnit: null,
        motherUnit: null,
        spouseUnit: null,
        fatherJob: null,
        motherJob: null,
        spouseJob: null,
        militaryRank: null,
        veteransCertificate: null,
        isReceiveVeteransMoney: null,
        enlistmentTime: null,
        enlistmentPlace: null,
        militaryService: null,
        enlistmentArmy: null,
        veteransTime: null,
        veteransLevel: null,
        veteransArmy: null,
        reserveStatus: null,
        resettlementUnits: null,
        serviceReserve: null,
        reserveProfessionalName: null,
        location: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      };
      this.resetForm("formData");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      if (this.queryParams.beginAge && this.queryParams.endAge) {
        if (this.queryParams.beginAge >= this.queryParams.endAge) {
          return Message.error("请输入正确的年龄范围");
        }
      }
      if (this.queryParams.idCard) {
        const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (!reg.test(this.queryParams.idCard)) {
          return Message.error("身份证号码格式错误");
        }
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  },
};

</script>
<style scoped>
/deep/ .el-input.is-disabled .el-input__inner {
  color: #606266;
}

.el-col {
  height: 50px;
}

.header-box {
  margin: 0px;
  margin-bottom: 18px;
  font-size: 18px;
  padding: 10px;
  color: #303133;
  background: #e5e6e7;
}
</style>
