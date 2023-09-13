<template>
  <el-dialog width="80%" v-model="visible" :title="title" :close-on-click-modal="false" :close-on-press-escape="false">
    <!-- 培养方案 -->
    <div class="mod-programme__caselist" v-if="current == 0">
      <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
        <el-form-item prop="grade">
          <ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
        </el-form-item>
        <el-form-item prop="instituteNo">
          <ren-institute-tree v-model="dataForm.instituteNo" @change="instituteChange" placeholder="学院" nodekey="number" showType="select"></ren-institute-tree>
        </el-form-item>
        <el-form-item prop="major" v-if="dataForm.instituteNo">
          <el-select v-model="dataForm.major" placeholder="专业">
            <el-option v-for="(item, index) in majorList" :key="index" :value="item.name" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="majorDirection">
          <el-input v-model="dataForm.majorDirection" placeholder="专业方向" clearable></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="dataForm.name" placeholder="方案名称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="eduSystem">
          <ren-select v-model="dataForm.eduSystem" dict-type="edu_system" placeholder="学制"></ren-select>
        </el-form-item>
        <el-form-item prop="status">
          <ren-select v-model="dataForm.status" dict-type="verify_status" placeholder="状态"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="queryResetHandle()">重置</el-button>
        </el-form-item>
        <el-form-item v-if="hasPermission('programme:caselist:export')">
          <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
        </el-form-item>
        <el-form-item v-if="hasPermission('programme:caselist:save')">
          <el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
        </el-form-item>
        <el-form-item v-if="hasPermission('programme:caselist:delete')">
          <el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @row-click="rowClickHandle" style="width: 100%">
        <el-table-column label="" header-align="center" align="center" width="50">
          <template v-slot="scope">
            <el-radio v-model="selectForm.id" :label="scope.row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" header-align="center" align="center">
          <template v-slot="scope">
            {{ getDictLabel("verify_status", scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="方案名称" header-align="center" align="center" width="200">
          <!-- <template v-slot="scope">
            <span @click="detailHandle(scope.row)" class="primary-color">{{ scope.row.name }}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="grade" label="年级" header-align="center" align="center" width="100">
          <template v-slot="scope">
            {{ getDictLabel("grade", scope.row.grade) }}
          </template>
        </el-table-column>
        <el-table-column prop="institute" label="院系" header-align="center" align="center" width="200"></el-table-column>
        <!-- <el-table-column prop="instituteNo" label="院系编号" header-align="center" align="center"></el-table-column> -->
        <el-table-column prop="major" label="专业" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column prop="majorDirection" label="专业方向" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column prop="eduSystem" label="学制" header-align="center" align="center" width="200">
          <template v-slot="scope">
            {{ getDictLabel("edu_system", scope.row.eduSystem) }}
          </template>
        </el-table-column>
        <el-table-column prop="startGrade" label="开始学年" header-align="center" align="center" width="100">
          <template v-slot="scope">
            {{ getDictLabel("school_year", scope.row.startGrade) }}
          </template>
        </el-table-column>
        <el-table-column prop="startTerm" label="开始学期" header-align="center" align="center" width="100">
          <template v-slot="scope">
            {{ getDictLabel("term", scope.row.startTerm) }}
          </template>
        </el-table-column>
        <el-table-column prop="termType" label="学期类型" header-align="center" align="center" width="100">
          <template v-slot="scope">
            {{ getDictLabel("term_type", scope.row.termType) }}
          </template>
        </el-table-column>
        <el-table-column prop="courseType" label="修读类型" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="scoreMin" label="最少学分" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="academicDegree" label="学位" header-align="center" align="center" width="100"></el-table-column>

        <!-- <el-table-column prop="createDate" label="提交时间" header-align="center" align="center" width="100"></el-table-column> -->
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    </div>

    <!-- 课组 -->
    <div class="mod-programme__coursegroup" v-else-if="current == 1">
      <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
        <el-form-item prop="groupName">
          <el-input v-model="dataForm.groupName" placeholder="课组名" clearable></el-input>
        </el-form-item>
        <el-form-item prop="grade">
          <ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="queryResetHandle()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @row-click="rowClickHandle" style="width: 100%">
        <el-table-column label="" header-align="center" align="center" width="50">
          <template v-slot="scope">
            <el-radio v-model="selectForm.id" :label="scope.row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="groupName" label="课组名" header-align="center" align="center" width="200"></el-table-column>
        <!-- <el-table-column prop="grade" label="年级" header-align="center" align="center" width="100">
          <template v-slot="scope">
            {{ getDictLabel("grade", scope.row.grade) }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="institute" label="院系" header-align="center" align="center" width="200"></el-table-column> -->
        <el-table-column prop="scoreMin" label="最少修读学分" header-align="center" align="center" width="200"></el-table-column>
        <!--        <el-table-column prop="courseMin" label="最少修读门数" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column prop="groupMin" label="最少完成课组数" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column prop="totalCourse" label="课程总门数" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column prop="totalHours" label="课程总学时" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column prop="totalScore" label="课程总学分" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column prop="publicStatus" label="是否校公选课组" header-align="center" align="center" width="200">
          <template v-slot="scope">
            {{ getDictLabel("yesOrNo", scope.row.publicStatus) }}
          </template>
        </el-table-column> -->
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    </div>

    <!-- 课程 -->
    <div class="mod-course__courselibrary" v-else>
      <div>
        <div>变更说明</div>
        <el-card class="box-card" style="margin: 10px 0 30px 0" shadow="never">
          <el-input size="large" type="textarea" :rows="4" v-model="selectForm.description" maxlength="255" show-word-limit></el-input>
        </el-card>
      </div>
      <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
        <el-form-item prop="courseNo">
          <el-input v-model="dataForm.courseNo" placeholder="课程号" clearable></el-input>
        </el-form-item>
        <el-form-item prop="courseName">
          <el-input v-model="dataForm.courseName" placeholder="课程名" clearable></el-input>
        </el-form-item>
        <el-form-item prop="institute">
          <ren-institute-tree v-model="dataForm.institute" :deptName="dataForm.institute" placeholder="开课单位" nodekey="name" showType="select"></ren-institute-tree>
        </el-form-item>
        <el-form-item prop="courseType">
          <ren-select v-model="dataForm.courseType" dict-type="course_type" placeholder="课程分类"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="queryResetHandle()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @row-click="rowClickHandle" style="width: 100%">
        <el-table-column label="" header-align="center" align="center" width="50">
          <template v-slot="scope">
            <el-radio :disabled="disabledList[scope.row.id]" v-model="selectForm.id" :label="scope.row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="courseNo" label="课程号" header-align="center" align="center" width="120"></el-table-column>
        <el-table-column prop="courseName" label="课程名" header-align="center" align="center" width="200"></el-table-column>
        <!-- <el-table-column prop="nameEn" label="英文课程名" header-align="center" align="center" width="200"></el-table-column> -->
        <el-table-column prop="institute" label="开课单位" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column prop="score" label="学分" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="hours" label="学时" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="planGrade" label="计划学年" header-align="center" align="center" width="200">
          <template v-slot="scope">
            {{ getDictLabel("grade", scope.row.planGrade) }}
          </template>
        </el-table-column>
        <el-table-column prop="planTerm" label="计划学期" header-align="center" align="center" width="100">
          <template v-slot="scope">
            {{ getDictLabel("term", scope.row.planTerm) }}
          </template>
        </el-table-column>
        <el-table-column prop="courseType" label="课程分类" header-align="center" align="center" width="100">
          <template v-slot="scope">
            {{ getDictLabel("course_type", scope.row.courseType) }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    </div>

    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { registerDynamicToRouterAndNext } from "@/router";
import { IObject } from "@/types/interface";
import baseService from "@/service/baseService";
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  setup() {
    const state = reactive({
      visible: false,
      createdIsNeed: false,
      getDataListURL: "/programme/caselist/page",
      getDataListIsPage: true,
      exportURL: "/programme/coursegroup/export",
      deleteURL: "/programme/coursegroup",
      routeName: "/programme-coursegroup-edit",
      routePath: "/programme/coursegroup-edit",
      routeTitle: "课组",
      deleteIsBatch: true,
      title: "选择方案",
      current: 0, //  0 方案  1 选课组   2 选课程
      dataForm: {
        name: "",
        grade: "",
        status: "",
        // 方案参数
        eduSystem: "",
        majorDirection: "",
        instituteNo: "",
        major: "",
        // 课组
        groupName: "",
        // gruopId: "",
        // 课程
        courseNo: "",
        courseName: "",
        // name: "",
        institute: "",
        mode: "",
        type: "",
        courseType: ""
        // language: ""
        // status: 1,
      } as IObject,
      selectForm: {
        id: "",
        name: ""
      } as IObject,
      disabledList: {} as IObject,
      groupId: "",
      caseId: ""
    });
    return { ...useView(state), ...toRefs(state) };
  },
  watch: {
    page(val: number) {
      console.log("page-", val);
    },
    limit(val: number) {
      console.log("limit-", val);
    }
  },
  methods: {
    init() {
      this.selectForm.id = "";
      this.current = 0;
      this.title = "选择方案";
      this.visible = true;
      this.getDataListURL = "/programme/caselist/page?status=" + 1;
      this.query();
    },
    rowClickHandle(data: IObject) {
      this.selectForm = {
        ...this.selectForm,
        ...data
      };
    },
    async dataFormSubmitHandle() {
      if (this.current == 0) {
        if (this.selectForm.id) {
          // this.query();
          this.caseId = this.selectForm.id;
          this.getDataListURL = "/programme/groupcourse/page?caseId=" + this.caseId;
          this.current = 1;
          this.title = "选择课组";
          this.selectForm = {};
          this.query();
        } else {
          return this.$message.error("请选择方案！");
        }
      } else if (this.current == 1) {
        if (this.selectForm.id) {
          // 选择课程
          console.log("科组", this.selectForm);
          this.groupId = this.selectForm.groupId;
          console.log(this.groupId);
          this.getDataListURL = "/programme/casecourse/page?groupId=" + this.groupId;
          // baseService.get("/plan/plancouse/page").then((res) => {
          //   if (res.code != 0) {
          //     return this.$message.error(res.msg);
          //   }
          //   console.log("a", res);
          // });
          this.current = 2;
          this.title = "选择课程";
          this.selectForm = {};
          this.query();
          // return;
        } else {
          return this.$message.error("请选择课组！");
        }
      } else {
        // 提交课程 current=2
        if (this.selectForm.id) {
          this.$emit("confirm", this.selectForm);
          this.visible = false;
        } else {
          return this.$message.error("请选择课程！");
        }
      }
    }
  }
});
</script>
