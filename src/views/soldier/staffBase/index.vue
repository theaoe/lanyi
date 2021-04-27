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
            <!-- <el-col :span="6">
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
            </el-col> -->
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
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['soldier:staffBase:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['soldier:staffBase:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['soldier:staffBase:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" icon="el-icon-upload" size="mini" @click="handleExport" v-hasPermi="['soldier:staffBase:export']">导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-tooltip class="item" effect="dark" content="导入前请先下载模板，按照模板导入用户基础信息" placement="bottom">
              <el-button type="primary" icon="el-icon-download" size="mini" @click="handleImport" v-hasPermi="['system:user:import']">导入</el-button>
            </el-tooltip>
          </el-col>
          <el-col :span="1.5">
            <!-- <el-button
              type="info"
              icon="el-icon-download"
              size="mini"
              @click="importTemplate"
              >模板</el-button
            > -->
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="staffBaseList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
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
          <!-- <el-table-column
            label="伤残级别"
            align="center"
            prop="disabilityLevel"
            :formatter="disabilityLevelFormat"
          /> -->
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['soldier:staffBase:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-document" @click="handleDetails(scope.row)" v-hasPermi="['soldier:staffBase:details']">详情</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['soldier:staffBase:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <!-- 添加或修改人员基础信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="1400px" top="10px" append-to-body>
          <el-form ref="formData" :model="formData" :rules="rules" size="mini" label-width="100px" label-position="right">
            <!--  <el-row
              :gutter="10"
              type="flex"
              justify="space-around"
              v-if="!detailsDis"
            >
              <el-button
                type="success"
                icon="el-icon-check"
                @click="openDevice"
                :disabled="disavleOpen"
                >连接读卡设备</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-full-screen"
                @click="readCard"
                :disabled="disavleRead"
                >读卡</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-switch-button"
                @click="closeDevice"
                :disabled="disavleClose"
                >断开连接</el-button
              >
            </el-row> -->
            <br />
            <el-row>
              <el-col :span="6">
                <el-form-item label="归属单位" prop="deptId">
                  <treeselect v-model="formData.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属单位" :disabled="detailsDis" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="formData.name" placeholder="请输入" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="身份证" prop="idCard">
                  <el-input v-model="formData.idCard" placeholder="请输入" maxlength="18" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="联系方式" prop="telphone">
                  <el-input v-model="formData.telphone" placeholder="请输入" maxlength="11" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="性别" prop="sex">
                  <el-select v-model="formData.sex" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in sexOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出生日期" prop="birthday">
                  <el-date-picker v-model="formData.birthday" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{ width: '100%' }" placeholder="请选择" clearable :disabled="detailsDis">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="籍贯" prop="nativePlace">
                  <el-input v-model="formData.nativePlace" placeholder="请输入" clearable :style="{ width: '100%' }">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="政治面貌" prop="politicalStatus">
                  <el-select v-model="formData.politicalStatus" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in politicalStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="职务" prop="job">
                  <el-select v-model="formData.job" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in jobOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="职业技能" prop="vocationSkill">
       <!--            <el-select v-model="formData.vocationSkill" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in vocationSkillOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select> -->
                  <el-input v-model="formData.vocationSkill" placeholder="请输入" clearable :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="技术特长" prop="technicalExpertise">
                <!--   <el-select v-model="formData.technicalExpertise" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in technicalExpertiseOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select> -->
                  <el-input v-model="formData.technicalExpertise" placeholder="请输入" clearable :style="{ width: '100%' }"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="健康状况" prop="healthCondition">
                  <el-select v-model="formData.healthCondition" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in healthConditionOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="formData.healthCondition == 2">
                <el-form-item label="病名" prop="sickName">
                  <el-input v-model="formData.sickName" placeholder="病名" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="formData.healthCondition == 3">
                <el-form-item label="伤残类别" prop="disabilityType">
                  <el-select v-model="formData.disabilityType" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in disabilityNatureOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="formData.healthCondition == 3">
                <el-form-item label="伤残级别" prop="disabilityLevel">
                  <el-select v-model="formData.disabilityLevel" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in disabilityLevelOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!--  <el-col :span="6">
                <el-form-item label="学历" prop="educationBackground">
                  <el-select v-model="formData.educationBackground" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in educationBackgroundOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
              <el-col :span="24">
                <el-col :span="12">
                  <el-form-item label="户口" prop="enArmyBeforePlace">
                    <el-input v-model="formData.enArmyBeforePlace" placeholder="请输入入伍前户口所在地" show-word-limit clearable :style="{ width: '100%' }"></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-form-item label="现住址:">
                  <el-select v-model="formData.addrProvice" @change="provincefunction" placeholder="请选择省" style="width: 20%">
                    <el-option v-for="item in province" :key="item.proviceId" :label="item.proviceName" :value="item.proviceId">
                    </el-option>
                  </el-select>
                  <el-select v-model="formData.addrCity" @change="cityfunction" placeholder="请选择市" style="width: 20%">
                    <el-option v-for="item in city" :key="item.cityId" :label="item.cityName" :value="item.cityId">
                    </el-option>
                  </el-select>
                  <el-select v-model="formData.addrCounty" @change="areafunction" placeholder="请选择区" style="width: 20%">
                    <el-option v-for="item in area" :key="item.countyId" :label="item.countyName" :value="item.countyId">
                    </el-option>
                  </el-select>
                  <el-select v-model="formData.addrTown" @change="townfunction" placeholder="请选择乡镇" style="width: 20%">
                    <el-option v-for="item in street" :key="item.townId" :label="item.townName" :value="item.townId">
                    </el-option>
                  </el-select>
                  <el-select v-model="formData.addrVillage" placeholder="请选择社区/村" style="width: 20%">
                    <el-option v-for="item in village" :key="item.villageId" :label="item.villageName" :value="item.villageId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="文化程度" prop="education">
                  <el-select v-model="formData.education" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in educationOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="学位" prop="degree">
                  <el-select v-model="formData.degree" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in degreeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="毕业院校" prop="graduationSchool">
                  <el-input v-model="formData.graduationSchool" placeholder="请输入" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="所学专业" prop="major">
                  <el-input v-model="formData.major" placeholder="请输入" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="入伍部队" prop="enlistmentArmy">
                  <el-input v-model="formData.enlistmentArmy" placeholder="请输入" clearable :style="{ width: '100%' }" :disabled="detailsDis" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="入伍时间" prop="enlistmentTime">
                  <el-date-picker v-model="formData.enlistmentTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{ width: '100%' }" placeholder="请选择" clearable :disabled="detailsDis"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="入伍地点" prop="enlistmentPlace">
                  <el-input v-model="formData.enlistmentPlace" placeholder="请输入" clearable :style="{ width: '100%' }" :disabled="detailsDis" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="服役军种" prop="militaryService">
                  <el-select v-model="formData.militaryService" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in militaryServiceOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="退伍证号" prop="veteransCertificate">
                  <el-input v-model="formData.veteransCertificate" placeholder="请输入" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="退役时间" prop="veteransTime">
                  <el-date-picker v-model="formData.veteransTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{ width: '100%' }" placeholder="请选择" clearable :disabled="detailsDis"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="退役部队" prop="veteransArmy">
                  <el-input v-model="formData.veteransArmy" placeholder="请输入" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="领退伍金" prop="isReceiveVeteransMoney">
                  <el-select v-model="formData.isReceiveVeteransMoney" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in isReceiveVeteransMoneyOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="优待证编号" prop="preferentialNum">
                  <el-input v-model="formData.preferentialNum" placeholder="请输入" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="人员类别" prop="serviceReserve">
                  <el-select v-model="formData.serviceReserve" placeholder="请选择人员类别" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in serviceReserveOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="formData.serviceReserve == 1">
                <el-form-item label="干部类型" prop="ganbuType">
                  <el-select v-model="formData.ganbuType" placeholder="请选择预备役身份身份类别" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in cadreTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="干部军衔" prop="militaryRank" v-if="formData.serviceReserve == 1">
                  <el-select v-model="formData.militaryRank" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in militaryRankOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="士官军衔" prop="militaryRank" v-if="formData.serviceReserve == 2">
                  <el-select v-model="formData.militaryRank" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in sergeantRankOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="士兵军衔" prop="militaryRank" v-if="formData.serviceReserve == 3">
                  <el-select v-model="formData.militaryRank" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in solderRankOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
                <!--                 <el-form-item label="退役前军衔" prop="militaryRank" v-else>
                  <el-select v-model="formData.militaryRank" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in militaryRankOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item> -->
              </el-col>
              <el-col :span="6" v-if="formData.serviceReserve == 2">
                <el-form-item label="专业技术等级" prop="reserveProfessionalName">
                  <el-input v-model="formData.reserveProfessionalName" placeholder="请输入" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="formData.serviceReserve == 1">
                <el-form-item label="退役职级" prop="veteransLevel">
                  <el-select v-model="formData.veteransLevel" placeholder="请选择" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in veteransLevelOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="formData.serviceReserve == 1">
                <el-form-item label="退役类别" prop="reserveStatus">
                  <el-select v-model="formData.reserveStatus" placeholder="请选择退役类别" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in reserveStatusOptionsA" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-else>
                <el-form-item label="退役类别" prop="reserveStatus">
                  <el-select v-model="formData.reserveStatus" placeholder="请选择退役类别" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in reserveStatusOptionsB" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="专业名称" prop="reserveProfessionalName">
                  <el-input v-model="formData.reserveProfessionalName" placeholder="请输入" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                  </el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="安置单位类别" prop="resettlementUnitsClass" v-if="formData.reserveStatus == 1">
                  <el-select v-model="formData.resettlementUnitsClass" placeholder="请选择安置单位类别" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in unitOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="安置单位类型" prop="resettlementUnitsType" v-if="formData.reserveStatus == 1">
                  <el-select v-model="formData.resettlementUnitsType" placeholder="请选择安置单位类型" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                    <el-option v-for="dict in unitTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="安置单位名称" prop="location" v-if="formData.reserveStatus == 1">
                  <el-input v-model="formData.location" placeholder="请输入" clearable :style="{ width: '100%' }" :disabled="detailsDis">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!--             <el-row>
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
            </el-row> -->
          </el-form>
          <div slot="footer" class="dialog-footer" v-if="detailsDis == false">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 用户导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
          <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
              <!-- <el-link type="info" style="font-size: 12px" @click="importTemplate"
            >下载模板</el-link
          > -->
            </div>
            <div class="el-upload__tip" style="color: red" slot="tip">
              提示：仅允许导入“xls”或“xlsx”格式文件！
            </div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitFileForm">确 定</el-button>
            <el-button @click="upload.open = false">取 消</el-button>
          </div>
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
  getStaffBase,
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
      detailsDis: false,
      // 上传路径
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: this.url + "soldier/staffBase/importData",
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
      province: [
        //区域省
      ],
      city: [
        //区域市
      ],
      area: [
        //区域区
      ],
      street: [
        //区域街道
      ],
      village: [
        //区域街道
      ],
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
        // technicalExpertise: [{
        //   required: true,
        //   message: "请选择",
        //   trigger: "change",
        // }, ],
        technicalExpertise: [{
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
        // vocationSkill: [{
        //   required: true,
        //   message: "请选择",
        //   trigger: "change",
        // }, ],
        vocationSkill: [{
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
        // spouseJob: [
        //   {
        //     required: true,
        //     message: "请输入",
        //     trigger: "blur",
        //   },
        // ],
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
    this.getPCA();
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
    // 打开读卡服务
    openDevice() {
      axios
        .get("http://127.0.0.1:19196/OpenDevice")
        .then((res) => {
          if (res.data.resultFlag == 0) {
            Message.success("打开设备成功！！！");
            this.disavleOpen = true;
            this.disavleRead = false;
            this.disavleClose = false;
          } else {
            Message.error("设备连接失败！！！");
          }
        })
        .catch((err) => {});
    },
    // 读卡
    readCard() {
      axios
        .get("http://127.0.0.1:19196/readcard")
        .then((res) => {
          console.log(res);
          if (res.data.resultFlag == 0) {
            Message.success("读卡成功！！！");
            let userInfo = res.data;
            this.formData.name = userInfo.partyName;
            this.formData.idCard = userInfo.certNumber;
            if (userInfo.gender == "男") {
              this.formData.sex = 0;
            } else {
              this.formData.sex = 1;
            }
            var str = userInfo.bornDay;
            var newStr =
              str.slice(0, 4) + "/" + str.slice(4, 6) + "/" + str.slice(-2, 8);
            let birthdate = new Date(newStr);
            this.formData.birthday = birthdate;
            this.formData.enArmyBeforePlace = userInfo.certAddress;
          } else {
            Message.error("读卡失败！！！");
          }
        })
        .catch((err) => {});
    },
    // 关闭读卡服务
    closeDevice() {
      axios
        .get("http://127.0.0.1:19196/CloseDevice")
        .then((res) => {
          if (res.data.resultFlag == 0) {
            this.$message.success("关闭成功！！！");
            this.disavleOpen = false;
            this.disavleRead = true;
            this.disavleClose = true;
          } else {
            Message.error("关闭失败！！！");
          }
        })
        .catch((err) => {});
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
    // 获取省市县城镇村
    getPCA() {
      getProvince()
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.province = res.data;
          }
        })
        .catch((err) => {});
    },

    provincefunction() {
      let params = {
        proviceId: this.formData.addrProvice,
      };
      getCity(params).then((res) => {
        console.log(res);
        this.city = res.data;
        console.log(this.city);
      });
    },
    cityfunction() {
      let params = {
        cityId: this.formData.addrCity,
      };
      getCounty(params)
        .then((res) => {
          console.log(res);
          this.area = res.data;
          console.log(this.area);
        })
        .catch((err) => {});
    },
    areafunction() {
      let params = {
        countyId: this.formData.addrCounty,
      };
      getTown(params)
        .then((res) => {
          console.log(res);
          this.street = res.data;
          console.log(this.street);
        })
        .catch((err) => {});
    },
    townfunction() {
      let params = {
        townId: this.formData.addrTown,
      };
      getVillage(params)
        .then((res) => {
          console.log(res);
          this.village = res.data;
          console.log(this.village);
        })
        .catch((err) => {});
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
      this.detailsDis = false;
      this.formData.serviceReserve = 3;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const staffId = row.staffId || this.ids;
      getStaffBase(staffId).then((response) => {
        this.formData = response.data;
        console.log(response)
        this.provincefunction();
        this.cityfunction();
        this.areafunction();
        this.townfunction();
        this.open = true;
        this.title = "修改人员基础信息";
        this.detailsDis = false;
      });
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      this.reset();
      const staffId = row.staffId || this.ids;
      getStaffBase(staffId).then((response) => {
        this.formData = response.data;
        this.provincefunction();
        this.cityfunction();
        this.areafunction();
        this.townfunction();
        this.open = true;
        this.title = "人员基础信息详情";
        this.detailsDis = true;
      });
    },
    /** 提交按钮 */
    submitForm() {
      if (this.formData.idCard) {
        const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (!reg.test(this.formData.idCard)) {
          return Message.error("身份证号码格式错误");
        }
      }
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
          "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .then(function() {
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
        .then(function() {
          return exportStaffBase(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
    /**
     * 上传文件之前
     * @param {Object} file
     * 1、判断文件不能过大，大于五十兆 提示
     * 2、开启遮罩层\加载中
     */
    importExcelBeforeUpload(file) {
      console.log(file);
      let params = {
        file: file.name,
        type: file.type,
      };
      importStaffBase(params)
        .then((res) => {})
        .catch((err) => {});
      let _this = this;
      _this.loading = true;
    },
    /**
     * 上传文件成功
     * @param {Object} response --- 返回值 ---msg对象
     * @param {Object} file
     * @param {Object} fileList
     * 1、处理成功与否的结果
     * 2、关闭遮罩层\加载中
     */
    importExcelSuccess: function(response, file, fileList) {
      console.log(response, file, fileList);
      let _this = this;
      if (response.success) {
        setTimeout(() => {
          _this.loading = false;
          _this.$message.success(response.msg);
        }, 800);
      } else {
        setTimeout(() => {
          _this.loading = false;
          _this.$message.error(response.msg);
        }, 800);
      }
      _this.$refs["refName"].clearFiles();
    },
    /** 下载模板操作 */
    importTemplate() {
      window.open(
        "https://sxshsyjt.com:8080/profile/upload/2020/12/10/cc54e2a5-78ef-460a-ba06-8ac78a6f524b.xlsx"
      );
    },
    // 上传按钮操作
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
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

</style>
