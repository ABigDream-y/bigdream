<template>
  <div class="mod-plan__createPlan">
    <div style="padding: 0 0 20px 0;">
      <el-button type="primary" @click="fromCaseCreatePlan">从培养方案生成教学计划目录</el-button>
      <!-- <span @click="showSafeDialog" style="color: #409EFF;cursor: pointer;padding: 0 10px;">注意事项⚠</span> -->
    </div>
    <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item prop="startGrade">
        <ren-select v-model="dataForm.startGrade" dict-type="school_year" placeholder="所属学年"></ren-select>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="dataForm.name" placeholder="方案名称"></el-input>
      </el-form-item>
      <el-form-item prop="instituteNo">
        <ren-institute-tree v-model="dataForm.instituteNo" :deptName="dataForm.institute" @change="instituteChange"
          placeholder="学院" nodekey="number" showType="select"></ren-institute-tree>
      </el-form-item>
      <el-form-item prop="major" v-if="dataForm.instituteNo">
        <el-select v-model="dataForm.major" placeholder="专业">
          <el-option @click="majorChange(item)" v-for="(item,index) in majorList" :key="index" :value="item.name"
            :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="grade" v-if="dataForm.grade">
        <el-select v-model="dataForm.grade" placeholder="年级">
          <el-option v-for="(item, index) in gradeList" :key="index" :value="item.name" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="level">
        <el-input v-model="dataForm.level" placeholder="方案层次"></el-input>
      </el-form-item>
      <el-form-item prop="status">
        <ren-select v-model="dataForm.status" dict-type="create_status" placeholder="状态"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryResetHandle()">重置</el-button>
      </el-form-item>
      <el-form-item v-if="hasPermission('plan:plan:export')">
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item v-if="hasPermission('plan:plan:delete')">
        <el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
      style="width: 100%" :default-sort="defaultSort" @sort-change="dataListSortChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="startGrade" label="所属学年" header-align="center" align="center"
        width="150"></el-table-column>
      <el-table-column prop="startTerm" label="所属学期" header-align="center" align="center" width="150"></el-table-column>
      <el-table-column prop="name" label="方案名称" header-align="center" align="center" min-width="200"></el-table-column>
      <el-table-column prop="level" label="方案层次" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="grade" label="年级" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="institute" label="院系" header-align="center" align="center"
        min-width="200"></el-table-column>
      <el-table-column prop="major" label="专业" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="majorDirection" label="专业方向" header-align="center" align="center"
        width="200"></el-table-column>

      <el-table-column prop="status" label="状态" header-align="center" align="center" width="100">
        <template v-slot="scope">
          {{ getDictLabel("create_status", scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" width="200"
        sortable></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('plan:plan:update')" type="text" size="small"
            @click="detailHandle(scope.row, 'detail')">详情</el-button>
          <!-- 以下按钮具体方法待完善 -->
          <el-button type="text" size="small" @click="detailHandle(scope.row, 'planDetail')">计划明细</el-button>
          <el-button v-if="scope.row.status == 1" type="text" size="small"
            @click="createPlan(scope.row)">生成计划</el-button>
          <el-button v-else type="text" size="small" @click="detailHandle(scope.row, 'compare')">对比</el-button>
          <el-button v-if="hasPermission('plan:plan:delete')" type="text" size="small"
            @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
      layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

    <createPlanDialog v-if="createPlanVisible" ref="createPlanDialog" @refreshDataList="getDataList"></createPlanDialog>
    <safeDialog ref="safeDialog"></safeDialog>
    <createPlanProgressDialog ref="createPlanProgressDialog" @refreshDataList="getDataList"></createPlanProgressDialog>
  </div>
</template>

<script lang="ts">
  import useView from "@/hooks/useView";
  import { defineComponent, reactive, toRefs } from "vue";
  import AddOrUpdate from "./plansettinginstitute-add-or-update.vue";
  import { IObject } from "@/types/interface";
  import createPlanDialog from "./createPlanDialog.vue";
  import safeDialog from "./safeDialog.vue";
  import createPlanProgressDialog from "./createPlanProgressDialog.vue";
  import { registerDynamicToRouterAndNext } from "@/router";
  export default defineComponent({
    components: {
      AddOrUpdate,
      createPlanDialog,
      safeDialog,
      createPlanProgressDialog
    },
    setup() {
      const state = reactive({
        createPlanVisible: false,
        getDataListURL: "/plan/plan/page",
        getDataListIsPage: true,
        exportURL: "/plan/plan/export",
        deleteURL: "/plan/plan",
        routeName: '/plan-planDetail-edit',
        routePath: '/plan/planDetail-edit',
        routeTitle: '教学计划生成管理',
        deleteIsBatch: true,
        majorList: [] as IObject[],
        gradeList: [] as IObject[],
        dataForm: {
          id: "",
          planId: "",
          score: "",
          teachingHours: "",
          updateDate: "",
          updater: "",
          weekHours: "",
          hours: "",
          description: "",
          creator: "",
          createDate: "",
          courseType: "",
          courseShape: "",
          courseNo: "",
          courseName: "",
          computerHours: "",
          name: "",
          grade: "",
          institute: "",
          instituteNo: "",
          major: "",
          majorDirection: "",
          status: "",
          level: "",
          startGrade: ""
        },
        defaultSort: {
          prop: "createDate",
          order: "descending"
        },
        order: "desc",
        orderField: "create_date",
        showDialog: false
      });
      return { ...useView(state), ...toRefs(state) };
    },
    watch: {

    },
    methods: {
      createPlan(data : IObject) {

        this.$refs["createPlanProgressDialog"].showDialog();
        this.$refs["createPlanProgressDialog"].request(data);
      },
      fromCaseCreatePlan() {
        this.createPlanVisible = true;
        this.$nextTick(() => {
          this.$refs["createPlanDialog"].showDialog();
        })

      },
      showSafeDialog() {
        this.$refs["safeDialog"].showDialog();
      },
      detailHandle(data : IObject, tab : String) {
        console.log("data", data);
        const routeParams = {
          routeName: `plan-planDetail-edit__${data.id}`,
          title: `教学计划生成管理 - ${data.name}`,
          path: `/plan/planDetail-edit`,
          query: {
            planId: data.id,
            _mt: `教学计划生成管理 - ${data.name}`,
            tab: tab
          }
        };
        registerDynamicToRouterAndNext(routeParams);
      },
      // 学院变更
      instituteChange(data ?: IObject) {
        if (data) {
          this.dataForm.instituteNo = data.number;
          this.dataForm.institute = data.name;
          // this.dataForm.majorNo = "";
          this.dataForm.major = "";
          this.majorList = data.children;
        } else {
          this.dataForm.instituteNo = "";
          this.dataForm.institute = "";
          // this.dataForm.majorNo = "";
          this.dataForm.major = "";
          this.majorList = [];
        }
      },
      // 专业变更
      majorChange(data : IObject) {
        this.dataForm.grade = "";
        this.gradeList = data.children;
      }
    }
  });
</script>