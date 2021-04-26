<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="机构名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入机构名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属行业" prop="trade">
        <el-select v-model="queryParams.trade" placeholder="请选择所属行业" clearable size="small">
          <el-option
            v-for="dict in tradeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="机构类别" prop="classify">
        <el-select v-model="queryParams.classify" placeholder="请选择机构类别" clearable size="small">
          <el-option
            v-for="dict in classifyOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="机构级别" prop="level">
        <el-select v-model="queryParams.level" placeholder="请选择机构级别" clearable size="small">
          <el-option
            v-for="dict in levelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="机构状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择机构状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['soldier:trainOrganization:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['soldier:trainOrganization:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['soldier:trainOrganization:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['soldier:trainOrganization:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="trainOrganizationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="机构名称" align="center" prop="name" />
      <el-table-column label="所属行业" align="center" prop="trade" :formatter="tradeFormat" />
      <el-table-column label="机构类别" align="center" prop="classify" :formatter="classifyFormat" />
      <el-table-column label="机构级别" align="center" prop="level" :formatter="levelFormat" />
      <el-table-column label="机构状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['soldier:trainOrganization:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['soldier:trainOrganization:remove']"
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

    <!-- 添加或修改培训机构管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="所属行业" prop="trade">
          <el-select v-model="form.trade" placeholder="请选择所属行业">
            <el-option
              v-for="dict in tradeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构类别" prop="classify">
          <el-select v-model="form.classify" placeholder="请选择机构类别">
            <el-option
              v-for="dict in classifyOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构级别" prop="level">
          <el-select v-model="form.level" placeholder="请选择机构级别">
            <el-option
              v-for="dict in levelOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择机构状态">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
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
import { listTrainOrganization, getTrainOrganization, delTrainOrganization, addTrainOrganization, updateTrainOrganization, exportTrainOrganization } from "@/api/soldier/trainOrganization";

export default {
  name: "TrainOrganization",
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
      // 培训机构管理表格数据
      trainOrganizationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 所属行业字典
      tradeOptions: [],
      // 机构类别字典
      classifyOptions: [],
      // 机构级别字典
      levelOptions: [],
      // 机构状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        trade: null,
        classify: null,
        level: null,
        status: null,
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
    this.getDicts("tw_trade").then(response => {
      this.tradeOptions = response.data;
    });
    this.getDicts("tw_organization_type").then(response => {
      this.classifyOptions = response.data;
    });
    this.getDicts("tw_organization_level").then(response => {
      this.levelOptions = response.data;
    });
    this.getDicts("tw_organization_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询培训机构管理列表 */
    getList() {
      this.loading = true;
      listTrainOrganization(this.queryParams).then(response => {
        this.trainOrganizationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 所属行业字典翻译
    tradeFormat(row, column) {
      return this.selectDictLabel(this.tradeOptions, row.trade);
    },
    // 机构类别字典翻译
    classifyFormat(row, column) {
      return this.selectDictLabel(this.classifyOptions, row.classify);
    },
    // 机构级别字典翻译
    levelFormat(row, column) {
      return this.selectDictLabel(this.levelOptions, row.level);
    },
    // 机构状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        trainOrganizationId: null,
        name: null,
        trade: null,
        classify: null,
        level: null,
        status: null,
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
      this.ids = selection.map(item => item.trainOrganizationId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加培训机构管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const trainOrganizationId = row.trainOrganizationId || this.ids
      getTrainOrganization(trainOrganizationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改培训机构管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.trainOrganizationId != null) {
            updateTrainOrganization(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTrainOrganization(this.form).then(response => {
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
      const trainOrganizationIds = row.trainOrganizationId || this.ids;
      this.$confirm('是否确认删除培训机构管理编号为"' + trainOrganizationIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTrainOrganization(trainOrganizationIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有培训机构管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTrainOrganization(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
