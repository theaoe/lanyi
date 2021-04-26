<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="身份证" prop="idCard">
        <el-input
          v-model="queryParams.idCard"
          placeholder="请输入身份证"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['soldier:staffFile:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['soldier:staffFile:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['soldier:staffFile:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['soldier:staffFile:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="staffFileList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="staffFileId" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="身份证" align="center" prop="idCard" />
      <el-table-column label="出生日期" align="center" prop="birthday" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.birthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="sex" />
      <el-table-column label="政治面貌" align="center" prop="politicalStatus" />
      <el-table-column label="文化程度" align="center" prop="education" />
      <el-table-column label="健康状况" align="center" prop="healthCondition" />
      <el-table-column label="伤残级别" align="center" prop="disabilityLevel" />
      <el-table-column label="职务" align="center" prop="job" />
      <el-table-column label="技术特长" align="center" prop="technicalExpertise" />
      <el-table-column label="现住址" align="center" prop="address" />
      <el-table-column label="学历" align="center" prop="educationBackground" />
      <el-table-column label="学位" align="center" prop="degree" />
      <el-table-column label="所学专业" align="center" prop="major" />
      <el-table-column label="毕业院校" align="center" prop="graduationSchool" />
      <el-table-column label="系别" align="center" prop="department" />
      <el-table-column label="职业技能" align="center" prop="vocationSkill" />
      <el-table-column label="联系方式" align="center" prop="telphone" />
      <el-table-column label="邮政编码" align="center" prop="postCode" />
      <el-table-column label="籍贯" align="center" prop="nativePlace" />
      <el-table-column label="入伍前户口所在地" align="center" prop="enArmyBeforePlace" />
      <el-table-column label="父亲姓名" align="center" prop="fatherName" />
      <el-table-column label="母亲姓名" align="center" prop="motherName" />
      <el-table-column label="配偶姓名" align="center" prop="spouseName" />
      <el-table-column label="父亲所在单位" align="center" prop="fatherUnit" />
      <el-table-column label="母亲所在单位" align="center" prop="motherUnit" />
      <el-table-column label="配偶所在单位" align="center" prop="spouseUnit" />
      <el-table-column label="父亲职位" align="center" prop="fatherJob" />
      <el-table-column label="母亲职位" align="center" prop="motherJob" />
      <el-table-column label="配偶职位" align="center" prop="spouseJob" />
      <el-table-column label="军衔" align="center" prop="militaryRank" />
      <el-table-column label="退伍证号" align="center" prop="veteransCertificate" />
      <el-table-column label="是否领取退伍金" align="center" prop="isReceiveVeteransMoney" />
      <el-table-column label="入伍时间" align="center" prop="enlistmentTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.enlistmentTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入伍地点" align="center" prop="enlistmentPlace" />
      <el-table-column label="服役军种" align="center" prop="militaryService" />
      <el-table-column label="入伍部队" align="center" prop="enlistmentArmy" />
      <el-table-column label="退役时间" align="center" prop="veteransTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.veteransTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退役职级" align="center" prop="veteransLevel" />
      <el-table-column label="退役部队" align="center" prop="veteransArmy" />
      <el-table-column label="预备役身份类别" align="center" prop="reserveStatus" />
      <el-table-column label="安置单位" align="center" prop="resettlementUnits" />
      <el-table-column label="服预备役类别" align="center" prop="serviceReserve" />
      <el-table-column label="预备役专业名称" align="center" prop="reserveProfessionalName" />
      <el-table-column label="安置地" align="center" prop="location" />
      <el-table-column label="入伍登记表" align="center" prop="enArmyRegisterFile" />
      <el-table-column label="入伍批准书" align="center" prop="enArmyRatifyFile" />
      <el-table-column label="政治审查表" align="center" prop="poReviewFile" />
      <el-table-column label="入伍体格检查表" align="center" prop="enArmyHealthCheckFile" />
      <el-table-column label="士兵登记表" align="center" prop="privateRegisterFile" />
      <el-table-column label="学历审定表" align="center" prop="educationExamineFile" />
      <el-table-column label="专业技能考评表" align="center" prop="skillsAssessmentFile" />
      <el-table-column label="士官学员入学批准书" align="center" prop="pettyOfficerEnSchoolCheckFile" />
      <el-table-column label="士官学员毕业分配表" align="center" prop="pettyOfficerGraduationDistributionFile" />
      <el-table-column label="入党" align="center" prop="enPartyFile" />
      <el-table-column label="优秀党员" align="center" prop="excellentPartyMembersRegisterFile" />
      <el-table-column label="士兵军衔报告表" align="center" prop="soldierRankReportFile" />
      <el-table-column label="士官军衔晋升报告表" align="center" prop="soldierRankUpReportFile" />
      <el-table-column label="士官选取注册登记表" align="center" prop="soldierSelectRegisterFile" />
      <el-table-column label="士官选取考评登记表" align="center" prop="soldierSelectCheckRegisterFile" />
      <el-table-column label="士官年度考评登记表" align="center" prop="soldierYearCheckRegisterFile" />
      <el-table-column label="士官代理干部职务报告表" align="center" prop="soldierAgentCadreJobReportFile" />
      <el-table-column label="军人体系医院或上级医院诊断证明" align="center" prop="hospitalDiagnoseReportFile" />
      <el-table-column label="军人因病基本丧失工作能力医学鉴定表" align="center" prop="soldierLoseJobAbilityHospitalAppraisalFile" />
      <el-table-column label="军人残疾登记评定表" align="center" prop="soldierDeformityRegisterCheckFile" />
      <el-table-column label="调整工作审批表" align="center" prop="adjustWorkCheckApplyFile" />
      <el-table-column label="士官配偶随军审批表" align="center" prop="soldierSpousesOnBoardApplyFile" />
      <el-table-column label="士官随军配偶生活困难补助审批表" align="center" prop="soldierSpousesLifeHardSubsidyApplyFile" />
      <el-table-column label="退休士官增加退休费审批表" align="center" prop="retireSoldierAddMoneyApplyFile" />
      <el-table-column label="义务兵退出现役登记表" align="center" prop="dutySoldierOutRegisterFile" />
      <el-table-column label="士官退出现役登记表" align="center" prop="soldierOutRegisterFile" />
      <el-table-column label="退休士官安置登记表" align="center" prop="retireSoldierAftercareRegisterFile" />
      <el-table-column label="易地安置材料" align="center" prop="changeAftercareFile" />
      <el-table-column label="职业资格材料" align="center" prop="vocationalQualificationFile" />
      <el-table-column label="学历学位材料" align="center" prop="degreeFile" />
      <el-table-column label="培训教育材料" align="center" prop="trainingEducationFile" />
      <el-table-column label="公民身份证号码登记材料" align="center" prop="idCardRegisterFile" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['soldier:staffFile:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['soldier:staffFile:remove']"
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

    <!-- 添加或修改人员档案信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证" />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="政治面貌">
          <el-radio-group v-model="form.politicalStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文化程度" prop="education">
          <el-input v-model="form.education" placeholder="请输入文化程度" />
        </el-form-item>
        <el-form-item label="健康状况" prop="healthCondition">
          <el-input v-model="form.healthCondition" placeholder="请输入健康状况" />
        </el-form-item>
        <el-form-item label="伤残级别" prop="disabilityLevel">
          <el-input v-model="form.disabilityLevel" placeholder="请输入伤残级别" />
        </el-form-item>
        <el-form-item label="职务" prop="job">
          <el-input v-model="form.job" placeholder="请输入职务" />
        </el-form-item>
        <el-form-item label="技术特长" prop="technicalExpertise">
          <el-input v-model="form.technicalExpertise" placeholder="请输入技术特长" />
        </el-form-item>
        <el-form-item label="现住址" prop="address">
          <el-input v-model="form.address" placeholder="请输入现住址" />
        </el-form-item>
        <el-form-item label="学历" prop="educationBackground">
          <el-input v-model="form.educationBackground" placeholder="请输入学历" />
        </el-form-item>
        <el-form-item label="学位" prop="degree">
          <el-input v-model="form.degree" placeholder="请输入学位" />
        </el-form-item>
        <el-form-item label="所学专业" prop="major">
          <el-input v-model="form.major" placeholder="请输入所学专业" />
        </el-form-item>
        <el-form-item label="毕业院校" prop="graduationSchool">
          <el-input v-model="form.graduationSchool" placeholder="请输入毕业院校" />
        </el-form-item>
        <el-form-item label="系别" prop="department">
          <el-input v-model="form.department" placeholder="请输入系别" />
        </el-form-item>
        <el-form-item label="职业技能" prop="vocationSkill">
          <el-input v-model="form.vocationSkill" placeholder="请输入职业技能" />
        </el-form-item>
        <el-form-item label="联系方式" prop="telphone">
          <el-input v-model="form.telphone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="邮政编码" prop="postCode">
          <el-input v-model="form.postCode" placeholder="请输入邮政编码" />
        </el-form-item>
        <el-form-item label="籍贯" prop="nativePlace">
          <el-input v-model="form.nativePlace" placeholder="请输入籍贯" />
        </el-form-item>
        <el-form-item label="入伍前户口所在地" prop="enArmyBeforePlace">
          <el-input v-model="form.enArmyBeforePlace" placeholder="请输入入伍前户口所在地" />
        </el-form-item>
        <el-form-item label="父亲姓名" prop="fatherName">
          <el-input v-model="form.fatherName" placeholder="请输入父亲姓名" />
        </el-form-item>
        <el-form-item label="母亲姓名" prop="motherName">
          <el-input v-model="form.motherName" placeholder="请输入母亲姓名" />
        </el-form-item>
        <el-form-item label="配偶姓名" prop="spouseName">
          <el-input v-model="form.spouseName" placeholder="请输入配偶姓名" />
        </el-form-item>
        <el-form-item label="父亲所在单位" prop="fatherUnit">
          <el-input v-model="form.fatherUnit" placeholder="请输入父亲所在单位" />
        </el-form-item>
        <el-form-item label="母亲所在单位" prop="motherUnit">
          <el-input v-model="form.motherUnit" placeholder="请输入母亲所在单位" />
        </el-form-item>
        <el-form-item label="配偶所在单位" prop="spouseUnit">
          <el-input v-model="form.spouseUnit" placeholder="请输入配偶所在单位" />
        </el-form-item>
        <el-form-item label="父亲职位" prop="fatherJob">
          <el-input v-model="form.fatherJob" placeholder="请输入父亲职位" />
        </el-form-item>
        <el-form-item label="母亲职位" prop="motherJob">
          <el-input v-model="form.motherJob" placeholder="请输入母亲职位" />
        </el-form-item>
        <el-form-item label="配偶职位" prop="spouseJob">
          <el-input v-model="form.spouseJob" placeholder="请输入配偶职位" />
        </el-form-item>
        <el-form-item label="军衔" prop="militaryRank">
          <el-input v-model="form.militaryRank" placeholder="请输入军衔" />
        </el-form-item>
        <el-form-item label="退伍证号" prop="veteransCertificate">
          <el-input v-model="form.veteransCertificate" placeholder="请输入退伍证号" />
        </el-form-item>
        <el-form-item label="是否领取退伍金" prop="isReceiveVeteransMoney">
          <el-input v-model="form.isReceiveVeteransMoney" placeholder="请输入是否领取退伍金" />
        </el-form-item>
        <el-form-item label="入伍时间" prop="enlistmentTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.enlistmentTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择入伍时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入伍地点" prop="enlistmentPlace">
          <el-input v-model="form.enlistmentPlace" placeholder="请输入入伍地点" />
        </el-form-item>
        <el-form-item label="服役军种" prop="militaryService">
          <el-input v-model="form.militaryService" placeholder="请输入服役军种" />
        </el-form-item>
        <el-form-item label="入伍部队" prop="enlistmentArmy">
          <el-input v-model="form.enlistmentArmy" placeholder="请输入入伍部队" />
        </el-form-item>
        <el-form-item label="退役时间" prop="veteransTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.veteransTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择退役时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退役职级" prop="veteransLevel">
          <el-input v-model="form.veteransLevel" placeholder="请输入退役职级" />
        </el-form-item>
        <el-form-item label="退役部队" prop="veteransArmy">
          <el-input v-model="form.veteransArmy" placeholder="请输入退役部队" />
        </el-form-item>
        <el-form-item label="预备役身份类别">
          <el-radio-group v-model="form.reserveStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="安置单位" prop="resettlementUnits">
          <el-input v-model="form.resettlementUnits" placeholder="请输入安置单位" />
        </el-form-item>
        <el-form-item label="服预备役类别" prop="serviceReserve">
          <el-input v-model="form.serviceReserve" placeholder="请输入服预备役类别" />
        </el-form-item>
        <el-form-item label="预备役专业名称" prop="reserveProfessionalName">
          <el-input v-model="form.reserveProfessionalName" placeholder="请输入预备役专业名称" />
        </el-form-item>
        <el-form-item label="安置地" prop="location">
          <el-input v-model="form.location" placeholder="请输入安置地" />
        </el-form-item>
        <el-form-item label="入伍登记表" prop="enArmyRegisterFile">
          <el-input v-model="form.enArmyRegisterFile" placeholder="请输入入伍登记表" />
        </el-form-item>
        <el-form-item label="入伍批准书" prop="enArmyRatifyFile">
          <el-input v-model="form.enArmyRatifyFile" placeholder="请输入入伍批准书" />
        </el-form-item>
        <el-form-item label="政治审查表" prop="poReviewFile">
          <el-input v-model="form.poReviewFile" placeholder="请输入政治审查表" />
        </el-form-item>
        <el-form-item label="入伍体格检查表" prop="enArmyHealthCheckFile">
          <el-input v-model="form.enArmyHealthCheckFile" placeholder="请输入入伍体格检查表" />
        </el-form-item>
        <el-form-item label="士兵登记表" prop="privateRegisterFile">
          <el-input v-model="form.privateRegisterFile" placeholder="请输入士兵登记表" />
        </el-form-item>
        <el-form-item label="学历审定表" prop="educationExamineFile">
          <el-input v-model="form.educationExamineFile" placeholder="请输入学历审定表" />
        </el-form-item>
        <el-form-item label="专业技能考评表" prop="skillsAssessmentFile">
          <el-input v-model="form.skillsAssessmentFile" placeholder="请输入专业技能考评表" />
        </el-form-item>
        <el-form-item label="士官学员入学批准书" prop="pettyOfficerEnSchoolCheckFile">
          <el-input v-model="form.pettyOfficerEnSchoolCheckFile" placeholder="请输入士官学员入学批准书" />
        </el-form-item>
        <el-form-item label="士官学员毕业分配表" prop="pettyOfficerGraduationDistributionFile">
          <el-input v-model="form.pettyOfficerGraduationDistributionFile" placeholder="请输入士官学员毕业分配表" />
        </el-form-item>
        <el-form-item label="入党" prop="enPartyFile">
          <el-input v-model="form.enPartyFile" placeholder="请输入入党" />
        </el-form-item>
        <el-form-item label="优秀党员" prop="excellentPartyMembersRegisterFile">
          <el-input v-model="form.excellentPartyMembersRegisterFile" placeholder="请输入优秀党员" />
        </el-form-item>
        <el-form-item label="士兵军衔报告表" prop="soldierRankReportFile">
          <el-input v-model="form.soldierRankReportFile" placeholder="请输入士兵军衔报告表" />
        </el-form-item>
        <el-form-item label="士官军衔晋升报告表" prop="soldierRankUpReportFile">
          <el-input v-model="form.soldierRankUpReportFile" placeholder="请输入士官军衔晋升报告表" />
        </el-form-item>
        <el-form-item label="士官选取注册登记表" prop="soldierSelectRegisterFile">
          <el-input v-model="form.soldierSelectRegisterFile" placeholder="请输入士官选取注册登记表" />
        </el-form-item>
        <el-form-item label="士官选取考评登记表" prop="soldierSelectCheckRegisterFile">
          <el-input v-model="form.soldierSelectCheckRegisterFile" placeholder="请输入士官选取考评登记表" />
        </el-form-item>
        <el-form-item label="士官年度考评登记表" prop="soldierYearCheckRegisterFile">
          <el-input v-model="form.soldierYearCheckRegisterFile" placeholder="请输入士官年度考评登记表" />
        </el-form-item>
        <el-form-item label="士官代理干部职务报告表" prop="soldierAgentCadreJobReportFile">
          <el-input v-model="form.soldierAgentCadreJobReportFile" placeholder="请输入士官代理干部职务报告表" />
        </el-form-item>
        <el-form-item label="军人体系医院或上级医院诊断证明" prop="hospitalDiagnoseReportFile">
          <el-input v-model="form.hospitalDiagnoseReportFile" placeholder="请输入军人体系医院或上级医院诊断证明" />
        </el-form-item>
        <el-form-item label="军人因病基本丧失工作能力医学鉴定表" prop="soldierLoseJobAbilityHospitalAppraisalFile">
          <el-input v-model="form.soldierLoseJobAbilityHospitalAppraisalFile" placeholder="请输入军人因病基本丧失工作能力医学鉴定表" />
        </el-form-item>
        <el-form-item label="军人残疾登记评定表" prop="soldierDeformityRegisterCheckFile">
          <el-input v-model="form.soldierDeformityRegisterCheckFile" placeholder="请输入军人残疾登记评定表" />
        </el-form-item>
        <el-form-item label="调整工作审批表" prop="adjustWorkCheckApplyFile">
          <el-input v-model="form.adjustWorkCheckApplyFile" placeholder="请输入调整工作审批表" />
        </el-form-item>
        <el-form-item label="士官配偶随军审批表" prop="soldierSpousesOnBoardApplyFile">
          <el-input v-model="form.soldierSpousesOnBoardApplyFile" placeholder="请输入士官配偶随军审批表" />
        </el-form-item>
        <el-form-item label="士官随军配偶生活困难补助审批表" prop="soldierSpousesLifeHardSubsidyApplyFile">
          <el-input v-model="form.soldierSpousesLifeHardSubsidyApplyFile" placeholder="请输入士官随军配偶生活困难补助审批表" />
        </el-form-item>
        <el-form-item label="退休士官增加退休费审批表" prop="retireSoldierAddMoneyApplyFile">
          <el-input v-model="form.retireSoldierAddMoneyApplyFile" placeholder="请输入退休士官增加退休费审批表" />
        </el-form-item>
        <el-form-item label="义务兵退出现役登记表" prop="dutySoldierOutRegisterFile">
          <el-input v-model="form.dutySoldierOutRegisterFile" placeholder="请输入义务兵退出现役登记表" />
        </el-form-item>
        <el-form-item label="士官退出现役登记表" prop="soldierOutRegisterFile">
          <el-input v-model="form.soldierOutRegisterFile" placeholder="请输入士官退出现役登记表" />
        </el-form-item>
        <el-form-item label="退休士官安置登记表" prop="retireSoldierAftercareRegisterFile">
          <el-input v-model="form.retireSoldierAftercareRegisterFile" placeholder="请输入退休士官安置登记表" />
        </el-form-item>
        <el-form-item label="易地安置材料" prop="changeAftercareFile">
          <el-input v-model="form.changeAftercareFile" placeholder="请输入易地安置材料" />
        </el-form-item>
        <el-form-item label="职业资格材料" prop="vocationalQualificationFile">
          <el-input v-model="form.vocationalQualificationFile" placeholder="请输入职业资格材料" />
        </el-form-item>
        <el-form-item label="学历学位材料" prop="degreeFile">
          <el-input v-model="form.degreeFile" placeholder="请输入学历学位材料" />
        </el-form-item>
        <el-form-item label="培训教育材料" prop="trainingEducationFile">
          <el-input v-model="form.trainingEducationFile" placeholder="请输入培训教育材料" />
        </el-form-item>
        <el-form-item label="公民身份证号码登记材料" prop="idCardRegisterFile">
          <el-input v-model="form.idCardRegisterFile" placeholder="请输入公民身份证号码登记材料" />
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
import { listStaffFile, getStaffFile, delStaffFile, addStaffFile, updateStaffFile, exportStaffFile } from "@/api/soldier/staffFile";

export default {
  name: "StaffFile",
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
      // 人员档案信息表格数据
      staffFileList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        idCard: null,
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
  },
  methods: {
    /** 查询人员档案信息列表 */
    getList() {
      this.loading = true;
      listStaffFile(this.queryParams).then(response => {
        this.staffFileList = response.rows;
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
        staffFileId: null,
        name: null,
        idCard: null,
        birthday: null,
        sex: null,
        politicalStatus: 0,
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
        reserveStatus: 0,
        resettlementUnits: null,
        serviceReserve: null,
        reserveProfessionalName: null,
        location: null,
        enArmyRegisterFile: null,
        enArmyRatifyFile: null,
        poReviewFile: null,
        enArmyHealthCheckFile: null,
        privateRegisterFile: null,
        educationExamineFile: null,
        skillsAssessmentFile: null,
        pettyOfficerEnSchoolCheckFile: null,
        pettyOfficerGraduationDistributionFile: null,
        enPartyFile: null,
        excellentPartyMembersRegisterFile: null,
        soldierRankReportFile: null,
        soldierRankUpReportFile: null,
        soldierSelectRegisterFile: null,
        soldierSelectCheckRegisterFile: null,
        soldierYearCheckRegisterFile: null,
        soldierAgentCadreJobReportFile: null,
        hospitalDiagnoseReportFile: null,
        soldierLoseJobAbilityHospitalAppraisalFile: null,
        soldierDeformityRegisterCheckFile: null,
        adjustWorkCheckApplyFile: null,
        soldierSpousesOnBoardApplyFile: null,
        soldierSpousesLifeHardSubsidyApplyFile: null,
        retireSoldierAddMoneyApplyFile: null,
        dutySoldierOutRegisterFile: null,
        soldierOutRegisterFile: null,
        retireSoldierAftercareRegisterFile: null,
        changeAftercareFile: null,
        vocationalQualificationFile: null,
        degreeFile: null,
        trainingEducationFile: null,
        idCardRegisterFile: null,
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
      this.ids = selection.map(item => item.staffFileId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加人员档案信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const staffFileId = row.staffFileId || this.ids
      getStaffFile(staffFileId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改人员档案信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.staffFileId != null) {
            updateStaffFile(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStaffFile(this.form).then(response => {
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
      const staffFileIds = row.staffFileId || this.ids;
      this.$confirm('是否确认删除人员档案信息编号为"' + staffFileIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStaffFile(staffFileIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有人员档案信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportStaffFile(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
