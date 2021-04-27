<template>
  <el-row :gutter="0">
    <el-col
      :span="15"
      style="
        padding-top: 10px;
        margin: 5px;
        height: 88vh;
        box-shadow: 0px 1px 3px #e5e6e7;
      "
    >
      <el-scrollbar>
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>档案信息</span>
            <el-button
              style="float: right; padding: 1px 0"
              type="text"
              @click="submitForm"
              >点击保存</el-button
            >
          </div>
          <div style="height: 79vh">
            <div style="margin: 0 0 10px 200px; width: 500px">
              <el-input
                placeholder="请输入身份证"
                v-model="idCard"
                class="input-with-select"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="getStaffFiles"
                ></el-button>
              </el-input>
            </div>
            <el-form
              ref="formData"
              :model="formData"
              :rules="rules"
              label-width="100px"
              size="mini"
            >
              <!--基础资料-->
              <el-row class="el-row2">
                <el-row type="flex" justify="center">
                  <el-col :span="8">
                    <el-form-item
                      label="档案托管单位"
                      prop="name"
                      label-width="120px"
                    >
                      <el-input
                        v-model="formData.name"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      label="档案编号"
                      prop="name"
                      label-width="120px"
                    >
                      <el-input
                        v-model="formData.name"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="归属单位" prop="deptId">
                      <treeselect
                        v-model="formData.deptId"
                        :options="deptOptions"
                        :show-count="true"
                        placeholder="请选择归属单位"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="姓名" prop="name">
                      <el-input
                        v-model="formData.name"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="身份证" prop="idCard">
                      <el-input
                        v-model="formData.idCard"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
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
                      >
                        <el-option
                          v-for="dict in sexOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="parseInt(dict.dictValue)"
                        >
                        </el-option>
                      </el-select>
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
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="政治面貌" prop="politicalStatus">
                      <el-select
                        v-model="formData.politicalStatus"
                        placeholder="请选择"
                        clearable
                        :style="{ width: '100%' }"
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
                  <el-col :span="6" v-if="formData.healthCondition == 2">
                    <el-form-item label="病名" prop="sickName">
                      <el-input
                        v-model="formData.sickName"
                        placeholder="病名"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-if="formData.healthCondition == 3">
                    <el-form-item label="伤残类别" prop="disabilityType">
                      <el-select
                        v-model="formData.disabilityType"
                        placeholder="请选择"
                        clearable
                        :style="{ width: '100%' }"
                      >
                        <el-option
                          v-for="dict in disabilityNatureOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="parseInt(dict.dictValue)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-if="formData.healthCondition == 3">
                    <el-form-item label="伤残级别" prop="disabilityLevel">
                      <el-select
                        v-model="formData.disabilityLevel"
                        placeholder="请选择"
                        clearable
                        :style="{ width: '100%' }"
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
                    <el-form-item label="学历" prop="educationBackground">
                      <el-select
                        v-model="formData.educationBackground"
                        placeholder="请选择"
                        clearable
                        :style="{ width: '100%' }"
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
                  <el-col :span="24">
                    <el-form-item label="籍贯" prop="nativePlace">
                      <el-input
                        v-model="formData.nativePlace"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="户口" prop="enArmyBeforePlace">
                      <el-input
                        v-model="formData.enArmyBeforePlace"
                        placeholder="请输入入伍前户口所在地"
                        show-word-limit
                        clearable
                        :style="{ width: '100%' }"
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="现住址:">
                      <el-select
                        v-model="formData.addrProvice"
                        @change="provincefunction"
                        placeholder="请选择省"
                        style="width: 20%"
                      >
                        <el-option
                          v-for="item in province"
                          :key="item.proviceId"
                          :label="item.proviceName"
                          :value="item.proviceId"
                        >
                        </el-option>
                      </el-select>
                      <el-select
                        v-model="formData.addrCity"
                        @change="cityfunction"
                        placeholder="请选择市"
                        style="width: 20%"
                      >
                        <el-option
                          v-for="item in city"
                          :key="item.cityId"
                          :label="item.cityName"
                          :value="item.cityId"
                        >
                        </el-option>
                      </el-select>
                      <el-select
                        v-model="formData.addrCounty"
                        @change="areafunction"
                        placeholder="请选择区"
                        style="width: 20%"
                      >
                        <el-option
                          v-for="item in area"
                          :key="item.countyId"
                          :label="item.countyName"
                          :value="item.countyId"
                        >
                        </el-option>
                      </el-select>
                      <el-select
                        v-model="formData.addrTown"
                        @change="townfunction"
                        placeholder="请选择乡镇"
                        style="width: 20%"
                      >
                        <el-option
                          v-for="item in street"
                          :key="item.townId"
                          :label="item.townName"
                          :value="item.townId"
                        >
                        </el-option>
                      </el-select>
                      <el-select
                        v-model="formData.addrVillage"
                        placeholder="请选择社区/村"
                        style="width: 20%"
                      >
                        <el-option
                          v-for="item in village"
                          :key="item.villageId"
                          :label="item.villageName"
                          :value="item.villageId"
                        >
                        </el-option>
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
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="6">
                  <el-form-item label="邮政编码" prop="postCode">
                    <el-input
                      v-model="formData.postCode"
                      placeholder="请输入"
                      clearable
                      :style="{ width: '100%' }"
                    >
                    </el-input>
                  </el-form-item>
                </el-col> -->

                  <el-col :span="6">
                    <el-form-item label="退伍证号" prop="veteransCertificate">
                      <el-input
                        v-model="formData.veteransCertificate"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="领退伍金"
                      prop="isReceiveVeteransMoney"
                    >
                      <el-select
                        v-model="formData.isReceiveVeteransMoney"
                        placeholder="请选择"
                        clearable
                        :style="{ width: '100%' }"
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
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item label="人员类别" prop="serviceReserve">
                      <el-select
                        v-model="formData.serviceReserve"
                        placeholder="请选择预备役类别"
                        clearable
                        :style="{ width: '100%' }"
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
                  <el-col :span="6" v-if="formData.serviceReserve == 1">
                    <el-form-item label="干部类型" prop="ganbuType">
                      <el-select
                        v-model="formData.ganbuType"
                        placeholder="请选择预备役身份身份类别"
                        clearable
                        :style="{ width: '100%' }"
                      >
                        <el-option
                          v-for="dict in cadreTypeOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="parseInt(dict.dictValue)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="干部军衔"
                      prop="militaryRank"
                      v-if="formData.serviceReserve == 1"
                    >
                      <el-select
                        v-model="formData.militaryRank"
                        placeholder="请选择"
                        clearable
                        :style="{ width: '100%' }"
                      >
                        <el-option
                          v-for="dict in militaryRankOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="parseInt(dict.dictValue)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="士官军衔"
                      prop="militaryRank"
                      v-else-if="formData.serviceReserve == 2"
                    >
                      <el-select
                        v-model="formData.militaryRank"
                        placeholder="请选择"
                        clearable
                        :style="{ width: '100%' }"
                      >
                        <el-option
                          v-for="dict in sergeantRankOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="parseInt(dict.dictValue)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="士兵军衔"
                      prop="militaryRank"
                      v-else-if="formData.serviceReserve == 3"
                    >
                      <el-select
                        v-model="formData.militaryRank"
                        placeholder="请选择"
                        clearable
                        :style="{ width: '100%' }"
                      >
                        <el-option
                          v-for="dict in solderRankOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="parseInt(dict.dictValue)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="退役前军衔" prop="militaryRank" v-else>
                      <el-select
                        v-model="formData.militaryRank"
                        placeholder="请选择"
                        clearable
                        :style="{ width: '100%' }"
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

                  <el-col :span="6" v-if="formData.serviceReserve == 1">
                    <el-form-item label="退役类别" prop="reserveStatus">
                      <el-select
                        v-model="formData.reserveStatus"
                        placeholder="请选择预备役身份身份类别"
                        clearable
                        :style="{ width: '100%' }"
                      >
                        <el-option
                          v-for="dict in reserveStatusOptionsA"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="parseInt(dict.dictValue)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-else>
                    <el-form-item label="退役类别" prop="reserveStatus">
                      <el-select
                        v-model="formData.reserveStatus"
                        placeholder="请选择预备役身份身份类别"
                        clearable
                        :style="{ width: '100%' }"
                      >
                        <el-option
                          v-for="dict in reserveStatusOptionsB"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="parseInt(dict.dictValue)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-if="formData.serviceReserve != 3">
                    <el-form-item label="退役职级" prop="veteransLevel">
                      <el-select
                        v-model="formData.veteransLevel"
                        placeholder="请选择"
                        clearable
                        :style="{ width: '100%' }"
                      >
                        <el-option
                          v-for="dict in veteransLevelOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="parseInt(dict.dictValue)"
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
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="专业名称"
                      prop="reserveProfessionalName"
                    >
                      <el-input
                        v-model="formData.reserveProfessionalName"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="安置单位类别" prop="resettlementUnits">
                      <el-select
                        v-model="formData.resettlementUnits"
                        placeholder="请选择安置单位类别"
                        clearable
                        :style="{ width: '100%' }"
                      >
                        <el-option
                          v-for="dict in unitOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="parseInt(dict.dictValue)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="安置单位类型"
                      prop="resettlementUnitsType"
                    >
                      <el-select
                        v-model="formData.resettlementUnitsType"
                        placeholder="请选择安置单位类型"
                        clearable
                        :style="{ width: '100%' }"
                      >
                        <el-option
                          v-for="dict in unitTypeOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="parseInt(dict.dictValue)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="安置单位名称" prop="location">
                      <el-input
                        v-model="formData.location"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="优待证编号" prop="preferentialNum">
                      <el-input
                        v-model="formData.preferentialNum"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item label="父亲" prop="fatherName">
                      <el-input
                        v-model="formData.fatherName"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所在单位" prop="fatherUnit">
                      <el-input
                        v-model="formData.fatherUnit"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="职位" prop="fatherJob">
                      <el-input
                        v-model="formData.fatherJob"
                        placeholder="请输入职位"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="母亲" prop="motherName">
                      <el-input
                        v-model="formData.motherName"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所在单位" prop="motherUnit">
                      <el-input
                        v-model="formData.motherUnit"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="职位" prop="motherJob">
                      <el-input
                        v-model="formData.motherJob"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="配偶" prop="spouseName">
                      <el-input
                        v-model="formData.spouseName"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所在单位" prop="spouseUnit">
                      <el-input
                        v-model="formData.spouseUnit"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="职位" prop="spouseJob">
                      <el-input
                        v-model="formData.spouseJob"
                        placeholder="请输入"
                        clearable
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-row>
              <!--分割线-->
              <el-divider>文件上传</el-divider>
              <!--上传文件-->
              <el-row class="el-row1" :gutter="80">
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList1"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    accept=".pdf"
                    :on-preview="previewFunction"
                    :on-success="successFunction1"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="入伍登记表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(入伍登记表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList2"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction2"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="入伍批准书"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(入伍批准书)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList3"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction3"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="政治审查表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(政治审查表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList4"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction4"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="入伍体格检查表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(入伍体格检查表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList5"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction5"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="士兵登记表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(士兵登记表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList6"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction6"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="学历审定表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(学历审定表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList7"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction7"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="专业技能考评表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(专业技能考评表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList8"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction8"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="士官学员入学批准书"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(士官学员入学批准书)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList9"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction9"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="士官学员毕业分配表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(士官学员毕业分配表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList10"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction10"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="入党(团)志愿书"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(入党(团)志愿书)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList11"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction11"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="优秀党员(团)登记表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(优秀党员(团)登记表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList12"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction12"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="士兵军衔报告表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(士兵军衔报告表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList13"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction13"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="士官军衔晋升报告表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(士官军衔晋升报告表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList14"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction14"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="士官选取注册登记表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(士官选取注册登记表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList15"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction15"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="士官选取考评登记表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(士官选取考评登记表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList16"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction16"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="士官年度考评登记表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(士官年度考评登记表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList17"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction17"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="士官代理干部职务报告表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(士官代理干部职务报告表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList18"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction18"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="军人残疾登记评定表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(军人残疾登记评定表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList19"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction19"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="调整工作审批表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(调整工作审批表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList20"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction20"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="军人体系医院或上级医院诊断证明"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(军人体系医院或上级医院诊断证明)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList21"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction21"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="士官配偶随军审批表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(士官配偶随军审批表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList22"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction22"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="士官随军配偶生活困难补助审批表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(士官随军配偶生活困难补助审批表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList23"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction23"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="退休士官增加退休费审批表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(退休士官增加退休费审批表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList24"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction24"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="军人因病基本丧失工作能力医学鉴定表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(军人因病基本丧失工作能力医学鉴定表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList25"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction25"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="士官退出现役登记表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(士官退出现役登记表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList26"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction26"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="义务兵退出现役登记表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(义务兵退出现役登记表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList27"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction27"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="退休士官安置登记表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(退休士官安置登记表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList28"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction28"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="退休士官增加退休费审批表"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(退休士官增加退休费审批表)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList29"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction29"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="易地安置材料"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(易地安置材料)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList30"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction30"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="职业资格材料"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(职业资格材料)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList31"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction31"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="学历学位材料"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(学历学位材料)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList32"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction32"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="培训教育材料"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(培训教育材料)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-upload
                    :file-list="fieldList33"
                    :action="fieldAction"
                    :before-upload="fieldBeforeUpload"
                    :on-preview="previewFunction"
                    :on-success="successFunction33"
                    :limit="1"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="公民身份证号码登记材料"
                      placement="bottom"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-upload"
                        >点击上传(公民身份证号码登记材料)</el-button
                      >
                    </el-tooltip>
                  </el-upload>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </el-scrollbar>
    </el-col>

    <el-col :span="8" style="padding-top: 10px; margin: 5px">
      <el-card shadow="always">
        <div slot="header" class="clearfix">
          <span>文件预览</span>
        </div>
        <div style="height: 79vh">
          <iframe width="100%" height="100%" :src="src" />
          <!--<el-button-group v-show="src!=''">-->
          <!--<el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="prePage">上一页</el-button>-->
          <!--<el-button type="primary" size="mini" @click="nextPage">下一页<i-->
          <!--class="el-icon-arrow-right el-icon&#45;&#45;right"></i></el-button>-->
          <!--</el-button-group>-->
          <!--<div style="marginTop: 10px; color: #409EFF" v-show="src!=''">{{ pageNum }} / {{ pageTotalNum }}</div>-->
          <!--<pdf-->
          <!--:page="pageNum"-->
          <!--:src="src"-->
          <!--@progress="loadedRatio = $event"-->
          <!--@num-pages="pageTotalNum=$event"-->
          <!--&gt;-->
          <!--</pdf>-->
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import {
  getProvince,
  getCity,
  getCounty,
  getTown,
  getVillage,
} from "@/api/soldier/staffFile";
import {
  addStaffFile,
  updateStaffFile,
  getStaffFile,
  getStaffFileByIdCard,
} from "@/api/soldier/staffFile";
import pdf from "vue-pdf";
import { validateIDCard, validateMobile, validEmail} from "@/utils/validate.js";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: {
    pdf,
    Treeselect,
  },
  props: [],
  data() {
    return {
      // 所属树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,

      idCard: "",
      officeUrl: "https://sxshsyjt.com:8012/onlinePreview?url=", // word预览地址
      src: "", // pdf 文件路径
      pageNum: 1,
      pageTotalNum: 1,
      loadedRatio: 0,
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
      fieldList1: [],
      fieldList2: [],
      fieldList3: [],
      fieldList4: [],
      fieldList5: [],
      fieldList6: [],
      fieldList7: [],
      fieldList8: [],
      fieldList9: [],
      fieldList10: [],
      fieldList11: [],
      fieldList12: [],
      fieldList13: [],
      fieldList14: [],
      fieldList15: [],
      fieldList16: [],
      fieldList17: [],
      fieldList18: [],
      fieldList19: [],
      fieldList20: [],
      fieldList21: [],
      fieldList22: [],
      fieldList23: [],
      fieldList24: [],
      fieldList25: [],
      fieldList26: [],
      fieldList27: [],
      fieldList28: [],
      fieldList29: [],
      fieldList30: [],
      fieldList31: [],
      fieldList32: [],
      fieldList33: [],
      formData: {
        staffFileId: "",
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
        field1: "",
        field2: "",
        field3: "",
        field4: "",
        field5: "",
        field6: "",
        field7: "",
        field8: "",
        field9: "",
        field10: "",
        field11: "",
        field12: "",
        field13: "",
        field14: "",
        field15: "",
        field16: "",
        field17: "",
        field18: "",
        field19: "",
        field20: "",
        field21: "",
        field22: "",
        field23: "",
        field24: "",
        field25: "",
        field26: "",
        field27: "",
        field28: "",
        field29: "",
        field30: "",
        field31: "",
        field32: "",
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
      rules: {
        name: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
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
            message: "请输入",
            trigger: "blur",
          },
        ],
        vocationSkill: [
          {
            required: true,
            message: "请输入",
            trigger: "change",
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
        veteransArmy: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
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
            message: "请选择",
            trigger: "change",
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
      fieldAction: "https://sxshsyjt.com:8080/common/upload",
    };
  },
  created() {
    // 获取人员所属树
    this.getTreeselect();
    // 获取省市县数据
    this.getPCA();

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
  computed: {},
  watch: {},
  methods: {
    // 上一页
    prePage() {
      let page = this.pageNum;
      page = page > 1 ? page - 1 : this.pageTotalNum;
      this.pageNum = page;
    },

    // 下一页
    nextPage() {
      let page = this.pageNum;
      page = page < this.pageTotalNum ? page + 1 : 1;
      this.pageNum = page;
    },

    submitForm() {
      this.formData.field1 = JSON.stringify(this.fieldList1);
      this.formData.field2 = JSON.stringify(this.fieldList2);
      this.formData.field3 = JSON.stringify(this.fieldList3);
      this.formData.field4 = JSON.stringify(this.fieldList4);
      this.formData.field5 = JSON.stringify(this.fieldList5);
      this.formData.field6 = JSON.stringify(this.fieldList6);
      this.formData.field7 = JSON.stringify(this.fieldList7);
      this.formData.field8 = JSON.stringify(this.fieldList8);
      this.formData.field9 = JSON.stringify(this.fieldList9);
      this.formData.field10 = JSON.stringify(this.fieldList10);
      this.formData.field11 = JSON.stringify(this.fieldList11);
      this.formData.field12 = JSON.stringify(this.fieldList12);
      this.formData.field13 = JSON.stringify(this.fieldList13);
      this.formData.field14 = JSON.stringify(this.fieldList14);
      this.formData.field15 = JSON.stringify(this.fieldList15);
      this.formData.field16 = JSON.stringify(this.fieldList16);
      this.formData.field17 = JSON.stringify(this.fieldList17);
      this.formData.field18 = JSON.stringify(this.fieldList18);
      this.formData.field19 = JSON.stringify(this.fieldList19);
      this.formData.field20 = JSON.stringify(this.fieldList20);
      this.formData.field21 = JSON.stringify(this.fieldList21);
      this.formData.field22 = JSON.stringify(this.fieldList22);
      this.formData.field23 = JSON.stringify(this.fieldList23);
      this.formData.field24 = JSON.stringify(this.fieldList24);
      this.formData.field25 = JSON.stringify(this.fieldList25);
      this.formData.field26 = JSON.stringify(this.fieldList26);
      this.formData.field27 = JSON.stringify(this.fieldList27);
      this.formData.field28 = JSON.stringify(this.fieldList28);
      this.formData.field29 = JSON.stringify(this.fieldList29);
      this.formData.field30 = JSON.stringify(this.fieldList30);
      this.formData.field31 = JSON.stringify(this.fieldList31);
      this.formData.field32 = JSON.stringify(this.fieldList32);
      this.$refs["formData"].validate((valid) => {
        if (valid) {
          updateStaffFile(this.formData).then((response) => {
            this.msgSuccess("新增成功");
            this.$refs["formData"].resetFields();
          });
        }
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
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    // 文件上传后的钩子函数
    previewFunction(file) {
      this.src = file.url;
    },
    successFunction1(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList1.push(op);
    },
    successFunction2(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList2.push(op);
    },
    successFunction3(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList3.push(op);
    },
    successFunction4(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList4.push(op);
    },
    successFunction5(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList5.push(op);
    },
    successFunction6(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList6.push(op);
    },
    successFunction7(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList7.push(op);
    },
    successFunction8(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList8.push(op);
    },
    successFunction9(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList9.push(op);
    },
    successFunction10(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList10.push(op);
    },
    successFunction11(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList11.push(op);
    },
    successFunction12(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList12.push(op);
    },
    successFunction13(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList13.push(op);
    },
    successFunction14(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList14.push(op);
    },
    successFunction15(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList15.push(op);
    },
    successFunction16(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList16.push(op);
    },
    successFunction17(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList17.push(op);
    },
    successFunction18(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList18.push(op);
    },
    successFunction19(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList19.push(op);
    },
    successFunction20(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList20.push(op);
    },
    successFunction21(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList21.push(op);
    },
    successFunction22(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList22.push(op);
    },
    successFunction23(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList23.push(op);
    },
    successFunction24(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList24.push(op);
    },
    successFunction25(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList25.push(op);
    },
    successFunction26(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList26.push(op);
    },
    successFunction27(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList27.push(op);
    },
    successFunction28(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList28.push(op);
    },
    successFunction29(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList29.push(op);
    },
    successFunction30(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList30.push(op);
    },
    successFunction31(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList31.push(op);
    },
    successFunction32(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList32.push(op);
    },
    successFunction33(response, file) {
      this.src = this.officeUrl + encodeURIComponent(file.response.url);
      let op = {
        name: file.name,
        url: this.src,
      };
      this.fieldList33.push(op);
    },
    fieldBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 10;
      if (!isRightSize) {
        this.$message.error("文件大小超过 10MB");
      }
      return isRightSize;
    },
    // 通过身份证获取详情
    getStaffFiles() {
      getStaffFileByIdCard(this.idCard).then((response) => {
        let res = response.data;
        this.formData.deptId = res.deptId;
        this.formData.addrProvice = res.addrProvice;
        this.formData.addrCity = res.addrCity;
        this.formData.addrCounty = res.addrCounty;
        this.formData.addrTown = res.addrTown;
        this.formData.addrVillage = res.addrVillage;
        this.provincefunction();
        this.cityfunction();
        this.areafunction();
        this.townfunction();
        this.formData.addStaffFile = res.addStaffFile;
        this.formData.staffFileId = res.staffFileId;
        this.formData.name = res.name;
        this.formData.idCard = res.idCard;
        this.formData.birthday = res.birthday;
        this.formData.sex = res.sex;
        this.formData.politicalStatus = res.politicalStatus;
        this.formData.education = res.education;
        this.formData.healthCondition = res.healthCondition;
        this.formData.disabilityLevel = res.disabilityLevel;
        this.formData.job = res.job;
        this.formData.technicalExpertise = res.technicalExpertise;
        this.formData.address = res.address;
        this.formData.educationBackground = res.educationBackground;
        this.formData.degree = res.degree;
        this.formData.major = res.major;
        this.formData.graduationSchool = res.graduationSchool;
        this.formData.department = res.department;
        this.formData.vocationSkill = res.vocationSkill;
        this.formData.telphone = res.telphone;
        this.formData.postCode = res.postCode;
        this.formData.nativePlace = res.nativePlace;
        this.formData.enArmyBeforePlace = res.enArmyBeforePlace;
        this.formData.fatherName = res.fatherName;
        this.formData.motherName = res.motherName;
        this.formData.spouseName = res.spouseName;
        this.formData.fatherUnit = res.fatherUnit;
        this.formData.motherUnit = res.motherUnit;
        this.formData.spouseUnit = res.spouseUnit;
        this.formData.fatherJob = res.fatherJob;
        this.formData.motherJob = res.motherJob;
        this.formData.spouseJob = res.spouseJob;
        this.formData.militaryRank = res.militaryRank;
        this.formData.veteransCertificate = res.veteransCertificate;
        this.formData.isReceiveVeteransMoney = res.isReceiveVeteransMoney;
        this.formData.enlistmentTime = res.enlistmentTime;
        this.formData.enlistmentPlace = res.enlistmentPlace;
        this.formData.militaryService = res.militaryService;
        this.formData.enlistmentArmy = res.enlistmentArmy;
        this.formData.veteransTime = res.veteransTime;
        this.formData.veteransLevel = res.veteransLevel;
        this.formData.veteransArmy = res.veteransArmy;
        this.formData.reserveStatus = res.reserveStatus;
        this.formData.resettlementUnits = res.resettlementUnits;
        this.formData.serviceReserve = res.serviceReserve;
        this.formData.reserveProfessionalName = res.reserveProfessionalName;
        this.formData.location = res.location;
        this.fieldList1 = JSON.parse(res.field1);
        this.fieldList2 = JSON.parse(res.field2);
        this.fieldList3 = JSON.parse(res.field3);
        this.fieldList4 = JSON.parse(res.field4);
        this.fieldList5 = JSON.parse(res.field5);
        this.fieldList6 = JSON.parse(res.field6);
        this.fieldList7 = JSON.parse(res.field7);
        this.fieldList8 = JSON.parse(res.field8);
        this.fieldList9 = JSON.parse(res.field9);
        this.fieldList10 = JSON.parse(res.field10);
        this.fieldList11 = JSON.parse(res.field11);
        this.fieldList12 = JSON.parse(res.field12);
        this.fieldList13 = JSON.parse(res.field13);
        this.fieldList14 = JSON.parse(res.field14);
        this.fieldList15 = JSON.parse(res.field15);
        this.fieldList16 = JSON.parse(res.field16);
        this.fieldList17 = JSON.parse(res.field17);
        this.fieldList18 = JSON.parse(res.field18);
        this.fieldList19 = JSON.parse(res.field19);
        this.fieldList20 = JSON.parse(res.field20);
        this.fieldList21 = JSON.parse(res.field21);
        this.fieldList22 = JSON.parse(res.field22);
        this.fieldList23 = JSON.parse(res.field23);
        this.fieldList24 = JSON.parse(res.field24);
        this.fieldList25 = JSON.parse(res.field25);
        this.fieldList26 = JSON.parse(res.field26);
        this.fieldList27 = JSON.parse(res.field27);
        this.fieldList28 = JSON.parse(res.field28);
        this.fieldList29 = JSON.parse(res.field29);
        this.fieldList30 = JSON.parse(res.field30);
        this.fieldList31 = JSON.parse(res.field31);
        this.fieldList32 = JSON.parse(res.field32);
      });
    },
  },
};
</script>

<style scoped>
.el-upload__tip {
  line-height: 1.2;
}

.scroll {
  height: 100px;
  overflow-y: hidden;
  overflow-x: hidden;
}

.el-scrollbar__wrap {
  overflow-x: hidden !important;
}

.el-scrollbar {
  height: 100%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.clearfix {
}

.el-form-item {
  border-radius: 4px;
  background-color: beige;
}

.el-row1 >>> .el-col {
  margin: 0px;
  padding: 0px;
  height: 80px;
}

.el-row2 >>> .el-col {
  margin: 0px;
  padding: 0px;
  height: 50px;
}
</style>
