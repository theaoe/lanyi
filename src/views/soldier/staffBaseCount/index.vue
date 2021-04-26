<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证" prop="idCard">
        <el-input
          v-model="queryParams.idCard"
          placeholder="请输入身份证"
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
      <el-form-item label="政治面貌" prop="politicalStatus">
        <el-select
          v-model="queryParams.politicalStatus"
          placeholder="请选择政治面貌"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in politicalStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文化程度" prop="education">
        <el-select
          v-model="queryParams.education"
          placeholder="请选择文化程度"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in educationOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="健康状况" prop="healthCondition">
        <el-select
          v-model="queryParams.healthCondition"
          placeholder="请选择健康状况"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in healthConditionOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="伤残级别" prop="disabilityLevel">
        <el-select
          v-model="queryParams.disabilityLevel"
          placeholder="请选择伤残级别"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in disabilityLevelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['soldier:staffBase:export']"
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
      :data="staffBaseList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column
        label="身份证"
        align="center"
        width="255"
        prop="idCard"
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
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column
        label="性别"
        align="center"
        prop="sex"
        :formatter="sexFormat"
      />
      <el-table-column
        label="政治面貌"
        align="center"
        prop="politicalStatus"
        :formatter="politicalStatusFormat"
      />
      <el-table-column
        label="文化程度"
        align="center"
        prop="education"
        :formatter="educationFormat"
      />
      <el-table-column
        label="健康状况"
        align="center"
        prop="healthCondition"
        :formatter="healthConditionFormat"
      />
      <el-table-column
        label="伤残级别"
        align="center"
        prop="disabilityLevel"
        :formatter="disabilityLevelFormat"
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
            icon="el-icon-document"
            @click="handleDetails(scope.row)"
            v-hasPermi="['soldier:staffBase:details']"
            >详情</el-button
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

    <!-- 添加或修改人员基础信息对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1400px"
      append-to-body
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        size="mini"
        label-width="82px"
        label-position="right"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别" prop="sex">
              <el-select
                v-model="formData.sex"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证" prop="idCard">
              <el-input
                v-model="formData.idCard"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="formData.birthday"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :style="{ width: '100%' }"
                placeholder="请选择"
                clearable
                :readonly="detailsDis"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="政治面貌" prop="politicalStatus">
              <el-select
                v-model="formData.politicalStatus"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in politicalStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="文化程度" prop="education">
              <el-select
                v-model="formData.education"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in educationOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="健康状况" prop="healthCondition">
              <el-select
                v-model="formData.healthCondition"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in healthConditionOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="伤残级别" prop="disabilityLevel">
              <el-select
                v-model="formData.disabilityLevel"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in disabilityLevelOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="职务" prop="job">
              <el-select
                v-model="formData.job"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in jobOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="技术特长" prop="technicalExpertise">
              <el-select
                v-model="formData.technicalExpertise"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in technicalExpertiseOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="现住址" prop="address">
              <el-input
                v-model="formData.address"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学历" prop="educationBackground">
              <el-select
                v-model="formData.educationBackground"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in educationBackgroundOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学位" prop="degree">
              <el-select
                v-model="formData.degree"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in degreeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="系别" prop="department">
              <el-select
                v-model="formData.department"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in departmentOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所学专业" prop="major">
              <el-input
                v-model="formData.major"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="职业技能" prop="vocationSkill">
              <el-select
                v-model="formData.vocationSkill"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in vocationSkillOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="毕业院校" prop="graduationSchool">
              <el-input
                v-model="formData.graduationSchool"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系方式" prop="telphone">
              <el-input
                v-model="formData.telphone"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="邮政编码" prop="postCode">
              <el-input
                v-model="formData.postCode"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="籍贯" prop="nativePlace">
              <el-input
                v-model="formData.nativePlace"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="户口" prop="enArmyBeforePlace">
              <el-input
                v-model="formData.enArmyBeforePlace"
                placeholder="请输入入伍前户口所在地"
                show-word-limit
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="父亲" prop="fatherName">
              <el-input
                v-model="formData.fatherName"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="所在单位" prop="fatherUnit">
              <el-input
                v-model="formData.fatherUnit"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="职位" prop="fatherJob">
              <el-input
                v-model="formData.fatherJob"
                placeholder="请输入职位"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="母亲" prop="motherName">
              <el-input
                v-model="formData.motherName"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="所在单位" prop="motherUnit">
              <el-input
                v-model="formData.motherUnit"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="职位" prop="motherJob">
              <el-input
                v-model="formData.motherJob"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="配偶" prop="spouseName">
              <el-input
                v-model="formData.spouseName"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="所在单位" prop="spouseUnit">
              <el-input
                v-model="formData.spouseUnit"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="职位" prop="spouseJob">
              <el-input
                v-model="formData.spouseJob"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="军衔" prop="militaryRank">
              <el-select
                v-model="formData.militaryRank"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in militaryRankOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退伍证号" prop="veteransCertificate">
              <el-input
                v-model="formData.veteransCertificate"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="领退伍金" prop="isReceiveVeteransMoney">
              <el-select
                v-model="formData.isReceiveVeteransMoney"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in isReceiveVeteransMoneyOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入伍时间" prop="enlistmentTime">
              <el-date-picker
                v-model="formData.enlistmentTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :style="{ width: '100%' }"
                placeholder="请选择"
                clearable
                :readonly="detailsDis"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入伍地点" prop="enlistmentPlace">
              <el-input
                v-model="formData.enlistmentPlace"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="服役军种" prop="militaryService">
              <el-select
                v-model="formData.militaryService"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in militaryServiceOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入伍部队" prop="enlistmentArmy">
              <el-input
                v-model="formData.enlistmentArmy"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退役时间" prop="veteransTime">
              <el-date-picker
                v-model="formData.veteransTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :style="{ width: '100%' }"
                placeholder="请选择"
                clearable
                :readonly="detailsDis"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退役职级" prop="veteransLevel">
              <el-select
                v-model="formData.veteransLevel"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in veteransLevelOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                  :readonly="detailsDis"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退役部队" prop="veteransArmy">
              <el-input
                v-model="formData.veteransArmy"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类别" prop="serviceReserve">
              <el-select
                v-model="formData.serviceReserve"
                placeholder="请选择预备役类别"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in serviceReserveOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份类别" prop="reserveStatus">
              <el-select
                v-model="formData.reserveStatus"
                placeholder="请选择预备役身份身份类别"
                clearable
                :style="{ width: '100%' }"
                :disabled="detailsDis"
              >
                <el-option
                  v-for="dict in reserveStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="安置单位" prop="resettlementUnits">
              <el-input
                v-model="formData.resettlementUnits"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="专业名称" prop="reserveProfessionalName">
              <el-input
                v-model="formData.reserveProfessionalName"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="安置地" prop="location">
              <el-input
                v-model="formData.location"
                placeholder="请输入"
                clearable
                :style="{ width: '100%' }"
                :readonly="detailsDis"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="detailsDis == false">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listStaffBase,
  getStaffBase,
  delStaffBase,
  addStaffBase,
  updateStaffBase,
  exportStaffBase,
} from "@/api/soldier/staffBase";
import { validateIDCard, validateMobile, validEmail} from "@/utils/validate.js";
export default {
  name: "StaffBase",
  components: {},
  data() {
    return {
      detailsDis: false,
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
      // 人员基础信息表格数据
      staffBaseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
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
      reserveStatusOptions: [],
      // 服预备役类别字典
      serviceReserveOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
      },
      // 表单参数
      formData: {
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
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        idCard: [
          {
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
        birthday: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        sex: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        politicalStatus: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        education: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        healthCondition: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        disabilityLevel: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        job: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        technicalExpertise: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
          { max: 64, message: "长度在64个字符", trigger: "blur" },
        ],
        address: [
          {
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
        educationBackground: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        degree: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        major: [
          {
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
        graduationSchool: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        department: [
          {
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
        vocationSkill: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        telphone: [
          {
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
        postCode: [
          {
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
        nativePlace: [
          {
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
        enArmyBeforePlace: [
          {
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
        fatherName: [
          {
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
        motherName: [
          {
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
        spouseName: [
          {
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
        fatherUnit: [
          {
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
        motherUnit: [
          {
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
        spouseUnit: [
          {
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
        fatherJob: [
          {
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
        motherJob: [
          {
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
        spouseJob: [
          {
            message: "请选择",
            trigger: "change",
          },
        ],
        militaryRank: [
          {
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
        veteransCertificate: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        isReceiveVeteransMoney: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        enlistmentTime: [
          {
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
        enlistmentPlace: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        militaryService: [
          {
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
        enlistmentArmy: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        veteransTime: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        veteransLevel: [
          {
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
        veteransArmy: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        reserveStatus: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        resettlementUnits: [
          {
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
        serviceReserve: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        reserveProfessionalName: [
          {
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
        location: [
          {
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
    this.getDicts("tw_rank").then((response) => {
      this.militaryRankOptions = response.data;
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
    this.getDicts("tw_reserve_category").then((response) => {
      this.reserveStatusOptions = response.data;
    });
    this.getDicts("tw_reserve_category").then((response) => {
      this.serviceReserveOptions = response.data;
    });
  },
  methods: {
    /** 查询人员基础信息列表 */
    getList() {
      this.loading = true;
      listStaffBase(this.queryParams).then((response) => {
        this.staffBaseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
      this.formData = {
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.staffId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加人员基础信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const staffId = row.staffId || this.ids;
      getStaffBase(staffId).then((response) => {
        this.formData = response.data;
        this.open = true;
        this.title = "修改人员基础信息";
      });
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      this.reset();
      const staffId = row.staffId || this.ids;
      getStaffBase(staffId).then((response) => {
        this.formData = response.data;
        this.open = true;
        this.title = "详情";
        this.detailsDis = true;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["formData"].validate((valid) => {
        if (valid) {
          if (this.formData.staffId != null) {
            updateStaffBase(this.formData).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStaffBase(this.formData).then((response) => {
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
      const staffIds = row.staffId || this.ids;
      this.$confirm(
        '是否确认删除人员基础信息编号为"' + staffIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delStaffBase(staffIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有人员基础信息数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportStaffBase(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
<style scoped>
/deep/ .el-input.is-disabled .el-input__inner {
  color: #606266;
}
</style>