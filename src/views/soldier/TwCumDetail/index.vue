<template>
  <div class="app-container">
    <el-row :gutter="40" height="100%">
      <el-col :span="4">
        <!-- <el-card> -->
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入方案名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="block">
          <el-tree
            :data="moduleList"
            :props="defaultProps"
            node-key="id"
            @node-click="handleNodeClick"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="nodeTitle">{{ node.label }}</span>
              <span class="nodeBtn">
                <el-button
                  v-if="node.id == 1"
                  type="text"
                  size="mini"
                  icon="el-icon-plus"
                  @click="() => append(data)"
                >
                </el-button>
                <el-button
                  v-if="node.id != 1"
                  type="text"
                  size="mini"
                  icon="el-icon-edit"
                  @click="() => editProgramme(node, data)"
                >
                </el-button>
                <el-button
                  v-if="node.id != 1"
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  @click="() => remove(node, data)"
                >
                </el-button>
              </span>
            </span>
            ></el-tree
          >
          <pagination
            v-show="moduleTotal > 0"
            :total="moduleTotal"
            :page.sync="queryModule.pageNum"
            :limit.sync="queryModule.pageSize"
            layout="total, prev, next"
            :background="false"
            @pagination="getProgrammeList"
          />
        </div>
        <!-- </el-card> -->
      </el-col>
      <el-col :span="20">
        <!-- <el-card> -->
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="表名称" prop="tableName">
            <el-select
              v-model="queryParams.tableName"
              placeholder="请选择表名"
              @change="getCumNameList"
              clearable
            >
              <el-option
                v-for="item in tableNameList"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段名称" prop="cumName">
            <el-select
              v-model="queryParams.cumName"
              placeholder="请选择字段名"
              @change="getCumName"
              clearable
            >
              <el-option
                v-for="item in cumNameList"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
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
              :disabled="isSelecdtId"
              @click="handleAdd"
              v-hasPermi="['soldier:TwCumDetail:add']"
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
              v-hasPermi="['soldier:TwCumDetail:edit']"
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
              v-hasPermi="['soldier:TwCumDetail:remove']"
              >删除</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['soldier:TwCumDetail:export']"
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
          :data="TwCumDetailList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="条件类型" align="center" prop="id" />
          <el-table-column
            label="表名称"
            align="center"
            prop="tableName"
            :formatter="tableNameFormat"
          />
          <el-table-column label="字段名称" align="center" prop="cumRemark" />
          <el-table-column label="条件值" align="center" prop="cumValue" />
          <el-table-column
            label="条件类型"
            align="center"
            prop="cumType"
            :formatter="cumTypeFormat"
          />
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
                v-hasPermi="['soldier:TwCumDetail:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['soldier:TwCumDetail:remove']"
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
        <!-- </el-card> -->
      </el-col>
    </el-row>

    <!-- 添加或修改筛查方案管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="表名称" prop="tableName">
          <el-select
            v-model="form.tableName"
            placeholder="请选择表名"
            @change="getCumNameList"
          >
            <el-option
              v-for="item in tableNameList"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段名称" prop="cumName">
          <el-select
            v-model="form.cumName"
            placeholder="请选择字段名"
            clearable
            @change="getCumName"
          >
            <el-option
              v-for="item in cumNameList"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="条件值" prop="cumValue">
          <el-input v-model="form.cumValue" placeholder="请输入条件值" />
        </el-form-item>
        <el-form-item label="条件类型" prop="cumType">
          <el-select v-model="form.cumType" placeholder="请选择条件类型">
            <el-option label="=（等于）" value="=" />
            <el-option label="!=（不等于）" value="!=" />
            <el-option label=">（大于）" value=">" />
            <el-option label=">=（大于等于）" value=">=" />
            <el-option label="<（小于）" value="<" />
            <el-option label="<=（小于等于）" value="<=" />
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
  listTwCumDetail,
  getTwCumDetail,
  delTwCumDetail,
  addTwCumDetail,
  updateTwCumDetail,
  exportTwCumDetail,
} from "@/api/soldier/TwCumDetail";
import {
  listModule,
  getModule,
  delModule,
  addModule,
  updateModule,
  exportModule,
} from "@/api/soldier/module";

