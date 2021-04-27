<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="110px"
    >
      <el-form-item label="人员姓名" prop="staffId">
        <el-select
          v-model="queryParams.staffId"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in idCardList"
            :key="item.staffId"
            :label="item.name"
            :value="item.staffId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="家庭成员姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入家庭成员姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select
          v-model="queryParams.sex"
          placeholder="请选择性别"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in sexOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="家庭成员身份证" prop="idCard">
        <el-input
          v-model="queryParams.idCard"
          placeholder="请输入身份证"
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
          v-hasPermi="['soldier:staffFamily:add']"
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
          v-hasPermi="['soldier:staffFamily:edit']"
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
          v-hasPermi="['soldier:staffFamily:remove']"
          >删除</el-button
        >
      </el-col>
     <!--  <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['soldier:staffFamily:export']"
          >导出</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="staffFamilyList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="人员姓名" align="center" prop="staffName" />
      <el-table-column label="人员身份证" align="center" prop="staffIdCard" />
      <el-table-column label="家庭成员姓名" align="center" prop="name" />
      <el-table-column
        label="性别"
        align="center"
        prop="sex"
        :formatter="sexFormat"
      />
      <el-table-column
        label="出生日期"
        align="center"
        prop="birthday"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.birthday, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家庭成员身份证" align="center" prop="idCard" />
      <el-table-column label="所在单位" align="center" prop="unit" />
      <el-table-column label="职位" align="center" prop="job" />
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
            v-hasPermi="['soldier:staffFamily:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['soldier:staffFamily:remove']"
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

    <!-- 添加或修改人员家庭成员信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="人员姓名" prop="staffId">
          <el-select v-model="form.staffId" filterable placeholder="请选择">
            <el-option
              v-for="item in idCardList"
              :key="item.staffId"
              :label="item.name + ' - ' +  item.idCard"
              :value="item.staffId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="家庭成员姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入家庭成员姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option
              v-for="dict in sexOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            clearable
            size="small"
            style="width: 100%"
            v-model="form.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择出生日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证" />
        </el-form-item>
        <el-form-item label="所在单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入所在单位" />
        </el-form-item>
        <el-form-item label="单位职位" prop="job">
          <el-input v-model="form.job" placeholder="请输入职位" />
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
  listStaffFamily,
  getStaffFamily,
  delStaffFamily,
  addStaffFamily,
  updateStaffFamily,
  exportStaffFamily,
} from "@/api/soldier/staffFamily";
import { listStaffBase } from "@/api/soldier/staffBase";
import { validateIDCard } from '@/utils/validate.js'
export default {
  name: "StaffFamily",
  components: {},
  data() {
    return {
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
      // 人员家庭成员信息表格数据
      staffFamilyList: [],
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
        staffId:null,
        name: null,
        sex: null,
        birthday: null,
        idCard: null,
        unit: null,
        job: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        staffId: [{ required: true, message: "请选择人员", trigger: "change" }],
        name: [
          { required: true, message: "请输入家庭成员姓名", trigger: "blur" },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        sex: [{ required: true, message: "请选择姓别", trigger: "change" }],
        idCard: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          {
            validator: validateIDCard,
            message: "证件号码格式有误！",
            trigger: "blur",
          },
        ],
        birthday: [
          { required: true, message: "请选择出生日期", trigger: "change" },
        ],
        // unit: [{ required: true, message: "请输入所在单位", trigger: "blur" }],
        // job: [{ required: true, message: "请输入职位", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_user_sex").then((response) => {
      this.sexOptions = response.data;
    });
    this.getUserList();
  },
  methods: {
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
    /** 查询人员家庭成员信息列表 */
    getList() {
      this.loading = true;
      listStaffFamily(this.queryParams).then((response) => {
        this.staffFamilyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 性别字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        staffFamilyId: null,
        staffId: null,
        name: null,
        sex: null,
        birthday: null,
        idCard: null,
        unit: null,
        job: null,
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
      this.ids = selection.map((item) => item.staffFamilyId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加人员家庭成员信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const staffFamilyId = row.staffFamilyId || this.ids;
      getStaffFamily(staffFamilyId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改人员家庭成员信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.staffFamilyId != null) {
            updateStaffFamily(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStaffFamily(this.form).then((response) => {
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
      const staffFamilyIds = row.staffFamilyId || this.ids;
      this.$confirm(
        '是否确认删除人员家庭成员信息编号为"' + staffFamilyIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delStaffFamily(staffFamilyIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有人员家庭成员信息数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportStaffFamily(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
<style  scoped>
.el-select {
  width: 100%;
}
</style>