import { listData } from "@/api/system/dict/data";
export default {
  name: "TwCumDetail",
  components: {},
  data() {
    return {
      // 表名称字典
      // 表名列表
      tableNameList: [
        {
          label: "人员基础信息表",
          value: "tw_staff_base",
          key: 1,
        },
        {
          label: "优抚信息管理表",
          value: "tw_placate_info",
          key: 2,
        },
        {
          label: "培训报名表",
          value: "tw_train_enroll",
          key: 3,
        },
        {
          label: "安置人员管理表",
          value: "tw_aftercare_persion",
          key: 4,
        },
      ],
      // 字段名列表
      cumNameList: [],
      // 筛选树结构 数据
      // 是否选中方案
      isSelecdtId: true,
      // 节点名称
      deptName: undefined,
      // 方案id
      programmeId: null,
      moduleList: [
        {
          label: "方案列表",
          children: [],
          id: 0,
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
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
      moduleTotal: 0,
      // 筛查方案管理表格数据
      TwCumDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        moduleId: undefined,
        tableName: null,
        cumName: null,
        cumValue: null,
        cumType: null,
      },
      // 查询参数
      queryModule: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        isUse: null,
        description: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        tableName: [
          { required: true, message: "请选择表名称", trigger: "change" },
        ],
        cumName: [
          { required: true, message: "请选择表名称", trigger: "change" },
        ],
        cumValue: [
          { required: true, message: "请输入条件值", trigger: "blur" },
        ],
        cumType: [
          { required: true, message: "请选择表名称", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    // this.getList();
    this.getProgrammeList();
    // this.getDicts('')
  },
  methods: {
    // 表名称字典翻译
    tableNameFormat(row, column) {
      let lable = "";
      switch (row.tableName) {
        case "tw_staff_base":
          lable = "人员基础信息表";
          break;
        case "tw_placate_info":
          lable = "优抚信息管理表";
          break;
        case "tw_train_enroll":
          lable = "培训报名表";
          break;
        case "tw_aftercare_persion":
          lable = "安置人员管理表";
          break;
        default:
          break;
      }
      return lable;
    },
    cumTypeFormat(row, column) {
      let lable = "";
      switch (row.cumType) {
        case "=":
          lable = "等于";
          break;
        case "!=":
          lable = "不等于";
          break;
        case ">":
          lable = "大于";
          break;
        case ">=":
          lable = "大于等于";
          break;
        case "<":
          lable = "小于";
          break;
        case "<=":
          lable = "小于等于";
          break;
        default:
          break;
      }
      return lable;
    },
    // 根据表名出现对应的字段名
    getCumNameList(value) {
      console.log(value);
      let params = {
        dictType: value,
      };
      listData(params)
        .then((res) => {
          console.log(res);
          this.cumNameList = res.rows;
        })
        .catch((err) => {});
    },
    getCumName(value) {
      let obj = {};
      this.cumNameList.map((item) => {
        if (item.dictValue == value) {
          obj.dictLabel = item.dictLabel;
        }
      });
      console.log(obj);
      this.form.cumRemark = obj.dictLabel;
      // console.log(this.form)
    },
    getProgrammeList() {
      this.loading = true;
      listModule(this.queryModule).then((response) => {
        let arrList = response.rows;
        arrList.forEach((item) => {
          item.label = item.name;
        });
        console.log(arrList);
        this.moduleList[0].children = arrList;
        this.moduleTotal = response.total;
        this.loading = false;
      });
    },
    // 树结构点击事件
    handleNodeClick(data) {
      console.log(data);
      this.programmeId = data.id;
      this.queryParams.moduleId = data.id;
      if (data.label == "方案列表") {
        this.isSelecdtId = true;
      } else {
        this.isSelecdtId = false;
      }
      this.getList();
    },
    // 筛选节点
    filterNode(value, data) {
      console.log(value, +"+" + data);
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //添加方案
    append(data) {
      this.$prompt("请输入新增方案名称名称", "添加方案", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          let formDate = {
            name: value,
            isUse: 1,
          };
          addModule(formDate).then((response) => {
            this.$message({
              type: "success",
              message: "新增方案: " + value,
            });
            this.getProgrammeList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    // 编辑方案
    editProgramme(node, data) {
      console.log(data);
      this.$prompt("修改方案名称", "修改方案", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: data.label,
      })
        .then(({ value }) => {
          let formDate = {
            id: data.id,
            name: value,
          };
          updateModule(formDate).then((response) => {
            this.$message({
              type: "success",
              message: "修改方案: " + value + "成功",
            });
            this.getProgrammeList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    // 删除方案
    remove(node, data) {
      console.log(data, "删除", node);
      this.$confirm("此操作将永久删除该方案, 是否继续?", "删除方案", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let id = data.id;
          delModule(id)
            .then((res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getProgrammeList();
            })
            .catch((err) => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /** 查询筛查方案管理列表 */
    getList() {
      this.loading = true;
      listTwCumDetail(this.queryParams).then((response) => {
        this.TwCumDetailList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.resetForm("form");
      this.cumNameList = [];
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        moduleId: null,
        tableName: null,
        cumName: null,
        cumValue: null,
        cumType: null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加筛查方案管理";
      this.resetForm("form");
      this.cumNameList = [];
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getTwCumDetail(id).then((response) => {
        console.log(response);
        this.form = response.data;
        switch (this.form.cumType) {
          case "=":
            this.form.cumType = "=";
            break;
          case "!=":
            this.form.cumType = "!=";
            break;
          case "&gt;":
            this.form.cumType = ">";
            break;
          case "&gt;=":
            this.form.cumType = ">=";
            break;
          case "&lt;":
            this.form.cumType = "<";
            break;
          case "&lt;=":
            this.form.cumType = "<=";
            break;
          default:
            break;
        }
        let params = {
          dictType: this.form.tableName,
        };
        listData(params)
          .then((res) => {
            console.log(res);
            this.cumNameList = res.rows;
          })
          .catch((err) => {});
        this.open = true;
        this.title = "修改筛查方案管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.moduleId = this.programmeId;
          if (this.form.id != null) {
            updateTwCumDetail(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTwCumDetail(this.form).then((response) => {
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
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除筛查方案管理编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTwCumDetail(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    // handleExport() {
    //   const queryParams = this.queryParams;
    //   this.$confirm("是否确认导出所有筛查方案管理数据项?", "警告", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(function () {
    //       return exportTwCumDetail(queryParams);
    //     })
    //     .then((response) => {
    //       this.download(response.msg);
    //     });
    // },
  },
};
</script>
<style scoped>
.custom-tree-node {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-select {
  width: 100%;
}
.nodeTitle {
  width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nodeBtn{
  position: absolute;
  right: 0;
}
</style>
